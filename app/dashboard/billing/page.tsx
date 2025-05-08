// app/dashboard/billing/page.tsx

import { UsageMeter } from "@/components/dashboard/UsageMeter";
import { MobileUsageMeter } from "@/components/dashboard/MobileUsageMeter";
import GigChart from "@/components/dashboard/GigChart";
import BillingComponent from "@/components/dashboard/BillingComponent";
import { UserButton } from "@clerk/nextjs";

export default function BillingPage() {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Billing & Plans
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Manage your subscription and usage
            </p>
          </div>
          <UserButton />
        </div>

        <BillingComponent />

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Usage Tracking
          </h2>

          {/* Mobile view */}
          <div className="md:hidden space-y-3 p-3 bg-gray-900 rounded-lg">
            <div>
              <p className="text-sm text-gray-300 mb-1">Gig Postings</p>
              <MobileUsageMeter current={2} max={3} label="Gig Postings" />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Gig Applications</p>
              <MobileUsageMeter current={1} max={5} label="Gig Applications" />
            </div>
          </div>

          {/* Desktop view */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
              <UsageMeter current={2} max={3} label="Gig Postings" />
              <UsageMeter current={1} max={5} label="Gig Applications" />
            </div>

            <div className="p-4 bg-gray-900 rounded-lg">
              <GigChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
