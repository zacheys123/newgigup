// utils/typeGuards.ts

import { PageProps } from "@/types/admininterfaces";

type UserCandidate = Partial<PageProps[]> & {
  // Core Identification
  _id: unknown;
  clerkId: unknown;
  username: unknown;
  email: unknown;
  phone: unknown;

  // Personal Information
  picture: unknown;
  firstname: unknown;
  lastname: unknown;
  city: unknown;
  address: unknown;
  date: unknown;
  month: unknown;
  year: unknown;

  // Professional Details
  instrument: unknown;
  experience: unknown;
  organization: unknown;
  bio: unknown;
  talentbio: unknown;
  roleType: unknown;
  djGenre: unknown;
  djEquipment: unknown;
  mcType: unknown;
  mcLanguages: unknown;
  vocalistGenre: unknown;
  verification: unknown;

  // Social & Relationships
  followers: unknown;
  followings: unknown;
  refferences: unknown;
  musicianhandles: unknown;
  musiciangenres: unknown;
  videosProfile: unknown;

  // Reviews
  allreviews: unknown;
  myreviews: unknown;

  // Status Flags
  isMusician: unknown;
  isClient: unknown;
  isBanned: unknown;
  isAdmin: unknown;
  firstLogin: unknown;
  onboardingComplete: unknown;

  // Admin Specific
  adminRole: unknown;
  adminPermissions: unknown;
  adminNotes: unknown;
  lastAdminAction: unknown;

  // Ban Information
  banReason: unknown;
  bannedAt: unknown;
  banExpiresAt: unknown;
  banReference: unknown;

  // Subscription & Billing
  tier: unknown;
  tierStatus: unknown;
  nextBillingDate: unknown;
  earnings: unknown;
  totalSpent: unknown;

  // Activity Tracking
  monthlyGigsPosted: unknown;
  monthlyMessages: unknown;
  monthlyGigsBooked: unknown;
  lastActive: unknown;
  lastBookingDate: unknown;
  gigsBookedThisWeek: unknown;

  // Timestamps
  createdAt: unknown;
  updatedAt: unknown;
};

export function isUserValid(user: unknown): user is PageProps[] {
  if (typeof user !== "object" || user === null) return false;

  const u = user as UserCandidate;

  // Required strings (non-empty)
  if (typeof u._id !== "string" || u._id.trim() === "") return false;
  if (typeof u.username !== "string" || u.username.trim() === "") return false;
  if (typeof u.email !== "string" || u.email.trim() === "") return false;
  if (typeof u.phone !== "string" || u.phone.trim() === "") return false;
  if (typeof u.city !== "string" || u.city.trim() === "") return false;
  if (typeof u.talentbio !== "string") return false;
  if (typeof u.date !== "string") return false;
  if (typeof u.month !== "string") return false;
  if (typeof u.year !== "string") return false;
  if (typeof u.createdAt !== "string") return false;

  // Required booleans
  if (typeof u.isBanned !== "boolean") return false;
  if (typeof u.isMusician !== "boolean") return false;

  // Optional strings
  if (
    u.picture !== undefined &&
    (typeof u.picture !== "string" || u.picture.trim() === "")
  )
    return false;
  if (u.firstname !== undefined && typeof u.firstname !== "string")
    return false;
  if (u.lastname !== undefined && typeof u.lastname !== "string") return false;
  if (u.roleType !== undefined && typeof u.roleType !== "string") return false;
  if (u.instrument !== undefined && typeof u.instrument !== "string")
    return false;
  if (u.vocalistGenre !== undefined && typeof u.vocalistGenre !== "string")
    return false;
  if (u.djGenre !== undefined && typeof u.djGenre !== "string") return false;
  if (u.address !== undefined && typeof u.address !== "string") return false;
  if (u.organization !== undefined && typeof u.organization !== "string")
    return false;
  if (u.adminRole !== undefined && typeof u.adminRole !== "string")
    return false;
  if (u.lastAdminAction !== undefined && typeof u.lastAdminAction !== "string")
    return false;
  if (u.banReason !== undefined && typeof u.banReason !== "string")
    return false;
  if (u.banReference !== undefined && typeof u.banReference !== "string")
    return false;

  // Optional arrays
  if (
    u.musiciangenres !== undefined &&
    (!Array.isArray(u.musiciangenres) ||
      !u.musiciangenres.every((g) => typeof g === "string"))
  )
    return false;

  if (
    u.adminPermissions !== undefined &&
    (!Array.isArray(u.adminPermissions) ||
      !u.adminPermissions.every((p) => typeof p === "string"))
  )
    return false;

  // Optional dates
  if (u.bannedAt !== undefined && !(u.bannedAt instanceof Date)) return false;
  if (u.banExpiresAt !== undefined && !(u.banExpiresAt instanceof Date))
    return false;

  return true;
}
