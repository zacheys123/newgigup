// utils/filterUtils.ts
import { GigProps } from "@/types/giginterface";

interface FilterOptions {
  searchQuery?: string;
  category?: string;
  location?: string;
  scheduler?: string;
  timelineOption?: string;
}

export const filterGigs = (gigs: GigProps[], options: FilterOptions) => {
  if (!gigs) return [];

  return gigs.filter((gig) => {
    // Search query filter
    if (options.searchQuery) {
      const normalizedSearch = normalizeString(options.searchQuery);
      const gigTitle = normalizeString(gig.title);
      const gigDescription = normalizeString(gig.description);
      const gigCategory = normalizeString(gig.category);

      if (
        !gigTitle.includes(normalizedSearch) &&
        !gigDescription.includes(normalizedSearch) &&
        !gigCategory.includes(normalizedSearch)
      ) {
        return false;
      }
    }

    // Category filter
    if (options.category && options.category !== "all") {
      if (normalizeString(gig.category) !== normalizeString(options.category)) {
        return false;
      }
    }

    // Location filter
    if (options.location && options.location !== "all") {
      if (normalizeString(gig.location) !== normalizeString(options.location)) {
        return false;
      }
    }

    // Scheduler filter
    if (options.scheduler && options.scheduler !== "all") {
      if (options.scheduler === "pending" && !gig.isPending) {
        return false;
      }
      if (options.scheduler === "notPending" && gig.isPending) {
        return false;
      }
    }

    // Timeline option filter
    if (options.timelineOption && options.timelineOption !== "all") {
      if (gig.gigtimeline !== options.timelineOption) {
        return false;
      }
    }

    return true;
  });
};

const normalizeString = (str?: string) =>
  str
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") || "";
