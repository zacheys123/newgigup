"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (table.getCanPreviousPage()) table.previousPage();
            }}
            aria-disabled={!table.getCanPreviousPage()}
            className={
              !table.getCanPreviousPage()
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

        {Array.from({ length: table.getPageCount() }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={table.getState().pagination.pageIndex === i}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (table.getCanNextPage()) table.nextPage();
            }}
            aria-disabled={!table.getCanNextPage()}
            className={
              !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
