// components/dashboard/SubscriptionCard.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

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

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-6",
        plan.current
          ? "border-orange-500 bg-orange-900/10"
          : "border-gray-700 bg-gray-900"
      )}
    >
      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
      <p className="text-2xl font-bold my-4 text-white">{plan.price}</p>

      <ul className="space-y-2 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center text-gray-300">
            <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={plan.current ? "outline" : "default"}
        className="w-full"
        disabled={plan.current}
      >
        {plan.cta}
      </Button>
    </div>
  );
}
