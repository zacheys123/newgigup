// components/dashboard/BookingsList.tsx
"use client";
import { GigProps } from "@/types/giginterface";

export default function BookingsList({ gigs }: { gigs: GigProps[] }) {
  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{`You haven't booked any gigs yet.`}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gigs.map((gig) => (
        <div
          key={gig._id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white">{gig.title}</h3>
          <p className="text-gray-400">{gig.location}</p>
          <p className="text-amber-400">
            {gig.price} {gig.currency}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(gig.scheduleDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
