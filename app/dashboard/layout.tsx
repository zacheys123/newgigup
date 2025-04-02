import { Sidebar } from "@/components/dashboard/SideBar";
import { checkSubscription } from "@/lib/subscription";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export default async function DashboardLayout({
  req,
  children,
}: {
  req: NextRequest;
  children: React.ReactNode;
}) {
  const { userId } = getAuth(req);
  const { isPro } = await checkSubscription(userId as string);

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
