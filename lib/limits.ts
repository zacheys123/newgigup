import User from "@/models/user";

type UsageStats = {
  gigsPosted: number;
  gigsTaken: number;
  messageCount: number;
};

export async function getUsageStats(userId: string): Promise<UsageStats> {
  // Replace with actual MongoDB query
  const user = await User.findById(userId).lean();

  return {
    gigsPosted: user?.monthlyGigsPosted || 0,
    gigsTaken: user?.monthlyGigsBooked || 0,
    messageCount: user?.monthlyMessages || 0,
  };
}
