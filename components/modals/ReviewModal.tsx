import useStore from "@/app/zustand/useStore";
import { useGetVideos } from "@/hooks/useGetVideos";
import { Review, UserProps, VideoProps } from "@/types/userinterfaces";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { Box } from "@mui/material";
import React from "react";
import { useSwipeable } from "react-swipeable";

interface ReviewProps {
  reviewdata: Review[];
  user: UserProps;
  getVideos: (videodata: VideoProps[], gigId: string) => void;
}

const ReviewModal = ({ reviewdata, user, getVideos }: ReviewProps) => {
  const { setReviewModalOpen, setVideoModalOpen, setRefferenceModalOpen } =
    useStore();
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Swipe handlers for smooth transitions
  const scrollReviews = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const reviewWidth =
        carouselRef.current.firstElementChild?.clientWidth || 300; // Dynamically get review width
      const scrollAmount = direction === "right" ? reviewWidth : -reviewWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => scrollReviews("right"),
    onSwipedRight: () => scrollReviews("left"),
    trackMouse: true,
  });
  // const gigId = reviewdata.map((review) => {
  //   return review.gigId;
  // });
  const { friendvideos } = useGetVideos();
  const videos = friendvideos?.videos?.filter((video) => video.gigId);
  //  const videos = friendvideos?.videos?.find((v:VideoProps) => v._id === review?.videoId);

  return (
    <div className="bg-neutral-900 w-full max-w-md rounded-t-lg p-6 relative slide-up min-h-[340px] rounded-tl-[50px] rounded-tr-[50px] pt-12">
      <button
        onClick={() => setReviewModalOpen(false)}
        className="absolute top-2 right-7 text-gray-300 text-[20px]"
      >
        &times;
      </button>
      {reviewdata?.length > 0 && (
        <div className="flex justify-between absolute top-[10%] w-[90%] mx-auto px-2 transform -translate-y-1/2">
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              scrollReviews("left");
            }}
            className="bg-neutral-700 text-white px-3 py-1 rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              scrollReviews("right");
            }}
            className="bg-neutral-700 text-white px-3 py-1 rounded-full"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      {reviewdata?.length === 0 ? (
        <div className="flex justify-center items-center h-full flex-col">
          <p className="text-center text-neutral-400">No reviews found</p>

          <button
            onClick={(ev) => {
              ev.stopPropagation();
              setReviewModalOpen(false);
              setRefferenceModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-[#128C7E] text-white rounded-lg hover:bg-[#0e6e5f] transition-colors duration-200"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto no-scrollbar" {...handlers}>
            <div
              ref={carouselRef}
              className="flex space-x-4 overflow-x-scroll snap-x snap-mandatory px-2 scrollbar-hide "
            >
              {reviewdata
                ?.filter((u) => u?.postedTo === user?._id)
                .map((review) => (
                  <div
                    key={review._id}
                    className="min-w-[90%] snap-center flex flex-col items-center p-2 max-h-[330px]"
                  >
                    <Box className="shadow-sm shadow-neutral-400 my-3 p-3 rounded-xl overflow-y-auto">
                      <span className="flex gap-1 text-[11px] text-neutral-400 items-center">
                        {review?.rating} <StarRating rating={review?.rating} />
                      </span>
                      <p className="text-sm text-gray-300">{review?.comment}</p>
                      <div className="w-full flex justify-center mt-6  ">
                        <div
                          className="text-neutral-300 bg-amber-700 px-3 py-1 rounded-xl flex items-center cursor-pointer title"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setReviewModalOpen(false);
                            setVideoModalOpen(true);
                            getVideos(videos || [], review?.gigId);
                          }}
                        >
                          View Video Clips
                          <VideoCameraIcon className="h-3 w-3 text-white ml-2" />
                        </div>
                      </div>
                    </Box>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
      {reviewdata?.length > 0 && (
        <div className="absolute bottom-2 left-3 ">
          <button
            onClick={() => setReviewModalOpen(false)}
            className="bg-green-700 text-white px-4  rounded-full hover:bg-[#0e6e5f] transition-colors duration-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewModal;

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < rating
              ? "text-yellow-400 text-[13px]"
              : "text-gray-300 text-[13px]"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};
