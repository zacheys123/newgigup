"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import UserDetailPage from "@/components/admin/UserDetailPage";
import UsersTable, { UserProps } from "@/components/admin/UserTable";
import { RoleType } from "@/lib/adminActions";
import { PageProps } from "@/types/admininterfaces";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const userid = searchParams.get("userid") || undefined;
  const query = searchParams.get("query") || "";
  const role = (searchParams.get("role") as RoleType) || "all";
  const page = searchParams.get("page") || "1";

  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<PageProps | null>(null);
  const [users, setUsers] = useState<UserProps[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const allowedRoles = ["super", "support"];

  useEffect(() => {
    // Get role
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/admin/verify-role");
        const data = await res.json();
        setUserRole(data.role);
      } catch (err) {
        console.error("Failed to fetch role", err);
        setUserRole(null);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    if (!userRole || !allowedRoles.includes(userRole)) return;

    const fetchData = async () => {
      try {
        if (userid) {
          const res = await fetch(`/api/admin/user/${userid}`);
          const data = await res.json();
          setUser(data);
        } else {
          const res = await fetch(
            `/api/admin/users?query=${query}&role=${role}&page=${page}`
          );
          const data = await res.json();

          // Transform to match UserProps
          const transformedUsers: UserProps[] = data.users.map(
            (u: UserProps) => ({
              _id: u._id,
              clerkId: u.clerkId,
              picture: u.picture,
              firstname: u.firstname,
              lastname: u.lastname,
              email: u.email ?? "no-email@example.com", // fallback
              username: u.username ?? "unknown",
              isMusician: u.isMusician ?? false,
              isClient: u.isClient ?? false,
              isAdmin: u.isAdmin ?? false,
              createdAt: new Date(u.createdAt),
              status: u.status,
            })
          );

          setUsers(transformedUsers);

          setTotalPages(data.totalPages);
          setTotalUsers(data.totalUsers);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, [userRole, userid, query, role, page]);

  if (userRole && !allowedRoles.includes(userRole)) {
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

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (userid && user) {
    return (
      <div className="p-4">
        <UserDetailPage user={user} />
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
        currentPage={parseInt(page)}
        totalPages={totalPages}
        totalUsers={totalUsers}
        initialQuery={query}
        initialRole={role}
      />
    </div>
  );
}
