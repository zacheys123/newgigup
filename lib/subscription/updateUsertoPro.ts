// /lib/subscription/updateUserToPro.ts
import User from "@/models/user";
import connectDb from "@/lib/connectDb";

export async function updateUserToPro(clerkId: string): Promise<void> {
  try {
    // Ensure database connection
    await connectDb();

    const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    console.log("Updating user with clerkId:", clerkId);

    // First try updating without the tierStatus condition
    let res = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          tier: "pro",
          tierStatus: "active",
          nextBillingDate,
        },
      },
      { new: true } // Return the updated document
    );

    // If not found, try creating if it doesn't exist
    if (!res) {
      console.log("User not found, attempting upsert");
      res = await User.findOneAndUpdate(
        { clerkId },
        {
          $setOnInsert: { clerkId }, // Only set on insert
          $set: {
            tier: "pro",
            tierStatus: "active",
            nextBillingDate,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    console.log("Update result:", res);

    if (!res) {
      throw new Error("Failed to update user to Pro tier");
    }
  } catch (error) {
    console.error("Error in updateUserToPro:", error);
    throw error; // Re-throw to handle in calling function
  }
}
