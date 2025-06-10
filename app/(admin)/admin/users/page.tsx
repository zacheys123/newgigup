// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UserDetailPage from "@/components/admin/UserDetailPage";
import UsersTable, { UserProps } from "@/components/admin/UserTable";
import { RoleType } from "@/lib/adminActions";
import { PageProps } from "@/types/admininterfaces";
export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const userid = searchParams.get("userid") || "";
  const query = searchParams.get("query") || "";
  const role = (searchParams.get("role") || "all") as RoleType;
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [users, setUsers] = useState<UserProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<PageProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check current user role
        const roleRes = await fetch("/api/admin/verify-role");
        if (!roleRes.ok) throw new Error("Unable to verify role");
        const roleData = await roleRes.json();
        setUserRole(roleData.role);

        if (!["super", "support"].includes(roleData.role)) return;

        if (userid) {
          const userRes = await fetch(`/api/admin/users/${userid}`);
          if (!userRes.ok) throw new Error("User not found");
          const userData = await userRes.json();
          setSelectedUser(userData);
        } else {
          const listRes = await fetch(
            `/api/admin/users?query=${query}&role=${role}&page=${page}`
          );
          const listData = await listRes.json();
          setUsers(listData.users);
          setTotalPages(listData.totalPages);
          setTotalUsers(listData.totalUsers);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userid, query, role, page]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (
    typeof userRole !== "string" ||
    !["super", "support"].includes(userRole)
  ) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>{`You don't have permission to view this page.`}</p>
        <p className="text-sm text-gray-500 mt-2">
          Detected role: {userRole ?? "undefined"}
        </p>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-4 text-red-600">Error loading content: {error}</div>
    );

  if (selectedUser) {
    return (
      <div className="p-4">
        <UserDetailPage user={selectedUser} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <UsersTable
        users={users}
        currentPage={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
        initialQuery={query}
        initialRole={role}
      />
    </div>
  );
}
