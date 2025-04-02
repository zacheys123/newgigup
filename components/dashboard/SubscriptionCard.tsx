import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  current: boolean;
};

export function SubscriptionCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        plan.current
          ? "border-orange-500 bg-orange-500/10"
          : "border-gray-700 bg-gray-900"
      }`}
    >
      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
      <p className="mt-2 text-3xl font-semibold">
        {plan.price}
        {plan.price !== "$0" && (
          <span className="text-sm font-normal text-gray-400">/month</span>
        )}
      </p>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckIcon className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={`mt-8 w-full ${
          plan.current
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
        disabled={plan.current}
      >
        {plan.current ? (
          <span>{plan.cta}</span>
        ) : (
          <Link href="/dashboard/billing/checkout">{plan.cta}</Link>
        )}
      </Button>

      {plan.current && (
        <p className="mt-3 text-xs text-center text-gray-400">
          Renews automatically
        </p>
      )}
    </div>
  );
}
