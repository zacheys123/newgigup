"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useMemo, useCallback } from "react";
import { AppealStatus, BannedUserTableItem } from "@/types/appeal";
import { DataTablePagination } from "./DataPagination";

// types/table.ts
export interface AppealsTableMeta {
  onStatusChange: (id: string, status: AppealStatus) => Promise<void>;
  updatingId: string | null;
  darkMode: boolean;
}
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  onRowSelection?: (selectedRows: string[]) => void;
  meta?: AppealsTableMeta;
}

export function DataTable<TData>({
  columns,
  data,
  loading,
  onRowSelection,
  meta,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    meta,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Notify parent component of selected rows with debouncing
  useEffect(() => {
    if (!onRowSelection) return;

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => (row.original as BannedUserTableItem)._id);

    onRowSelection(selectedRows);
  }, [rowSelection, onRowSelection, table]);

  // Memoize table header groups to prevent unnecessary re-renders
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);

  // Memoize row model to prevent unnecessary re-renders
  const rowModel = useMemo(
    () => table.getRowModel(),
    [table, sorting, columnFilters, rowSelection]
  );

  // Virtualization would be better here for large datasets
  const renderTableBody = useCallback(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Loading...
          </TableCell>
        </TableRow>
      );
    }

    if (!rowModel.rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      );
    }

    return rowModel.rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [loading, rowModel, columns]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
