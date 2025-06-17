// components/dashboard/TimelineView.tsx
"use client";
import { GigProps } from "@/types/giginterface";

export default function TimelineView({ gigs }: { gigs: GigProps[] }) {
  const groupedByYear = gigs.reduce((acc, gig) => {
    const year = new Date(gig.scheduleDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(gig);
    return acc;
  }, {} as Record<number, GigProps[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedByYear)
        .sort(([a], [b]) => parseInt(b) - parseInt(a))
        .map(([year, yearGigs]) => (
          <div key={year} className="space-y-4">
            <h2 className="text-xl font-bold text-white">{year}</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-700" />

              <div className="space-y-6">
                {yearGigs
                  .sort(
                    (a, b) =>
                      new Date(b.scheduleDate).getTime() -
                      new Date(a.scheduleDate).getTime()
                  )
                  .map((gig) => (
                    <div key={gig._id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-gray-800" />

                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-amber-500/50 transition-all">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">
                            {gig.title}
                          </h3>
                          <div className="text-amber-400">
                            {gig.price} {gig.currency}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {gig.location} •{" "}
                          {new Date(gig.scheduleDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {gig.description}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
