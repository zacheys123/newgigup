import { GigProps } from "@/types/giginterface";
import { UserProps, VideoProps } from "./types/userinterfaces";

interface GigConditions {
  canShowAddGigVideos: boolean;
  isGigCreator: boolean;
  hasBookedGig: boolean;
  isCurrentWhoCreatedGig: boolean;
  isCurrentWhoBooked: boolean;
  canEditGig: boolean;
  formattedPrice: string;
  canPostAScheduledGig: boolean;
  allowedToBookGig: boolean;
}

export const getGigConditions = (
  gig: GigProps,
  user: UserProps | null,
  myId: string,
  testfilteredvids: VideoProps[] = [],
  bookCount: number = 0
): GigConditions => {
  // Video related conditions
  const canShowAddGigVideos =
    gig?.isPending === false &&
    gig?.isTaken === true &&
    gig?.bookedBy?._id === myId &&
    gig?.postedBy?._id !== myId &&
    testfilteredvids?.length < 4;

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

  // Booking eligibility
  const allowedToBookGig =
    !!gig &&
    !!user &&
    gig?.postedBy?._id !== myId &&
    !hasBookedGig &&
    gig?.isTaken === false &&
    gig?.isPending === false;

  return {
    canShowAddGigVideos,
    isGigCreator,
    hasBookedGig,
    isCurrentWhoCreatedGig,
    isCurrentWhoBooked,
    canEditGig,
    formattedPrice,
    canPostAScheduledGig,
    allowedToBookGig,
  };
};

// Helper function for price formatting
const getFormattedPrice = (gig: GigProps): string => {
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
