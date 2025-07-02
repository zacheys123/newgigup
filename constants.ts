import { GigProps } from "./types/giginterface";
// import { VideoProps } from "./types/userinterfaces";

export const isCreatorIsCurrentUserAndTaken = (gig: GigProps, myId: string) => {
  return (
    gig?.isTaken === true &&
    gig?.postedBy?._id === myId &&
    gig?.clientConfirmPayment?.confirmPayment
  );
};

export const isCreatorIsCurrentUserAndPendingIsFalse = (
  gig: GigProps,
  myId: string
) => {
  return (
    gig.postedBy?._id && gig?.isPending === false && gig?.postedBy?._id === myId
  );
};
export const isBookerIsCurrentUserAndPendingIsTrueTakenFalse = (
  gig: GigProps,
  myId: string
) => {
  return gig.bookedBy?._id && gig.bookedBy._id.includes(myId) && gig?.isPending;
};
// export const filterVideosWithGigIdAsTheSelectedGig = (
//   friendvideos: VideoProps[],
//   gig: GigProps
// ) => {
//   return friendvideos?.filter((video: VideoProps) => video.gigId === gig._id);
// };

// constants/breakpoints.ts
export const BREAKPOINTS = {
  MOBILE: "(max-width: 768px)",
  TABLET: "(min-width: 769px) and (max-width: 1024px)",
  DESKTOP: "(min-width: 1025px)",
};
