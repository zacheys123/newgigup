// types/dashboard.ts
export type Tier = "free" | "pro" | string;

export interface WeeklyBooking {
  count: number;
  weekStart: Date | null;
}

export interface UserData {
  _id?: string;
  isClient: boolean;
  isMusician: boolean;
  firstLogin: boolean;
  clerkId: string;
  gigsBooked?: number;
  gigsBookedThisWeek: WeeklyBooking;
  userearnings: number;
  gigsPosted: number;
  total: number;
  onboardingComplete: boolean;
  createdAt: Date;
  tier: Tier;
}

export interface SubscriptionData {
  tier: Tier;
  isPro: boolean;
  nextBillingDate: Date | null;
  lastBookingDate: Date | null;
}

export interface DashboardData {
  user: UserData;
  subscription: SubscriptionData;
}

export interface BookingEligibility {
  canBook: boolean;
  reason: string | null;
  status?: "free-limit" | "pro-only" | "available"; // Added for UI states
}
