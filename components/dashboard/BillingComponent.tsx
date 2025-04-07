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
  console.log(user);
  const isPro = subscription?.isPro ?? false;

  const plans = useMemo(() => {
    return [
      {
        name: "Free Tier",
        price: "$0",
        features: user?.user?.isMusician
          ? [
              "Apply to 5 gigs/month",
              "Basic profile visibility",
              "Message 3 clients",
              "Performance analytics",
              "7 days of access",
            ]
          : user?.user?.isClient
          ? [
              "Post 3 gigs/month",
              "Browse musician profiles",
              "Message 5 musicians",
              "Basic hiring tools",
              "7 days of access",
            ]
          : [],
        cta: isPro ? "Downgrade" : "Current Plan",
        current: !isPro,
      },
      {
        name: "Pro Tier",
        price: user?.user?.isMusician
          ? "$15/month"
          : user?.user?.isClient
          ? "$20/month"
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
