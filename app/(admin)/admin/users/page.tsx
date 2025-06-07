import UserDetailPage from "@/components/admin/UserDetailPage";
import UsersTable from "@/components/admin/UserTable"; // 👈 Make sure this exists
import { getUsers, getUserById, RoleType } from "@/lib/adminActions";
import { checkEnvironment } from "@/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getCurrentUserRole() {
  try {
    const res = await fetch(`${checkEnvironment()}/api/admin/verify-role`, {
      headers: {
        Cookie: cookies().toString(),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("API Error:", await res.text());
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export default async function AdminUsersPage({
  searchParams = {},
}: {
  searchParams?: {
    query?: string;
    role?: RoleType;
    page?: string;
    userid?: string;
  };
}) {
  const userRole = await getCurrentUserRole();
  const allowedRoles = ["super", "support"];

  if (typeof userRole !== "string" || !allowedRoles.includes(userRole)) {
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

  const { userid, query = "", role = "all", page = "1" } = searchParams;

  // ✅ If a specific user is requested, show the user detail page
  if (userid) {
    try {
      const user = await getUserById(userid);
      const plainUser = JSON.parse(JSON.stringify(user));
      if (!user) return notFound();
      return (
        <div className="p-4">
          <UserDetailPage user={plainUser} />
        </div>
      );
    } catch (err) {
      return (
        <div className="p-4 text-red-600">
          Failed to load user details: {(err as Error).message}
        </div>
      );
    }
  }

  // ✅ Otherwise, render the full user table
  const currentPage = parseInt(page, 10);
  const { users, totalPages, totalUsers } = await getUsers(
    query,
    role,
    currentPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <UsersTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        initialQuery={query}
        initialRole={role}
      />
    </div>
  );
}
