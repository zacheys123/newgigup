import { RoleStatusCard } from "./RoleStatusCard";

export async function ClientDashboard() {
  //   const { activeGigs, totalSpent } = await getClientStats(userId);

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Event Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <RoleStatusCard title="Active Gigs" value={20} />
        <RoleStatusCard title="Total Spent" value={20000} format="currency" />
        {/* <QuickCreateGig /> */}
      </div>
      {/* <UpcomingBookings userId={userId} /> */}
    </>
  );
}
