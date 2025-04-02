"use client";
import React, { useMemo } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { MobileSubscriptionCard } from "./MobileSubscriptionCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";

const BillingComponent = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  console.log(user);
  const plans = useMemo(() => {
    return [
      {
        name: "Free Tier",
        price: "$0",
        features: user?.isMusician
          ? [
              "Apply to 5 gigs/month",
              "Basic profile visibility",
              "Message 3 clients",
              "Performance analytics",
            ]
          : [
              "Post 3 gigs/month",
              "Browse musician profiles",
              "Message 5 musicians",
              "Basic hiring tools",
            ],
        cta: "Current Plan",
        current: true,
      },
      {
        name: "Pro Tier",
        price: user?.isMusician ? "$15/month" : "$20/month",
        features: user?.isMusician
          ? [
              "Unlimited gig applications",
              "Featured profile in search",
              "Priority in client searches",
              "Advanced analytics dashboard",
              "Direct booking options",
              "Unlimited messaging",
            ]
          : [
              "Unlimited gig postings",
              "Featured listing placement",
              "Advanced search filters",
              "Verified musician access",
              "Booking management tools",
              "Unlimited messaging",
              "Dedicated support",
            ],
        cta: "Upgrade",
        current: false,
      },
    ];
  }, [user?.isMusician]); // Recreate plans only when user type changes

  return (
    <div className="flex flex-col space-y-8">
      <div className="hidden md:grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <SubscriptionCard key={plan.name} plan={plan} />
        ))}
      </div>
      <div className="md:hidden grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <MobileSubscriptionCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default BillingComponent;
