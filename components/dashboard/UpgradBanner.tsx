import Link from "next/link";

export function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/30 border border-orange-800 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-white">Unlock Pro Tier</h3>
          <p className="text-sm text-orange-200 mt-1">
            Get unlimited gigs, featured listings, and analytics.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md text-sm font-medium"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}
