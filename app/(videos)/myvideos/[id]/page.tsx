"use client";
import useStore from "@/app/zustand/useStore";
import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import { ArrowBigLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FriendDataProps {
  user: UserProps;
}
const VideoProfile = () => {
  const [friend, setFriend] = React.useState<FriendDataProps>();
  const { id } = useParams();
  const { refetchData } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (!id) {
      // Guard: Do not run the effect if `id` is undefined or null
      return;
    }
    let isMounted = true;

    async function getFriend() {
      // fetch friend data from an API endpoint
      try {
        const response = await fetch(`/api/user/getuser/${id}`);
        const friendData: FriendDataProps = await response.json();
        console.log(friendData);
        if (isMounted) {
          setFriend(friendData);
        }
        return friendData;
      } catch (error: unknown) {
        console.error("Error fetching friend data:", error);
        // handle the error appropriately, e.g., redirect to a 404 page or show an error message to the user
        alert("Error fetching friend data");
        if (isMounted) {
          setFriend({
            user: {
              clerkId: "",
              firstname: "",
              lastname: "",
              experience: "",
              instrument: "",
              username: "",
              followers: [],
              followings: [],
              allreviews: [],
              myreviews: [],
              isClient: false,
              isMusician: false,
              videosProfile: [],
              organization: "",
              handles: "",
              bio: "",
              genre: "",
              refferences: [],
              roleType: "",
              djGenre: "",
              djEquipment: "",
              mcType: "",
              mcLanguage: "",
              talentbio: "",
              vocalistGenre: "",
              musicianhandles: [{ platform: "", handle: "" }],
              musiciangenres: [],
              firstLogin: true,
              onboardingComplete: false,
              lastActive: new Date(),
              tierStatus: "active",
              updatedAt: new Date(),
              year: "",
              createdAt: new Date(),
              isAdmin: false,
              adminRole: "super",
              adminPermissions: [""],
              lastAdminAction: new Date(),
              adminNotes: "",
              isBanned: false,
              banReason: "",
              bannedAt: new Date(),
              banExpiresAt: new Date(), // New field for temporary ban
              banReference: "", // New fiel
              theme: "light",
              savedGigs: [],
              favoriteGigs: [],
              bookingHistory: [],
              completedGigsCount: 0,
              cancelgigCount: 0,
              musicianConfirmPayment: {
                gigId: "",
                confirmPayment: false,
              },
              clientConfirmPayment: { gigId: "", confirmPayment: false },

              reportsCount: 0,
            },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Cleanup function to avoid setting state after component unmounts

    getFriend();
    return () => {
      isMounted = false;
    };
  }, [id, refetchData]);
  console.log(friend?.user);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-y-auto h-screen w-full mx-auto shadow-lg shadow-orange-400 flex flex-col gap-4 bg-gradient-to-br from-black via-zinc-900 to-black ">
      <div className="h-[50px] bg-inherit w-full flex items-center justify-between px-6 shadow-md py-4">
        <ArrowBigLeftIcon
          className="cursor-pointer hover:text-amber-500 text-neutral-400 transition duration-200"
          size={28}
          onClick={() => router.back()}
        />
        <h1 className="text-white text-2xl font-extrabold"> Videos Profile</h1>
      </div>

      {!friend && (
        <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-md shadow-slate-500 py-8 px-6 text-center">
          <p className="text-neutral-400 text-lg">
            No videos available for this user.
          </p>
        </div>
      )}

      {friend &&
        friend?.user?.videosProfile?.map((video: VideoProfileProps) => (
          <div
            key={video._id}
            className="flex flex-col gap-4 bg-zinc-900 rounded-lg shadow-md shadow-slate-600 py-6 px-4 mt-2 mb-8 hover:shadow-lg hover:scale-[1.02] transition-transform"
            onClick={(ev) => ev.stopPropagation()}
          >
            <video
              controls
              className="w-full h-full object-cover "
              src={video.url}
            />
          </div>
        ))}
    </div>
  );
};

export default VideoProfile;
