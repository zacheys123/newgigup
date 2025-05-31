"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { UserProps } from "@/types/userinterfaces";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
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

interface UsersTableProps {
  users: UserProps[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

const roleOptions = [
  { value: "all", label: "All Users" },
  { value: "admin", label: "Admins" },
  { value: "musician", label: "Musicians" },
  { value: "client", label: "Clients" },
];

export default function UsersTable({
  users,
  currentPage,
  totalPages,
  totalUsers,
}: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "all";

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
    <div className="space-y-4 p-2 sm:p-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form
          onSubmit={handleSearch}
          className="w-full sm:w-auto flex-1 sm:flex-none"
        >
          <div className="relative">
            <Input
              name="query"
              placeholder="Search users..."
              defaultValue={query}
              className="pl-8 w-full sm:w-64"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </form>

        <div className="w-full sm:w-auto">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border overflow-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">User</TableHead>
              <TableHead className="min-w-[150px]">Email</TableHead>
              <TableHead className="min-w-[120px]">Role</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => <UserTableRow key={user._id} user={user} />)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        goToPage={goToPage}
      />
    </div>
  );
}

// Extracted components for better organization
function UserTableRow({ user }: { user: UserProps }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {user.picture && (
            <Image
              src={user.picture}
              alt={user.username}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          )}
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            <div className="truncate">
              {user.firstname} {user.lastname}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              @{user.username}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.email}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.isAdmin && <Badge variant="destructive">Admin</Badge>}
          {user.isMusician && <Badge variant="outline">Musician</Badge>}
          {user.isClient && <Badge variant="secondary">Client</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Link href={`/admin/users/${user._id}`} passHref legacyBehavior>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
          >
            <a>Manage</a>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

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
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing <span className="font-medium">{(currentPage - 1) * 5 + 1}</span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * 5, totalUsers)}
        </span>{" "}
        of <span className="font-medium">{totalUsers}</span> users
      </div>
      <div className="flex items-center space-x-2 sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
