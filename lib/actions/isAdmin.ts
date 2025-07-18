import User from "@/models/user";

export async function isAdmin(id: string) {
  const curr = await User.findOne({ clerkId: id });
  return curr?.isAdmin;
}
