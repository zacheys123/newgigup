export type UserData = {
  isClient: boolean;
  isMusician: boolean;
  firstLogin: boolean;
  clerkId: string;
  gigsBooked?: number; // Add this
  earnings?: number; // Add this
};

export type SubscriptionData = {
  isPro: boolean;
  nextBillingDate: Date | null;
};

export type DashboardData = {
  user: UserData;
  subscription: SubscriptionData;
};
