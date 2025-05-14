"use client";
import { UserProps } from "@/types/userinterfaces";
import { GigProps } from "@/types/giginterface";
import ButtonComponent from "../ButtonComponent";

interface BookButtonProps {
  user: UserProps;
  gig: GigProps;
  loadingPostId: string;
  bookLoading: boolean;
  handleBookGig: (gig: GigProps) => Promise<void>;
}

export const BookButton = ({
  user,
  gig,
  loadingPostId,
  bookLoading,
  handleBookGig,
}: BookButtonProps) => {
  const canBook = checkBookingEligibility(user);

  if (!canBook.canBook) {
    return <div className="text-xs text-red-500 p-1">{canBook.reason}</div>;
  }

  return (
    <ButtonComponent
      variant="secondary"
      classname={`!bg-purple-600/90 hover:!bg-purple-500 h-7 text-[11px] font-normal text-white px-3 rounded transition-all`}
      onclick={() => handleBookGig(gig)}
      title={loadingPostId === gig?._id ? "Processing..." : "Book Now"}
      disabled={loadingPostId === gig?._id || bookLoading}
    />
  );
};

const checkBookingEligibility = (user: UserProps) => {
  // Pro users can always book
  if (user.subscription?.tier === "pro") {
    return { canBook: true, reason: "" };
  }

  // Free users in their first month
  const signupDate = new Date(user.createdAt);
  const oneMonthLater = new Date(signupDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const isFirstMonth = new Date() < oneMonthLater;

  if (!isFirstMonth) {
    return {
      canBook: false,
      reason: "Upgrade to Pro to continue booking",
    };
  }

  // Free users in first month - weekly limit check
  const weeklyBookings = user.gigsBookedThisWeek?.count || 0;
  if (weeklyBookings >= 3) {
    return {
      canBook: false,
      reason: "Weekly limit reached (3 gigs)",
    };
  }

  return { canBook: true, reason: "" };
};
