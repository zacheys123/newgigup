// utils/typeGuards.ts
import { PageProps } from "@/components/admin/UserDetailPage";

type UserCandidate = Partial<PageProps["user"]> & {
  _id: unknown;
  username: unknown;
  email: unknown;
  // Add all other fields you need to check
};

export function isUserValid(user: unknown): user is PageProps["user"] {
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
