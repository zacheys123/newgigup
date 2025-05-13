export type UserData = {
  isClient: boolean;
  isMusician: boolean;
  firstLogin: boolean;
  clerkId: string;
  gigsBooked?: number; // Add this
  gigsBookedThisWeek: { count: number; weekStart: Date };
  userearnings: number; // Add this
  gigsPosted: number; // Add this
  total: number;
  onboardingComplete: boolean;
};

export type SubscriptionData = {
  tier: string;
  isPro: boolean;
  nextBillingDate: Date | null;
  lastBookingDate: Date | null;
};

export type DashboardData = {
  user: UserData;
  subscription: SubscriptionData;
};
