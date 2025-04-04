export type UserData = {
  isClient: boolean;
  isMusician: boolean;
  firstLogin: boolean;
  clerkId: string;
  gigsBooked?: number; // Add this
  earnings?: number; // Add this
  gigsPosted: number; // Add this
  total: number;
  onboardingComplete: boolean;
};

export type SubscriptionData = {
  tier: string;
  isPro: boolean;
  nextBillingDate: Date | null;
};

export type DashboardData = {
  user: UserData;
  subscription: SubscriptionData;
};
