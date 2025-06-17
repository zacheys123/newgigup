// app/dashboard/[userId]/bookings/page.tsx

import BookingsList from "@/components/gig/dashboard/BookingsList";
import Pagination from "@/components/gig/dashboard/Pagination";
import SearchFilters from "@/components/gig/dashboard/SearchAndFilter";
import { getBookedGigs } from "@/lib/actions/dashboard.actions";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit = 6;

  const {
    data: bookedGigs,
    total,
    filters,
  } = await getBookedGigs(params.userId, {
    page,
    limit,
    search:
      typeof searchParams.search === "string" ? searchParams.search : undefined,
    location:
      typeof searchParams.location === "string"
        ? searchParams.location
        : undefined,
    category:
      typeof searchParams.category === "string"
        ? searchParams.category
        : undefined,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Bookings</h1>

      <SearchFilters
        locations={filters?.locations || []}
        categories={filters?.categories || []}
      />

      <BookingsList gigs={bookedGigs} />

      <Pagination totalPages={Math.ceil(total / limit)} currentPage={page} />
    </div>
  );
}
