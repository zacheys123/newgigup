"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import ReportsTable from "@/components/admin/ReportsTable";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoaded } = useUser();
  const { user } = useCurrentUser();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reports/getReports"); // Adjust if your API path is different
        if (res.status === 401) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      // You can add role-based redirect here if needed
      if (!user?.user?.isAdmin) {
        router.push("/");
      } else {
        fetchReports();
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">User Reports</h1>
        <Skeleton className="w-full h-64 rounded-md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Reports</h1>
      <ReportsTable reports={reports} />
    </div>
  );
}
