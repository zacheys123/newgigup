"use client";
import AcceptPage from "@/components/gig/AcceptPage";
import BookingPage from "@/components/gig/BookingPage";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetGigs } from "@/hooks/useGetGig";
import { UserProps } from "@/types/userinterfaces";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { TfiReload } from "react-icons/tfi";
const ViewGigDetails = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  console.log(id);
  const { currentGig, loading } = useGetGigs(id as string | null);
  const { user } = useCurrentUser();
  const router = useRouter();

  console.log(currentGig);
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
  if (currentGig?.bookCount == null || currentGig?.postedBy == null) {
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
      {currentGig?.bookCount?.some(
        (myuser: UserProps) => myuser._id === user?.user?._id
      ) && <BookingPage currentGig={currentGig} />}

      {currentGig?.postedBy?._id &&
        currentGig?.postedBy?._id.includes(user?.user?._id as string) && (
          <AcceptPage {...currentGig} />
        )}
    </>
  );
};

export default ViewGigDetails;
