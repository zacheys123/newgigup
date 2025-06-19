"use client";

import BookingsList from "@/components/gig/dashboard/BookingsList";
import Pagination from "@/components/gig/dashboard/Pagination";
import SearchFilters from "@/components/gig/dashboard/SearchAndFilter";
import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { GigProps } from "@/types/giginterface";

interface Filters {
  locations: string[];
  categories: string[];
}

interface GetGigsOptions {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  category?: string;
}

export default function BookingsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [bookedGigs, setBookedGigs] = useState<GigProps[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    locations: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 6;
  const search = searchParams.get("search") || undefined;
  const location = searchParams.get("location") || undefined;
  const category = searchParams.get("category") || undefined;

  const getBookedGigs = async (
    userId: string,
    options: GetGigsOptions = {}
  ) => {
    try {
      const params = new URLSearchParams();
      params.set("page", options.page?.toString() || "1");
      params.set("limit", options.limit?.toString() || "6");
      if (options.search) params.set("search", options.search);
      if (options.location) params.set("location", options.location);
      if (options.category) params.set("category", options.category);

      const response = await fetch(
        `/api/gigs/dashboard/${userId}/bookings?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching booked gigs:", error);
      return {
        data: [],
        total: 0,
        filters: {
          locations: [],
          categories: [],
        },
      };
    }
  };

  useEffect(() => {
    const fetchBookedGigs = async () => {
      setIsLoading(true);
      try {
        const { data, total, filters } = await getBookedGigs(
          params.userId as string,
          {
            page,
            limit,
            search,
            location,
            category,
          }
        );
        setBookedGigs(data);
        setTotal(total);
        setFilters(filters);
      } catch (error) {
        console.error("Failed to fetch booked gigs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedGigs();
  }, [params.userId, page, search, location, category]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSearchFilter = (newFilters: {
    search?: string;
    location?: string;
    category?: string;
  }) => {
    const newSearchParams = new URLSearchParams();
    if (newFilters.search) newSearchParams.set("search", newFilters.search);
    if (newFilters.location)
      newSearchParams.set("location", newFilters.location);
    if (newFilters.category)
      newSearchParams.set("category", newFilters.category);
    newSearchParams.set("page", "1");
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Bookings</h1>

      <SearchFilters
        locations={filters?.locations || []}
        categories={filters?.categories || []}
        onFilterChange={handleSearchFilter}
        initialValues={{
          search: search || "",
          location: location || "",
          category: category || "",
        }}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-white">Loading...</p>
        </div>
      ) : (
        <>
          <BookingsList gigs={bookedGigs} />
          <Pagination
            totalPages={Math.ceil(total / limit)}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
