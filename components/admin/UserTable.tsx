"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  MoreVertical,
  User,
  Mail,
  Shield,
  Music,
  Briefcase,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

interface AdminTableUser {
  _id: string;
  clerkId: string;
  picture?: string | null;
  firstname?: string;
  lastname?: string;
  email?: string;
  username: string;
  isMusician?: boolean;
  isClient?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  status?: "active" | "banned" | "pending";
}

interface UsersTableProps {
  users: AdminTableUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  initialQuery?: string;
  initialRole?: string;
}

const roleOptions = [
  { value: "all", label: "All Users", icon: <User className="w-4 h-4 mr-2" /> },
  {
    value: "admin",
    label: "Admins",
    icon: <Shield className="w-4 h-4 mr-2" />,
  },
  {
    value: "musician",
    label: "Musicians",
    icon: <Music className="w-4 h-4 mr-2" />,
  },
  {
    value: "client",
    label: "Clients",
    icon: <Briefcase className="w-4 h-4 mr-2" />,
  },
];

export default function UsersTable({
  users,
  currentPage,
  totalPages,
  totalUsers,
  initialQuery,
  initialRole,
}: UsersTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || initialQuery || "";
  const role = searchParams.get("role") || initialRole || "all";

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newQuery = formData.get("query") as string;

    const params = new URLSearchParams(searchParams);
    params.set("query", newQuery);
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("role", value);
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-lg border">
        <h1 className="text-2xl font-bold text-primary hidden md:block">
          User Management
        </h1>

        <form onSubmit={handleSearch} className="w-full md:w-auto flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="query"
              placeholder="Search users by name, email, or username..."
              defaultValue={query}
              className="pl-10 w-full md:w-80"
            />
          </div>
        </form>

        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue>
              {roleOptions.find((opt) => opt.value === role)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table and Pagination */}
      <div className="flex flex-col h-full gap-4">
        <div
          ref={tableContainerRef}
          className="rounded-xl border overflow-hidden shadow-sm flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <Table className="min-w-[800px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px] text-white">User</TableHead>
                <TableHead className="text-white">Contact</TableHead>
                <TableHead className="w-[150px] text-white">Role</TableHead>
                <TableHead className="w-[120px] text-white">Status</TableHead>
                <TableHead className="w-[120px] text-white">Joined</TableHead>
                <TableHead className="w-[100px] text-right text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Search className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No users found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => <UserTableRow key={user._id} user={user} />)
              )}
            </TableBody>
          </Table>
        </div>

        <div className="sticky bottom-0 bg-background border-t pt-4 pb-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            goToPage={goToPage}
          />
        </div>
      </div>
    </div>
  );
}

// User row
function UserTableRow({ user }: { user: AdminTableUser }) {
  const statusVariantMap: Record<
    string,
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "primary"
    | "success"
    | "warning"
  > = {
    active: "success",
    inactive: "secondary",
    banned: "destructive",
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {user.picture && user.firstname ? (
              <Image
                src={user.picture}
                alt={user.firstname.split("")[0]}
                className="rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-white">
              {user.firstname} {user.lastname}
            </div>
            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[180px] text-neutral-400">
            {user.email}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.isAdmin && (
            <Badge variant="destructive" className="gap-1">
              <Shield className="h-3 w-3" /> Admin
            </Badge>
          )}
          {user.isMusician && (
            <Badge variant="default" className="gap-1">
              <Music className="h-3 w-3" /> Musician
            </Badge>
          )}
          {user.isClient && (
            <Badge variant="secondary" className="gap-1">
              <Briefcase className="h-3 w-3" /> Client
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariantMap[user?.status ?? "inactive"]}>
          {user?.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Link href={`/admin/users?userid=${user._id}`}>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Manage user</span>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

// Pagination controls
function PaginationControls({
  currentPage,
  totalPages,
  totalUsers,
  goToPage,
}: {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  goToPage: (page: number) => void;
}) {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min(currentPage * 10, totalUsers)}
        </span>{" "}
        of <span className="font-medium">{totalUsers}</span> users
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              className="w-10 h-10 p-0"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
            className="w-10 h-10 p-0"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              className="w-10 h-10 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
