// utils/appeal.ts
import connectDb from "@/lib/connectDb";
import Appeal, { IAppeal } from "@/models/appeal";

import User from "@/models/user";
import { AppealSubmission, AppealResponse } from "@/types/appeal";

export async function submitAppeal(
  appealData: AppealSubmission
): Promise<AppealResponse> {
  try {
    await connectDb();

    const newAppeal = new Appeal({
      userId: appealData.userId,
      user: appealData.userId,
      clerkId: appealData.clerkId,
      email: appealData.email,
      banReference: appealData.banReference,
      message: appealData.message,
    });

    const savedAppeal = await newAppeal.save();
    console.log("Saved appeal:", savedAppeal); // Add this for debugging

    if (!savedAppeal) {
      console.error("Save operation returned null/undefined");
      return {
        success: false,
        error: "Failed to save appeal",
      };
    }

    return {
      success: true,
      appeal: savedAppeal,
    };
  } catch (error) {
    console.error("Appeal submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit appeal",
    };
  }
}
// lib/appeals.ts

// lib/appeal.ts
export async function getUserAppeals(
  userId: string
): Promise<IAppeal[] | null> {
  try {
    const response = await fetch(`/api/users/${userId}/appeals`);

    if (!response.ok) {
      throw new Error("Failed to fetch appeals");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user appeals:", error);
    return null;
  }
}

export async function getAppealById(appealId: string): Promise<IAppeal | null> {
  try {
    await connectDb();
    return await Appeal.findById(appealId);
  } catch (error) {
    console.error("Error fetching appeal:", error);
    return null;
  }
}

// utils/appeal.ts
// lib/appeal.ts

export const handleUnbanUsers = async (userIds: string[]): Promise<void> => {
  try {
    await connectDb();
    await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isBanned: false,
          banReason: "",
          banReference: "",
          bannedAt: null,
          banExpiresAt: null,
        },
      }
    );
  } catch (error) {
    console.error("Error unbanning users:", error);
    throw error;
  }
};

export const getBannedUsersWithAppeals = async () => {
  const bannedUsers = await User.find({ isBanned: true })
    .sort({ bannedAt: -1 })
    .limit(100)
    .lean();

  if (!bannedUsers.length) return [];

  // Fetch all appeals for banned users in one query
  const userIds = bannedUsers.map((user) => user._id.toString());
  const appeals = await Appeal.find({ userId: { $in: userIds } }).lean();

  // Map appeals to users
  return bannedUsers.map((user) => ({
    ...user,
    appeals: appeals.filter((appeal) => appeal.userId === user._id.toString()),
  }));
};
