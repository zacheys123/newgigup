"use client";
import React, { useMemo } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { MobileSubscriptionCard } from "./MobileSubscriptionCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";

const BillingComponent = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser();
  const { subscription } = useSubscription(userId as string);
  const isPro = subscription?.subscription?.tier === "free" ? false : true;

  console.log(subscription);
  const plans = useMemo(() => {
    return [
      {
        name: "Free Tier",
        price: "$0",
        features: user?.user?.isMusician
          ? [
              "Book to 2 gigs/week",
              "Limited Messages to clients(50msgs a month)",
              "Performance analytics",
              "30days  of access",
            ]
          : user?.user?.isClient
          ? [
              "Post 2 gigs/week",
              "Browse musician profiles and musician reviews",
              "Limited Messages to musicians(50msgs a month)",
              "30days of access",
            ]
          : [],
        cta: isPro ? "Downgrade" : "Current Plan",
        current: !isPro,
      },
      {
        name: "Pro Tier",
        price: user?.user?.isMusician
          ? "1500KES/month"
          : user?.user?.isClient
          ? "2000KES/month"
          : "",
        features: user?.user?.isMusician
          ? [
              "Unlimited gig applications",
              "Featured profile in search",
              "Priority in client searches",
              "Advanced analytics dashboard",
              "Direct booking options",
              "Unlimited messaging",
            ]
          : user?.user?.isClient
          ? [
              "Unlimited gig postings",
              "Featured listing placement",
              "Advanced search filters",
              "Verified musician access",
              "Booking management tools",
              "Unlimited messaging",
              "Dedicated support",
            ]
          : [],
        cta: isPro ? "Current Plan" : "Upgrade",
        current: isPro,
      },
    ];
  }, [user?.user?.isMusician, user?.user?.isClient, isPro]);
  return (
    <div className="flex flex-col space-y-8">
      <div className="hidden md:grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {user &&
          plans.map((plan) => <SubscriptionCard key={plan.name} plan={plan} />)}
      </div>
      <div className="md:hidden grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {user &&
          plans.map((plan) => (
            <MobileSubscriptionCard key={plan.name} plan={plan} />
          ))}
      </div>
    </div>
  );
};

export default BillingComponent;
