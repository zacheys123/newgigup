"use client";
import useStore from "@/app/zustand/useStore";
import AcceptPage from "@/components/gig/AcceptPage";
import BookingPage from "@/components/gig/BookingPage";
import { Button } from "@/components/ui/button";
import { useGetGigs } from "@/hooks/useGetGig";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { TfiReload } from "react-icons/tfi";
const ViewGigDetails = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  console.log(id);
  const { loading } = useGetGigs(id as string | null);
  const router = useRouter();
  const { currentgig } = useStore();

  // fetch data from server
  // render data in UI
  // return JSX with fetched data

  // return null if no data
  // handle error
  // handle pagination
  // handle sorting
  // handle filtering
  // handle user authentication and authorization
  // handle data validation
  // handle error handling

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
  if (currentgig?.bookedBy == null || currentgig.postedBy == null) {
    return (
      <div className="h-[84%] w-full flex p-2  flex-col justify-center items-center">
        <h4 className="text-gray-400 mb-2">No Gig Info found, try later </h4>
        <div className="flex w-full gap-2">
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
        </div>
      </div>
    );
  }
  return (
    <>
      {currentgig?.bookedBy?.clerkId.includes(userId) && <BookingPage />}

      {currentgig?.postedBy?.clerkId.includes(userId) && <AcceptPage />}
    </>
  );
};

export default ViewGigDetails;
