import User from "@/models/user";
import connectDb from "./connectDb";

type Permission =
  | "manage_users"
  | "manage_gigs"
  | "manage_content"
  | "view_analytics"
  | "manage_settings";

export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  await connectDb();

  const user = await User.findOne({ clerkId: userId });

  if (!user) return false;

  // Super admins have all permissions
  if (user.adminRole === "super") return true;

  // Check if permission is explicitly granted
  if (user.adminPermissions?.includes(permission)) return true;

  // Role-based permissions
  switch (user.adminRole) {
    case "content":
      return ["manage_content"].includes(permission);
    case "support":
      return ["manage_users", "manage_gigs"].includes(permission);
    case "analytics":
      return ["view_analytics"].includes(permission);
    default:
      return false;
  }
}
