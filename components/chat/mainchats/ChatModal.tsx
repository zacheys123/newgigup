import React, { useEffect, useState } from "react";
import { UserProps } from "@/types/userinterfaces";
import { useAllGigs } from "@/hooks/useAllGigs";
import Image from "next/image";
import { User } from "lucide-react";
import { fonts } from "@/utils";
import useStore from "@/app/zustand/useStore";

interface ProfileModalProps {
  user: UserProps;
  onClose: () => void;
}

const ChatModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const [musicianCount, setMusicianGigCount] = useState<number>(0);
  const [clientGigCount, setClientGigCount] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const { gigs } = useAllGigs();
  const { setRefferenceModalOpen } = useStore();
  // useEffect(() => {
  //   if (!user._id || !gigs?.gigs) return;

  //   // const keyToCheck = user.isMusician
  //   //   ? "bookedBy"
  //   //   : user.isClient
  //   //   ? "postedBy"
  //   //   : ""; // Dynamically set key

  //   const count = gigs.gigs.filter(
  //     (gig) => gig?.bookedBy?._id === user._id
  //   ).length;
  //   const clientCount = gigs.gigs.filter(
  //     (gig) => gig.postedBy?._id === user._id
  //   ).length;
  //   setMusicianGigCount(count);
  //   setClientGigCount(clientCount);
  //   setRating(calculateRating(count));
  // }, [user._id, user.isMusician, gigs?.gigs, user?.isClient]); // Optimized dependencies

  // const calculateRating = (count: number): number => {
  //   if (count >= 10) return 5;
  //   if (count >= 7) return 4;
  //   if (count >= 4) return 3;
  //   if (count >= 1) return 2;
  //   if (count === 1) return 1;
  //   return 0;
  // };
  const calculateRating = (
    reviews: { rating: number }[],
    gigCount: number
  ): number => {
    if (!reviews || reviews.length === 0) return 0; // No reviews = 0 rating

    // Average review rating
    const avgReviewRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // Experience factor: More gigs make higher ratings possible
    const experienceFactor = Math.log10(gigCount + 1) * 1.5; // Logarithmic scale, harder to reach 5

    // Final calculated rating
    const finalRating = Math.min(
      5,
      avgReviewRating * 0.7 + experienceFactor * 0.3
    );

    return Math.round(finalRating * 10) / 10; // Round to 1 decimal place
  };

  useEffect(() => {
    if (!user._id || !gigs?.gigs) return;

    const bookedGigs = gigs.gigs.filter(
      (gig) => gig?.bookedBy?._id === user._id
    ).length;
    const postedGigs = gigs.gigs.filter(
      (gig) => gig?.postedBy?._id === user._id
    ).length;

    setMusicianGigCount(bookedGigs);
    setClientGigCount(postedGigs);

    if (user.isMusician) {
      setRating(calculateRating(user.allreviews || [], bookedGigs));
    }
  }, [user._id, user.isMusician, gigs?.gigs, user.allreviews]);
  return (
    <div className="bg-neutral-800 w-full max-w-md rounded-t-lg p-6 relative slide-up rounded-tl-[50px] rounded-tr-[50px] min-h-[320px] pt-14">
      <div className="w-full flex justify-center items-center flex-col absolute top-1">
        <span className="bg-neutral-600 w-[70%] mx-auto h-[1px] mb-2 rounded-full "></span>

        <span className="bg-neutral-600 w-[60%] mx-auto h-[1px] mb-2 rounded-full "></span>
        <span className="bg-neutral-600 w-[50%] mx-auto h-[1px] mb-2 rounded-full "></span>
      </div>

      <div
        className="absolute rounded-full bg-amber-300 h-[35px] w-[35px] right-5 top-24 animate-bounce flex justify-center items-center"
        onClick={(ev) => {
          ev.stopPropagation();
          onClose();
          setRefferenceModalOpen(true);
        }}
      >
        {user.picture && (
          // <Image
          //   src={user.picture}
          //   alt={user.firstname as string}
          //   className="w-[35px] h-[35px] rounded-full mx-auto"
          //   width={35}
          //   height={35}
          // />
          <User />
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute top-2 right-6 text-gray-300"
      >
        &times;
      </button>
      <div className="text-center">
        {user.picture && (
          <Image
            src={user.picture}
            alt={user.firstname as string}
            className="w-24 h-24 rounded-full mx-auto"
            width={80}
            height={80}
          />
        )}
        <h2 className="text-xl font-semibold mt-4 text-neutral-300">
          {user.firstname} {user.lastname}
        </h2>
        <p className=" title text-neutral-400">{user.email}</p>
        <div className="mt-4 flex justify-between items-center">
          <>
            {" "}
            <div className="text-gray-700">
              <p className="text-neutral-400">
                {" "}
                {user.isMusician ? "Musician" : user.isClient ? "Client" : ""}
              </p>
              {user && user.isMusician ? (
                <p
                  className="text-neutral-400 text-[11px]"
                  style={{ fontFamily: fonts[30] }}
                >
                  Gigs Booked: {musicianCount}
                </p>
              ) : user.isClient ? (
                <p
                  className="text-neutral-400 text-[11px]"
                  style={{ fontFamily: fonts[30] }}
                >
                  Gigs Posted: {clientGigCount}
                </p>
              ) : (
                ""
              )}
            </div>
            {user.isMusician ? (
              <div className="text-gray-500 flex">
                Rating: <StarRating rating={rating} />
              </div>
            ) : user?.isClient ? (
              <p
                className="text-neutral-400 title"
                style={{ fontFamily: fonts[217] }}
              >
                no rating
              </p>
            ) : (
              ""
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};
