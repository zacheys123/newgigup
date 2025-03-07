import React, { useEffect, useState } from "react";
import { UserProps } from "@/types/userinterfaces";
import { useAllGigs } from "@/hooks/useAllGigs";
import Image from "next/image";

interface ProfileModalProps {
  user: UserProps;
  onClose: () => void;
}

const ChatModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const [gigCount, setGigCount] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const { gigs } = useAllGigs();

  useEffect(() => {
    if (!user._id || !gigs?.gigs) return;

    const keyToCheck = user.isMusician
      ? "bookedBy"
      : user.isClient
      ? "postedBy"
      : ""; // Dynamically set key

    const count = gigs.gigs.filter(
      (gig) => gig[keyToCheck as keyof typeof gig] === user._id
    ).length;

    setGigCount(count);
    setRating(calculateRating(count));
  }, [user._id, user.isMusician, gigs?.gigs, user?.isClient]); // Optimized dependencies

  const calculateRating = (count: number): number => {
    if (count >= 10) return 5;
    if (count >= 7) return 4;
    if (count >= 4) return 3;
    if (count >= 1) return 2;
    if (count === 1) return 1;
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-lg p-6 relative slide-up">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
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
          <h2 className="text-xl font-semibold mt-4">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="mt-4">
            <div className="text-gray-700">
              <p className="text-neutral-400">
                {" "}
                {user.isMusician ? "Musician" : user.isClient ? "Client" : ""}
              </p>
              {user.isMusician
                ? "Gigs Booked"
                : user.isClient
                ? "Gigs Posted"
                : ""}
              : {gigCount}
            </div>
            <p className="text-gray-700 flex">
              Rating: <StarRating rating={rating} />
            </p>
          </div>
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
