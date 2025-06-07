"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, User, Calendar, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BannedUserTableItem } from "@/types/appeal";
import Link from "next/link";
import toast from "react-hot-toast";

export const columns: ColumnDef<BannedUserTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40, // Fixed width for checkbox column
  },
  {
    accessorKey: "username",
    header: () => <span className="font-semibold">User</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[180px]">
        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.original.username}
          </span>
          <span className="text-xs text-muted-foreground">
            ID: {row.original._id}
          </span>
        </div>
        {row.original.isBanned && (
          <Badge variant="destructive" className="ml-2">
            Banned
          </Badge>
        )}
      </div>
    ),
    size: 220, // Fixed width for user column
  },
  {
    accessorKey: "email",
    header: () => <span className="font-semibold">Email</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[220px]">
        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">{row.original.email}</span>
      </div>
    ),
    size: 250, // Fixed width for email column
  },
  {
    accessorKey: "banReason",
    header: () => <span className="font-semibold">Ban Reason</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[200px]">
        <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground">
          {row.original.banReason || (
            <span className="text-muted-foreground italic">
              No reason provided
            </span>
          )}
        </span>
      </div>
    ),
    size: 250, // Fixed width for reason column
  },
  {
    accessorKey: "bannedAt",
    header: () => <span className="font-semibold">Banned On</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[150px]">
        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-foreground">
            {new Date(row.original.bannedAt).toLocaleDateString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.bannedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    ),
    size: 180, // Fixed width for date column
  },
  {
    accessorKey: "appeals",
    header: () => <span className="font-semibold">Appeals</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[120px]">
        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Badge variant={row.original.appeals?.length ? "default" : "secondary"}>
          {row.original.appeals?.length || 0} pending
        </Badge>
      </div>
    ),
    size: 150, // Fixed width for appeals column
  },
  {
    id: "actions",
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link
          href="/admin/appeals"
          className="h-8 px-3 text-sm whitespace-nowrap flex items-center justify-center bg-gray-500 text-primary title hover:text-warning "
        >
          View Appeals
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-sm text-primary hover:text-destructive title   bg-emerald-500"
          onClick={async () => {
            try {
              const response = await fetch(
                `/api/admin/users/${row.original._id}/ban`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "unban",
                    reason: "",
                    duration: "",
                  }),
                }
              );

              if (!response.ok) throw new Error(await response.text());

              // Send realtime ban update

              toast.success("User has been unbanned");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Action failed"
              );
            }
          }}
        >
          Unban
        </Button>
      </div>
    ),
    size: 180, // Fixed width for actions column
  },
];
