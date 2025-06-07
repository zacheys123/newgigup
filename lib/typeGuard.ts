// utils/typeGuards.ts

import { PageProps } from "@/types/admininterfaces";
import mongoose from "mongoose";

type UserCandidate = Partial<PageProps[]> & {
  [key: string]: unknown;
};

function isValidDateString(dateStr: unknown): boolean {
  if (typeof dateStr !== "string") return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isGigsBookedThisWeek(
  obj: unknown
): obj is { count: number; weekStart: Date | string | null } {
  if (typeof obj !== "object" || obj === null) return false;

  const o = obj as Record<string, unknown>;

  const countValid = typeof o.count === "number";
  const weekStartValid =
    o.weekStart === null ||
    o.weekStart instanceof Date ||
    isValidDateString(o.weekStart);

  return countValid && weekStartValid;
}

export function isUserValid(user: unknown): user is PageProps {
  if (typeof user !== "object" || user === null) {
    console.log("⛔️ Not an object or null");
    return false;
  }

  const u = user as UserCandidate;

  // _id validation
  if (
    typeof u._id !== "string" &&
    !(u._id instanceof mongoose.Types.ObjectId) &&
    !mongoose.Types.ObjectId.isValid(String(u._id))
  ) {
    console.log("⛔️ Invalid _id:", u._id);
    return false;
  }

  // ✅ Required non-empty strings
  const requiredStrings = ["username", "email"];
  for (const key of requiredStrings) {
    const val = u[key as keyof typeof u];
    if (typeof val !== "string" || val.trim() === "") {
      console.log(`⛔️ Invalid required string ${key}:`, val);
      return false;
    }
  }

  // ✅ Optional strings: must be undefined or non-empty strings
  const optionalStrings = [
    "clerkId",
    "phone",
    "picture",
    "firstname",
    "lastname",
    "city",
    "address",
    "date",
    "month",
    "year",
    "instrument",
    "experience",
    "organization",
    "bio",
    "talentbio",
    "roleType",
    "djGenre",
    "djEquipment",
    "mcType",
    "mcLanguages",
    "vocalistGenre",
    "lastAdminAction",
    "adminRole",
    "banReason",
    "banReference",
    "tier",
    "tierStatus",
    "nextBillingDate",
    "earnings",
    "totalSpent",
  ];
  for (const key of optionalStrings) {
    const val = u[key as keyof typeof u];
    if (val !== undefined && (typeof val !== "string" || val.trim() === "")) {
      console.log(`⛔️ Invalid optional string ${key}:`, val);
      return false;
    }
  }

  // Validate gigsBookedThisWeek as object with count and weekStart
  if (
    u.gigsBookedThisWeek !== undefined &&
    !isGigsBookedThisWeek(u.gigsBookedThisWeek)
  ) {
    console.log("⛔️ Invalid gigsBookedThisWeek:", u.gigsBookedThisWeek);
    return false;
  }

  // ✅ Required boolean
  if (typeof u.isMusician !== "boolean") {
    console.log("⛔️ Invalid isMusician:", u.isMusician);
    return false;
  }

  // ✅ Optional booleans
  const optionalBooleans = [
    "isBanned",
    "isClient",
    "isAdmin",
    "firstLogin",
    "onboardingComplete",
  ];
  for (const key of optionalBooleans) {
    const val = u[key as keyof typeof u];
    if (val !== undefined && typeof val !== "boolean") {
      console.log(`⛔️ Invalid boolean ${key}:`, val);
      return false;
    }
  }

  // ✅ Optional arrays of strings
  const optionalStringArrays = [
    "adminPermissions",
    "musiciangenres",
    "musicianhandles",
    "followers",
    "followings",
    "refferences",
  ];
  for (const key of optionalStringArrays) {
    const val = u[key as keyof typeof u];
    if (
      val !== undefined &&
      (!Array.isArray(val) ||
        !val.every((v) => typeof v === "string" && v.trim() !== ""))
    ) {
      console.log(`⛔️ Invalid array of strings ${key}:`, val);
      return false;
    }
  }

  // ✅ Optional arrays of objects
  const optionalObjectArrays = ["videosProfile", "allreviews", "myreviews"];
  for (const key of optionalObjectArrays) {
    const val = u[key as keyof typeof u];
    if (val !== undefined && !Array.isArray(val)) {
      console.log(`⛔️ Invalid object array ${key}:`, val);
      return false;
    }
  }

  // ✅ Optional numbers
  const optionalNumbers = [
    "monthlyGigsPosted",
    "monthlyMessages",
    "monthlyGigsBooked",
  ];
  for (const key of optionalNumbers) {
    const val = u[key as keyof typeof u];
    if (val !== undefined && typeof val !== "number") {
      console.log(`⛔️ Invalid number ${key}:`, val);
      return false;
    }
  }

  // ✅ Optional Date objects
  const optionalDates = [
    "createdAt",
    "updatedAt",
    "bannedAt",
    "banExpiresAt",
    "lastActive",
    "lastBookingDate",
  ];
  for (const key of optionalDates) {
    const val = u[key as keyof typeof u];
    if (val !== undefined && !(val instanceof Date)) {
      console.log(`⛔️ Invalid date ${key}:`, val);
      return false;
    }
  }

  return true;
}
