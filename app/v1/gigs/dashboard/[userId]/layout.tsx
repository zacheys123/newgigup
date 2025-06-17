// app/dashboard/[userId]/layout.tsx
import DashboardNav from "@/components/gig/dashboard/DashboardNav";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { userId: string };
}) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <DashboardNav userId={params.userId} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
