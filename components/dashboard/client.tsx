"use client";
import { useAllGigs } from "@/hooks/useAllGigs";
import GigChart from "./GigChart";
import { RoleStatusCard } from "./RoleStatusCard";
import { UpgradeBanner } from "./UpgradBanner";
import { UsageMeter } from "./UsageMeter";
import { Calendar, DollarSign, Music } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { GigProps } from "@/types/giginterface";

interface ClientDashboardProps {
  gigsPosted?: number;
  total?: number;
}

export function ClientDashboard({
  gigsPosted = 0,
  total = 0,
}: ClientDashboardProps) {
  const { userId } = useAuth();
  const { gigs, loading } = useAllGigs();
  console.log(gigs);
  const gigsBookedAndCompleted = gigs?.filter((f: GigProps) => {
    return f?.postedBy?.clerkId === userId && f.isTaken === true;
  }).length;

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <UpgradeBanner />

      {/* Gradient Section with Soft Glow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-20 pointer-events-none"></div>
          <h3 className="font-medium text-white mb-4 text-lg relative z-10">
            Your Usage
          </h3>
          <UsageMeter current={2} max={3} label="Gig Postings" />
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-20 pointer-events-none"></div>
          <h3 className="font-medium text-white mb-4 text-lg relative z-10">
            Your Activity
          </h3>
          <GigChart />
        </div>
      </div>

      {/* Header with Animated Underline */}
      <div className="space-y-4 group">
        <h1 className="text-3xl font-bold text-white relative inline-block">
          Event Management
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group-hover:w-full"></span>
        </h1>
        <p className="text-gray-400/90 font-light">
          Overview of your gigs and spending
        </p>
      </div>

      {/* Cards with Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading && (
          <>
            {" "}
            <RoleStatusCard
              title="Gigs Posted this Month"
              value={gigsPosted}
              icon={
                <div className="p-3 rounded-full bg-purple-500/10 backdrop-blur-sm">
                  <Music className="text-purple-400" size={20} />
                </div>
              }
              trend="up"
            />
            <RoleStatusCard
              title="Gigs Booked and Completed"
              value={gigsBookedAndCompleted}
              icon={
                <div className="p-3 rounded-full bg-purple-500/10 backdrop-blur-sm">
                  <Music className="text-purple-400" size={20} />
                </div>
              }
              trend="up"
            />
          </>
        )}
        <RoleStatusCard
          title="Total Spent"
          value={total}
          format="currency"
          icon={
            <div className="p-3 rounded-full bg-green-500/10 backdrop-blur-sm">
              <DollarSign className="text-green-400" size={20} />
            </div>
          }
          trend="steady"
        />
        <RoleStatusCard
          title="Upcoming Events"
          value={5}
          icon={
            <div className="p-3 rounded-full bg-blue-500/10 backdrop-blur-sm">
              <Calendar className="text-blue-400" size={20} />
            </div>
          }
          trend="down"
        />
      </div>

      {/* Responsive Spacing */}
      <div className="h-8 md:h-12"></div>
    </div>
  );
}
