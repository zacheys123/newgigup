import { RoleStatusCard } from "./RoleStatusCard";

export function MusicianDashboard({
  gigsBooked,
  earnings,
}: {
  gigsBooked: number;
  earnings: number;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-white">Your Performance Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <RoleStatusCard title="Gigs Booked" value={gigsBooked} trend="up" />
        <RoleStatusCard
          title="Earnings (KES)"
          value={earnings}
          format="currency"
        />
      </div>
    </>
  );
}
