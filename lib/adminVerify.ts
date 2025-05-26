// lib/admin.ts
import User from "@/models/user";
import connectDb from "@/lib/connectDb";

export const checkAdminAccess = async (userId: string) => {
  if (!userId) return false;

  try {
    await connectDb();
    const user = await User.findOne({ clerkId: userId });
    return {
      isAdmin: user?.isAdmin || false,
      adminRole: user?.adminRole || null,
    };
  } catch (error) {
    console.error("Admin check failed:", error);
    return false;
  }
};
