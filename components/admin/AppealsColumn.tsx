// components/admin/appeals-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  User,
  Calendar,
  MessageSquare,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppealTableItem } from "@/types/appeal";
import { AppealsTableMeta } from "./DataTable";

type StatusType = "pending" | "reviewed" | "approved" | "rejected";

type StatusMap = {
  [key in StatusType]: {
    color: string;
    text: string;
  };
};
export const appealStatuses = {
  pending: "Pending",
  reviewed: "Reviewed",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export const columns: ColumnDef<AppealTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.username",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.user.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.user.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Appeal Message",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-[300px] truncate">
        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{row.original.message}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status as StatusType;
      const statusMap: StatusMap = {
        pending: { color: "bg-yellow-500", text: "Pending" },
        reviewed: { color: "bg-blue-500", text: "Reviewed" },
        approved: { color: "bg-green-500", text: "Approved" },
        rejected: { color: "bg-red-500", text: "Rejected" },
      };

      return (
        <Badge
          className={`${statusMap[status].color} hover:${statusMap[status].color}`}
        >
          {statusMap[status].text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const appeal = row.original;
      const meta = table.options.meta as AppealsTableMeta; // Type assertion

      return (
        <div className="flex gap-2">
          {appeal.status !== "approved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => meta.onStatusChange(appeal._id, "approved")}
              disabled={meta.updatingId === appeal._id}
              className="h-8 text-green-600 border-green-200 hover:bg-green-50"
            >
              {meta.updatingId === appeal._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Approve"
              )}
            </Button>
          )}
          {appeal.status !== "rejected" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => meta.onStatusChange(appeal._id, "rejected")}
              disabled={meta.updatingId === appeal._id}
              className="h-8 text-red-600 border-red-200 hover:bg-red-50"
            >
              {meta.updatingId === appeal._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
          )}
        </div>
      );
    },
  },
];
