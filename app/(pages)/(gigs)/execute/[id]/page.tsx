"use client";
import useStore from "@/app/zustand/useStore";
import AcceptPage from "@/components/gig/AcceptPage";
import BookingPage from "@/components/gig/BookingPage";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetGigs } from "@/hooks/useGetGig";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { TfiReload } from "react-icons/tfi";
const ViewGigDetails = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  console.log(id);
  const { loading } = useGetGigs(id as string | null);
  const { user } = useCurrentUser(userId || null);
  const router = useRouter();
  const { currentgig } = useStore();

  console.log(currentgig);
  if (loading) {
    return (
      <div className="h-[85%] w-full flex justify-center items-center animate-pulse">
        <div>
          <Button
            onClick={() => router.push(`/gigs/${id}/booking`)}
            variant="default"
            className="text-orange-400 font-semibold"
          >
            loading Gig Info...
          </Button>
        </div>
      </div>
    );
  }
  if (currentgig?.bookCount == null || currentgig?.postedBy == null) {
    return (
      <div className="h-[84%] w-full flex p-2  flex-col justify-center items-center">
        <h4 className="text-gray-400 mb-2">No Gig Info found, try later </h4>
        <div className="flex w-full gap-2 mt-3">
          <Button
            onClick={() => router.push(`/gigs/${userId}`)}
            className="!bg-yellow-700 text-gray-200"
          >
            Go to Main Page
          </Button>
          <Button onClick={() => window.location.reload()} variant="primary">
            Reload page
            <TfiReload />
          </Button>
          m
        </div>
      </div>
    );
  }
  return (
    <>
      {currentgig?.bookCount?.some((myuser) => myuser._id === user?._id) && (
        <BookingPage />
      )}

      {currentgig?.postedBy?._id &&
        currentgig?.postedBy?._id.includes(user?._id as string) && (
          <AcceptPage {...currentgig} />
        )}
    </>
  );
};

export default ViewGigDetails;
