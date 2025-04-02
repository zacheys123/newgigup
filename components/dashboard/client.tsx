import GigChart from "./GigChart";
import { RoleStatusCard } from "./RoleStatusCard";
import { UpgradeBanner } from "./UpgradBanner";
import { UsageMeter } from "./UsageMeter";
import { Calendar, DollarSign, Music } from "lucide-react";

export async function ClientDashboard() {
  //   const { activeGigs, totalSpent } = await getClientStats(userId);

  return (
    <div className="space-y-8">
      <UpgradeBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
          <h3 className="font-medium text-white mb-4 text-lg">Your Usage</h3>
          <UsageMeter current={2} max={3} label="Gig Postings" />
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
          <h3 className="font-medium text-white mb-4 text-lg">Your Activity</h3>
          <GigChart />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Event Management</h1>
        <p className="text-gray-400">Overview of your gigs and spending</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RoleStatusCard
          title="Active Gigs"
          value={20}
          icon={<Music className="text-purple-400" />}
          trend="up"
        />
        <RoleStatusCard
          title="Total Spent"
          value={20000}
          format="currency"
          icon={<DollarSign className="text-green-400" />}
          trend="steady"
        />
        <RoleStatusCard
          title="Upcoming Events"
          value={5}
          icon={<Calendar className="text-blue-400" />}
          trend="down"
        />
      </div>

      {/* Additional sections can be added here */}
      {/* <UpcomingBookings userId={userId} /> */}
    </div>
  );
}
