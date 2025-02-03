"use client";

import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import useStore from "@/app/zustand/useStore";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { experiences, instruments } from "@/data";
import { ArrowDown, Plus } from "lucide-react";
import { VideoProfileProps } from "@/types/userinterfaces";
import VideoProfileComponent from "../user/VideoProfileComponent";
import PersonalInfoSection from "../user/ProfileCategories";
import AuthorizationInfoSection from "../user/ProfileAuth";

interface UpdateResponse {
  updateStatus: boolean;
  message?: string;
}

const CurrentUserProfile = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const { setCurrentFollowers } = useStore();

  // User details states
  const [firstname, setFirstname] = useState<string | null>("");
  const [lastname, setLastname] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");
  const [instrument, setInstrument] = useState<string>("Piano");
  const [experience, setExperience] = useState<string>("noexp");
  const [age, setAge] = useState<string>("1");
  const [city, setCity] = useState<string>("");
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string>("");
  const [otherinfo, setOtherinfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [videos, setVideos] = useState<VideoProfileProps[]>([]);
  const { setRefetchData } = useStore();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setCity(user.city || "");
      setExperience(user.experience || "");
      setInstrument(user.instrument || "");
      setYear(user.year || "");
      setMonth(user.month || "");
      setAge(user.date || "");
      setAddress(user.address || "");
      setVideos(user.videosProfile || []);
    }
  }, [user]);

  const handleUpdate = async () => {
    const datainfo = {
      city,
      instrument,
      experience,
      age,
      month,
      year,
      address,
    };

    if (user) {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/update/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datainfo),
        });

        const resData: UpdateResponse = await res.json();

        if (resData.updateStatus) {
          toast.success(resData.message);
          setRefetchData(true);
        } else {
          toast.error(resData.message);
        }
      } catch (error: unknown) {
        toast.error("Error updating profile");
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const [upload, showUpload] = useState<boolean>(false);

  const followerCount =
    user?.followers?.length === 1
      ? "1 follower"
      : `${user?.followers?.length} followers`;
  const followingCount =
    user?.followings?.length === 1
      ? "1 following"
      : `${user?.followings?.length} followings`;

  if (!user) {
    return (
      <div className="h-screen w-screen flex justify-center items-center animate-pulse">
        <CircularProgress size="15" style={{ color: "white" }} />
        <h6 className="text-yellow-500 text-[11px] mt-2 rounded-tl-md rounded-br-xl">
          Loading profile data...
        </h6>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto flex-1 relative p-4">
      <div className="flex justify-center items-center mb-6">
        <h3 className="text-white font-bold text-lg text-center">
          Create Your Profile
        </h3>
      </div>
      <VideoProfileComponent
        user={user}
        setVideoUrl={setVideoUrl}
        videos={videos}
        showUpload={showUpload}
        upload={upload}
        videoUrl={videoUrl}
      />

      {/* Scrollable Form Container */}
      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-y-auto pb-20">
        {" "}
        {/* Added pb-20 for bottom padding */}
        <div className="text-red-300 text-[12px] font-bold my-3 flex items-center justify-between">
          {user?.followers?.length === 0 ? (
            <h6 className="text-red-300">No followers</h6>
          ) : (
            <h6
              className="text-red-600 bg-gray-200 p-1 rounded-sm cursor-pointer"
              onClick={() => setCurrentFollowers(true)}
            >
              {followerCount}
            </h6>
          )}
          {user?.followings?.length === 0 ? (
            <h6 className="text-red-300">No followings</h6>
          ) : (
            <h6 className="text-red-600 bg-gray-200 p-1 rounded-sm">
              {followingCount}
            </h6>
          )}
        </div>
        <form className="space-y-4 w-full">
          <PersonalInfoSection
            firstname={firstname || ""}
            lastname={lastname || ""}
          />
          <AuthorizationInfoSection
            email={email || ""}
            username={username || ""}
          />
          <div className="space-y-2">
            <span className="text-md font-bold text-gray-300">
              Geographical Info
            </span>
            <Input
              type="text"
              className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
              placeholder="City"
              value={city || ""}
              onChange={(ev) => setCity(ev.target.value)}
            />
            <Input
              type="text"
              className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
              placeholder="Address"
              value={address || ""}
              onChange={(ev) => setAddress(ev.target.value)}
            />
          </div>
          <span className="flex justify-between w-[70%] mx-auto items-center">
            <span className="text-gray-200 title">Role</span>
            <span className="text-neutral-400 title">
              {user?.isMusician === true && `Musician`}
              {user?.isClient === true && `Client`}
            </span>
          </span>
          {!otherinfo && (
            <div
              className="bg-amber-900 p-2 rounded-full cursor-pointer px-3 text-[12px] transition-all duration-300 hover:bg-amber-800"
              onClick={() => setOtherinfo(true)}
            >
              <div className="flex items-center justify-between text-gray-300">
                Instrument{" "}
                <ArrowDown
                  className="transform rotate-180 transition-transform duration-300"
                  size={15}
                />
              </div>
            </div>
          )}

          {otherinfo && (
            <div className="space-y-4 transition-all duration-300">
              <div className="space-y-2">
                <span className="text-[12px] font-bold text-gray-300">
                  Instrument
                </span>
                <select
                  className="w-full p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px] transition-all duration-300 hover:bg-gray-600"
                  value={instrument}
                  onChange={(ev) => setInstrument(ev.target.value)}
                >
                  {instruments().map((ins) => (
                    <option key={ins.id} value={ins.name}>
                      {ins.val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-[12px] font-bold text-gray-300">
                  Experience
                </span>
                <select
                  className="w-full p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px] transition-all duration-300 hover:bg-gray-600"
                  value={experience}
                  onChange={(ev) => setExperience(ev.target.value)}
                >
                  {experiences().map((ex) => (
                    <option key={ex.id} value={ex.name}>
                      {ex.val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-[12px] font-bold text-gray-300">
                  Date of Birth
                </span>
                <div className="flex gap-2">
                  <select
                    className="w-1/3 p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[10px] transition-all duration-300 hover:bg-gray-600"
                    value={age}
                    onChange={(ev) => setAge(ev.target.value)}
                  >
                    {daysOfMonth.map((i) => (
                      <option key={i} value={i.toString()}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-1/3 p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px] transition-all duration-300 hover:bg-gray-600"
                    value={month}
                    onChange={(ev) => setMonth(ev.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    className="w-1/3 bg-transparent border-none focus:ring-0 text-white text-[14px]"
                    placeholder="Year"
                    value={year}
                    onChange={(ev) => setYear(ev.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Video Upload Section */}
          {!upload && (
            <Button
              variant="default"
              className="border border-neutral-700 mt-4 transition-all duration-300 hover:bg-neutral-800"
              onClick={() => showUpload(true)}
              type="button"
            >
              Upload Videos For Profile{" "}
              <Plus onClick={() => showUpload(true)} />
            </Button>
          )}
          {/* Update Info Button */}
          <div className="w-full flex justify-center mt-6 mb-10">
            {" "}
            {/* Added mb-10 for bottom margin */}
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleUpdate}
              className="w-[80%] h-[31px] mx-auto transition-all duration-300 hover:bg-red-700"
            >
              {!loading ? (
                "Update Info"
              ) : (
                <CircularProgress size={20} sx={{ color: "white" }} />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrentUserProfile;
