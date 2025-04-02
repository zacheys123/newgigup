import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";

export default function BillingPage() {
  const plans = [
    {
      name: "Free Tier",
      price: "$0",
      features: [
        "3 gig postings/month",
        "5 gig applications",
        "Basic analytics",
      ],
      cta: "Current Plan",
      current: true,
    },
    {
      name: "Pro Tier",
      price: "$10/month",
      features: [
        "Unlimited gigs",
        "Featured profile",
        "Advanced analytics",
        "Priority support",
      ],
      cta: "Upgrade",
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <SubscriptionCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
