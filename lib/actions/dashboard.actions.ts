// lib/actions/dashboard.actions.ts
"use server";

interface GetGigsOptions {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  category?: string;
}

export const getBookedGigs = async (
  userId: string,
  options: GetGigsOptions = {}
) => {
  try {
    const { page = 1, limit = 6, search, location, category } = options;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(location && { location }),
      ...(category && { category }),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/gigs/dashboard/${userId}/bookings?${params}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching booked gigs:", error);
    return { data: [], total: 0, filters: { locations: [], categories: [] } };
  }
};

export const getBookingHistory = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/gigs/dashboard/${userId}/history`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return [];
  }
};
