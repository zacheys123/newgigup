import UsersTable from "@/components/admin/UserTable";
import { getUsers, RoleType } from "@/lib/adminActions";

export default async function AdminUsersPage({
  searchParams = {}, // Provide default empty object
}: {
  searchParams?: { query?: string; role?: RoleType; page?: string };
}) {
  // Check user role
  const userRole = await getCurrentUserRole();
  const allowedRoles = ["super", "support"];

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>{`You don't have permission to view this page.`}</p>
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
