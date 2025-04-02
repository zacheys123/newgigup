import { RoleStatusCard } from "./RoleStatusCard";

export async function MusicianDashboard() {
  //   const { gigsBooked, earnings } = await getMusicianStats(userId);

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Your Performance Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <RoleStatusCard title="Gigs Booked" value={10} trend="up" />
        <RoleStatusCard
          title="Earnings (KES)"
          value={300000}
          format="currency"
        />
        {/* <AvailabilityCalendar /> */}
      </div>
      {/* <GigRecommendations userId={userId} /> */}
    </>
  );
}
