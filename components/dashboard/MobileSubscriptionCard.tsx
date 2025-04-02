// components/dashboard/MobileSubscriptionCard.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
interface Plan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  current: boolean;
}

interface SubscriptionCardProps {
  plan: Plan;
}
export function MobileSubscriptionCard({ plan }: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4",
        plan.current
          ? "border-orange-500 bg-orange-900/10"
          : "border-gray-700 bg-gray-900"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{plan.name}</h3>
          <p className="text-lg font-bold my-2 text-white">{plan.price}</p>
        </div>
        <Link
          href={plan.current ? "#" : "/dashboard/billing"}
          className={cn(
            "px-3 py-1 rounded text-sm",
            plan.current
              ? "bg-transparent border border-gray-600 text-gray-400"
              : "bg-orange-600 hover:bg-orange-700 text-white"
          )}
        >
          {plan.cta}
        </Link>
      </div>

      <div className="mt-3 space-y-1">
        {plan.features.slice(0, 3).map((feature: string) => (
          <p key={feature} className="text-xs text-gray-300 flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            {feature}
          </p>
        ))}
        {plan.features.length > 3 && (
          <p className="text-xs text-gray-400">
            +{plan.features.length - 3} more
          </p>
        )}
      </div>
    </div>
  );
}
