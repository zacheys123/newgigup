import UsersTable from "@/components/admin/UserTable";
import { getUsers, RoleType } from "@/lib/adminActions";
import { checkEnvironment } from "@/utils";
import { cookies } from "next/headers";

async function getCurrentUserRole() {
  try {
    const res = await fetch(`${checkEnvironment()}/api/admin/verify-role`, {
      headers: {
        Cookie: cookies().toString(),
      },
      // Add caching control (optional)
      next: { revalidate: 3600 }, // Revalidate every hour
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
  searchParams?: { query?: string; role?: RoleType; page?: string };
}) {
  // Check user role
  const userRole = await getCurrentUserRole();
  const allowedRoles = ["super", "support"];

  // Improved role validation
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

  const query = searchParams.query || "";
  const role = searchParams.role || "all";
  const page = parseInt(searchParams.page || "1");

  const { users, totalPages, totalUsers } = await getUsers(query, role, page);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <UsersTable
        users={users}
        currentPage={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
      />
    </div>
  );
}
