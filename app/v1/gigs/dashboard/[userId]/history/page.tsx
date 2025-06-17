// app/dashboard/[userId]/history/page.tsx

import TimelineView from "@/components/gig/dashboard/TimeLineView";
import { getBookingHistory } from "@/lib/actions/dashboard.actions";

export default async function HistoryPage({
  params,
}: {
  params: { userId: string };
}) {
  const historyGigs = await getBookingHistory(params.userId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Booking History</h1>
      <TimelineView gigs={historyGigs} />
    </div>
  );
}
