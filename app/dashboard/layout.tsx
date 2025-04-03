// app/dashboard/layout.tsx
import { MobileNav } from "@/components/dashboard/MobileNav";
import { MobileUpgradeBanner } from "@/components/dashboard/MobileUpgradeBanner";
import { Sidebar } from "@/components/dashboard/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black  ">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {" "}
        {children}
        <MobileUpgradeBanner />
      </main>
      {/* Mobile navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
