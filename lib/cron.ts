import cron from "node-cron";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";

// Function to reset monthly gigs count
async function resetMonthlyGigsCount() {
  try {
    await connectDb();
    const result = await User.updateMany(
      {},
      { $set: { monthlyGigsPosted: 0 } }
    );
    console.log(
      `✅ Reset monthly gigs count for ${result.modifiedCount} users`
    );
  } catch (error) {
    console.error("❌ Error resetting monthly gigs count:", error);
  }
}

// Schedule the cron job (runs at midnight on the 1st of every month)
export function startCronJobs() {
  cron.schedule("0 0 1 * *", () => {
    console.log("⏰ Running monthly gigs reset...");
    resetMonthlyGigsCount();
  });

  console.log("🚀 Cron jobs initialized");
}
