import User from "@/models/user";
import { Types } from "mongoose";
import connectDb from "./connectDb";
import Gig from "@/models/gigs";
import { UserFilter } from "@/types/userinterfaces";
import { PageProps } from "@/components/admin/UserDetailPage";
import { isUserValid } from "./typeGuard";

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeUsers: number;
  totalGigs: number;
  bookedGigs: number;
  revenue: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await connectDb();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    totalUsers,
    newUsersThisWeek,
    activeUsers,
    totalGigs,
    bookedGigs,
    revenueData,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    User.countDocuments({ lastActive: { $gte: oneWeekAgo } }),
    Gig.countDocuments(),
    Gig.countDocuments({ bookedBy: { $exists: true, $ne: null } }), // Modified this line
    User.aggregate([
      { $match: { tier: "pro" } },
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]),
  ]);

  return {
    totalUsers,
    newUsersThisWeek,
    activeUsers,
    totalGigs,
    bookedGigs,
    revenue: revenueData[0]?.total || 0,
  };
}

// ltype RoleType = "all" | "admin" | "musician" | "client"; // extend if needed
export type RoleType = "all" | "admin" | "musician" | "client";

export async function getUsers(
  query: string = "",
  role: RoleType,
  page: number = 1,
  limit: number = 5
) {
  await connectDb();

  const skip = (page - 1) * limit;

  const filter: UserFilter = {};

  if (query) {
    filter.$or = [
      { firstname: { $regex: query, $options: "i" } },
      { lastname: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ];
  }

  const roleFilters = {
    admin: { isAdmin: true },
    musician: { isMusician: true },
    client: { isClient: true },
  } as const;

  if (role !== "all") {
    const roleFilter = roleFilters[role as keyof typeof roleFilters];
    if (roleFilter) {
      Object.assign(filter, roleFilter);
    }
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  // In your getUsers function:
  const transformedUsers = users.map((user) => ({
    _id: user._id.toString(),
    clerkId: user.clerkId,
    picture: user.picture,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    isMusician: user.isMusician,
    isClient: user.isClient,
    isAdmin: user.isAdmin,
    createdAt: user?.createdAt,
  }));

  return {
    users: transformedUsers,
    totalPages: Math.ceil(total / limit),
    totalUsers: total,
  };
}

// actions/getUserById.ts

export async function getUserById(id: string): Promise<PageProps["user"]> {
  await connectDb();

  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id).lean();

  if (!user || !isUserValid(user)) {
    throw new Error("User not found or data is invalid");
  }

  // Convert MongoDB-specific types
  return {
    ...user,
    _id: user._id.toString(),
    bannedAt: user.bannedAt ? new Date(user.bannedAt) : undefined,
    banExpiresAt: user.banExpiresAt ? new Date(user.banExpiresAt) : undefined,
    createdAt: new Date(user.createdAt).toISOString(),
    // Handle potential array fields
    musiciangenres: user.musiciangenres || [],
    adminPermissions: user.adminPermissions || [],
  };
}
export async function getCurrentUserRole(id: string) {
  await connectDb();

  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id).lean();

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    _id: user._id.toString(),
  };
}
