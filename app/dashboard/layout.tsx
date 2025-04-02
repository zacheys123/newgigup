import { Sidebar } from "@/components/dashboard/SideBar";
import { checkEnvironment } from "@/utils";

async function getSubscription() {
  try {
    const res = await fetch(`${checkEnvironment()}/api/user/subscription`);

    if (!res.ok) {
      throw new Error("Failed to fetch subscription status");
    }
    console.log(res);

    const { isPro } = await res.json();
    return isPro;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPro = await getSubscription();
  return (
    <div className="flex h-screen bg-black">
      <Sidebar isPro={isPro} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* Optional: Add subscription status banner */}
        {!isPro && (
          <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-amber-900/30 p-4 rounded-lg">
            <p className="text-orange-300 text-sm">
              Upgrade to Pro for unlimited features
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
