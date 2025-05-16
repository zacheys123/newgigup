import { GigProps } from "@/types/giginterface";
import { UserProps } from "./types/userinterfaces";
import { DashboardData } from "./types/dashboard";

interface GigConditions {
  isGigCreator: boolean;
  hasBookedGig: boolean;
  isCurrentWhoCreatedGig: boolean;
  isCurrentWhoBooked: boolean;
  canEditGig: boolean;
  formattedPrice: string;
  canPostAScheduledGig: boolean;
  allowedToBookGig: boolean;
  isProOnlyForFreeUser: boolean;
}

export const getGigConditions = (
  gig: GigProps,
  user: UserProps | null,
  myId: string,
  bookCount: number = 0,
  subscription: DashboardData
): GigConditions => {
  // Video related conditions

  // User role conditions
  const isGigCreator = gig?.postedBy?._id === myId;
  const hasBookedGig = gig?.bookCount?.some((i) => i?._id === myId) ?? false;

  const isCurrentWhoCreatedGig =
    isGigCreator && !hasBookedGig && bookCount > 0 && gig?.isTaken === false;
  const isCurrentWhoBooked = hasBookedGig && !isGigCreator;

  // Editing permissions
  const canEditGig =
    !!gig?.postedBy?._id &&
    isGigCreator &&
    bookCount === 0 &&
    gig?.isTaken === false;

  // Price formatting
  const formattedPrice = getFormattedPrice(gig);

  // Scheduling conditions
  const canPostAScheduledGig =
    isGigCreator && !hasBookedGig && gig?.isPending === true;

  const gigPrice = parseFloat(gig.price || "0");
  const isFreeUser = !subscription?.subscription?.isPro;
  const isProOnlyGig = gigPrice > 10;
  // Booking eligibility
  const allowedToBookGig =
    !!gig &&
    !!user &&
    gig?.postedBy?._id !== myId &&
    !hasBookedGig &&
    gig?.isTaken === false &&
    gig?.isPending === false &&
    !(isFreeUser && isProOnlyGig);

  return {
    isGigCreator,
    hasBookedGig,
    isCurrentWhoCreatedGig,
    isCurrentWhoBooked,
    canEditGig,
    formattedPrice,
    canPostAScheduledGig,
    allowedToBookGig,
    isProOnlyForFreeUser: isFreeUser && isProOnlyGig,
  };
};

// Helper function for price formatting
export const getFormattedPrice = (gig: GigProps): string => {
  if (!gig?.price || !gig?.currency) return "";

  switch (gig.pricerange) {
    case "thousands":
      return `${gig.price}k ${gig.currency}`;
    case "hundreds":
      return `${gig.price},00 ${gig.currency}`;
    case "tensofthousands":
      return `${gig.price}0000 ${gig.currency}`;
    case "hundredsofthousands":
      return `${gig.price},00000 ${gig.currency}`;
    default:
      return `${gig.price} ${gig.currency}`;
  }
};
