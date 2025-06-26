import { UserProps } from "@/types/userinterfaces";

export const calculateReliability = (
  completed: number,
  canceled: number
): number => {
  const total = completed + canceled;
  return total > 0 ? Math.round((completed / total) * 100) : 100;
};

export const getReliabilityBadge = (score: number) => {
  if (score >= 90) return { text: "Elite", color: "bg-purple-600" };
  if (score >= 80) return { text: "Pro", color: "bg-blue-600" };
  if (score >= 70) return { text: "Reliable", color: "bg-green-600" };
  if (score >= 50) return { text: "Emerging", color: "bg-yellow-600" };
  return { text: "New", color: "bg-gray-600" };
};

// utils/reliability.ts
export const getUserTier = (user: UserProps) => {
  const completed = user.completedGigsCount || 0;
  const canceled = user.cancelgigCount || 0;
  const reliability = calculateReliability(completed, canceled);

  // Tier thresholds
  if (canceled > 10 && reliability < 30) return "BANNED";
  if (reliability >= 90 && completed > 50) return "ELITE";
  if (reliability >= 80) return "PRO";
  if (reliability >= 60) return "STANDARD";
  if (reliability < 40) return "WARNING";
  return "NEW";
};
