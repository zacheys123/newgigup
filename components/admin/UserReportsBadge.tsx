"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function UserReportsBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsCount = async () => {
      try {
        const res = await fetch(`/api/user/reports/getReportsCount`);
        const data = await res.json();
        setCount(data.reportsCount || 0);
      } catch (error) {
        console.error("Failed to fetch reports count", error);
        setCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsCount();
  }, [userId]);

  if (loading) return <Badge variant="outline">Loading...</Badge>;
  if (count === null) return <Badge variant="outline">Error</Badge>;

  return (
    <Badge variant={count > 0 ? "destructive" : "secondary"}>
      {count} report{count !== 1 ? "s" : ""}
    </Badge>
  );
}
