import useStore from "@/app/zustand/useStore";
import { Box, CircularProgress, Divider } from "@mui/material";
import { motion } from "framer-motion";
// import { EyeIcon, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
// import { MdAdd } from "react-icons/md";
import { RiCornerDownRightLine } from "react-icons/ri";
import { Button } from "../ui/button";
import Rating from "./Rating";
import { ArrowDown, ArrowUp, MessageCircle, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useBookMusician, useForgetBookings } from "@/hooks/useForgetBooking";
import { Textarea } from "flowbite-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { FetchResponse } from "@/types/giginterface";

// import { useCurrentUser } from "@/hooks/useCurrentUser";

const AcceptPage = () => {
  const { userId } = useAuth();

  const { currentgig } = useStore();
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const { loading, forgetBookings } = useForgetBookings();
  const { bookloading, bookgig } = useBookMusician();
  const [loadingreview, setLoadingreview] = useState(false);
  // const { user } = useCurrentUser(userId || null);
  const [rate] = useState<number>(
    currentgig?.bookedBy?.allreviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0
    ) / (currentgig?.postedBy?.allreviews.length || 1)
  );
  const [comm] = useState<string>(
    currentgig?.bookedBy?.allreviews
      .filter((review: { gigId: string }) => review.gigId === currentgig?._id)
      ?.map((review: { comment: string }) => review.comment)
  );

  const router = useRouter();
  const book = () => bookgig(router, currentgig, userId || "");
  const forget = () => forgetBookings(userId || "", currentgig);
  const variant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (currentgig?.isPending === true && currentgig?.isTaken === false) {
      return;
    }
    if (currentgig?.isPending === false && currentgig?.isTaken === true) {
      return;
    }
    if (currentgig?.isPending === false && currentgig?.isTaken === false) {
      router.push(`/gigs/${userId}/`);
    }
  }, [currentgig?.isTaken, currentgig?.isPending]);
  const handleRatingChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoadingreview(true);

      if (!comment) {
        toast.error("A written review  is needed.");
        return;
      }
      if (comment && comment.length > 200) {
        toast.error("Comment should not exceed 100 characters");
        return;
      }

      const res = await fetch(`/api/gigs/reviewgig/${currentgig._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          postedBy: currentgig?.postedBy?._id,
          postedTo: currentgig?.bookedBy?._id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit the rating");
      }

      const data: FetchResponse = await res.json();

      if (data?.gigstatus === true) {
        toast.success(data?.message || "Review submitted successfully");
        setRating(0);
        setComment("");
        setTimeout(() => {
          router.push(`/gigs/${userId}`);
        }, 2000);
      } else {
        toast.error(
          data?.message || "There was an issue submitting the review"
        );
      }
    } catch (error: unknown) {
      console.error(error || "An unexpected error occurred");
    } finally {
      setLoadingreview(false);
    }
  };
  const [pers, setPers] = useState<boolean>(false);
  return (
    <div className="h-[83%] w-full overflow-y-auto relative">
      {!currentgig?.isTaken && (
        <div className="absolute w-[40px] h-[90px] flex flex-col gap-[10px] bg-gray-700 right-5 top-[460px] opacity-85 rounded-xl pt-4 animate-pulse ">
          {" "}
          {!loading ? (
            <X
              size="26"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                color: "white",
                fontWeight: "bold",
              }}
              className="shadow shadow-red-200 "
              onClick={forget}
            />
          ) : (
            <CircularProgress
              size="20px"
              color="primary"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}
          {bookloading ? (
            <CircularProgress
              size="20px"
              color="primary"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "white",
                fontWeight: "bold",
              }}
            />
          ) : (
            <RiCornerDownRightLine
              size="26"
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                color: "lightgray",
              }}
              className="shadow shadow-slate-200"
              onClick={book}
            />
          )}
        </div>
      )}

      <div className="h-[130px] w-[90%] mx-auto p-4 bg-zinc-600  shadow-md shadow-zinc-700 my-4 flex flex-col gap-3 rounded-xl">
        <h4 className="text-gray-400 text-[13px] font-serif underline underline-offset-2">
          Personal
        </h4>
        <div className="w-full h-[30px] flex justify-end  items-center gap-[90px] ">
          {currentgig?.bookedBy?.picture && (
            <Image
              src={currentgig?.bookedBy?.picture}
              alt="Prof pic "
              width={30}
              height={30}
              objectFit="cover"
              className="rounded-full text-center text-white font-mono text-[13px]"
            />
          )}

          <div className="flex gap-4 items-center">
            <div className="flex items-center ">
              <h4 className="text-gray-300 text-[14px] font-mono font-bold flex items-center gap-1">
                {currentgig?.viewCount?.length}{" "}
                <span className="text-gray-400">views</span>
              </h4>
            </div>
            <div className="flex  items-center">
              <h4 className="text-gray-400 text-[13px] font-sans">follow</h4>
              <MdAdd
                size="21px"
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            </div>
            <MessageCircle
              size="21px"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "white",
              }}
            />
          </div>
        </div>
        <div className="w-full  h-full flex justify-around">
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.firstname}
          </h4>{" "}
          <h4 className="text-gray-300 text-[13px] font-bold">
            {currentgig?.postedBy?.lastname}
          </h4>
        </div>
      </div>
      <h6
        className="text-sm w-[85%] mx-auto font-semibold text-neutral-200 mb-2 bg-amber-800  py-1 px-2 rounded-md flex justify-between items-center"
        onClick={() => setPers((prev) => !prev)}
      >
        <span> More Info</span>
        {!pers ? <ArrowDown /> : <ArrowUp />}
      </h6>
      {pers && (
        <motion.div
          className="bg-gray-900 text-white p-8 rounded-lg shadow-lg"
          initial="initial"
          animate="animate"
          variants={variant}
        >
          <motion.div
            className="bg-gray-800 bg-opacity-30 p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {" "}
            <div className="text-sm text-neutral-300 space-y-3">
              <div>
                <span className="font-bold text-neutral-400">Username:</span>{" "}
                {currentgig?.bookedBy?.username}
              </div>
              <div>
                <span className="font-bold text-neutral-400">
                  Email Address:
                </span>{" "}
                {currentgig?.bookedBy?.email}
              </div>
              <div>
                <span className="font-bold text-neutral-400">Instrumment:</span>{" "}
                {currentgig?.bookedBy?.instrument
                  ? currentgig?.bookedBy?.instrument
                  : "-"}
              </div>
              <div>
                <span className="font-bold text-neutral-400">Experience:</span>{" "}
                {currentgig?.bookedBy?.experience
                  ? currentgig?.bookedBy?.experience
                  : "-"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <Divider className="my-6 border-neutral-700" />
      <div className="flex justify-center space-x-10 w-3/4 mx-auto mt-6 border-t border-neutral-700 pt-6">
        <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
          <span className="text-purple-400 font-medium title">Followers</span>
          <p className="text-sm font-bold text-red-500 mt-1 choice">
            {currentgig.bookedBy?.followers?.length || 0}
          </p>
        </motion.div>
        <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
          <span className="text-purple-400 font-medium title">Following</span>
          <p className="text-sm font-bold text-red-500 mt-1 font-mono ">
            {currentgig.bookedBy?.followings?.length || 0}
          </p>
        </motion.div>
      </div>
      <Divider className="my-6 border-neutral-700" />
      <Divider sx={{ backgroundColor: "gray", width: "82%", margin: "auto" }} />
      {currentgig?.isTaken && (
        <div className="w-full flex justify-between gap-4 my-8 p-3 rounded-lg shadow-md shadow-amber-600">
          <Box className="flex flex-col gap-3">
            <h6 className="text-neutral-400 font-semibold ">Rate Musician</h6>
            <Rating rating={rating ? rating : rate} setRating={setRating} />
          </Box>

          {currentgig.bookedBy && (
            <Image
              width={50}
              height={50}
              className="w-12 h-12 rounded-full shadow-sm"
              src={currentgig.bookedBy?.picture}
              alt="Booker profile"
            />
          )}
        </div>
      )}
      <div className="flex justify-center mt-8 space-x-6">
        {currentgig?.isTaken && (
          <form
            className="flex flex-col gap-2 w-full"
            onSubmit={handleRatingChange}
          >
            <Textarea
              placeholder="Write a review here...
              "
              value={comment ? comment : comm}
              onChange={(e) => setComment(e.target.value)}
              className="w-[88%] mx-auto h-[80px] py-2 px-3 rounded-md shadow-md focus-within:ring-0 outline-none"
            />
            <Button
              variant="destructive"
              disabled={loadingreview}
              className="w-48 h-[30px] mt-8 choice mx-auto"
            >
              {loadingreview ? (
                <CircularProgress
                  size="15px"
                  sx={{ color: "yellow" }}
                  className="
                      text-white
                    bg-gradient-to-br
                    from-red-500
                     to-gray-200
                   via-yellow-500
                    rounded-se-full
                    rounded-ss-full
                    rounded-ee-xl

                    "
                />
              ) : (
                "Review"
              )}
            </Button>{" "}
          </form>
        )}
      </div>
    </div>
  );
};

export default AcceptPage;
