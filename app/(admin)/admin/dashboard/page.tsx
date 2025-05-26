import StatsCards from "@/components/admin/StatsCards";
import { getAdminStats } from "@/lib/adminActions";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <StatsCards stats={stats} />
      <div className="mt-8">{/* <RecentActivities /> */}</div>
    </div>
  );
}
