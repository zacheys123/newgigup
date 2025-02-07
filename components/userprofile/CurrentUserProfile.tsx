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

  const [personal, setPersonal] = useState<boolean>(false);
  const [authorize, setAuthorize] = useState<boolean>(false);
  const [geographical, setGeographical] = useState<boolean>(false);
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
      setFirstname(user?.firstname || "");
      setLastname(user?.lastname || "");
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setCity(user?.city || "");
      setExperience(user?.experience || "");
      setInstrument(user?.instrument || "");
      setYear(user?.year || "");
      setMonth(user?.month || "");
      setAge(user?.date || "");
      setAddress(user?.address || "");
      // Ensure videoProfile is an array
      setVideos(user?.videosProfile || []);
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
  console.log(month);

  const active =
    "text-md font-bold text-gray-300 bg-gradient-to-r from-red-500 via-rose-900  to-neutral-700 b-4 p-2 rounded-sm max-w-300px hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 transition-colors duration-200 cursor-pointer";
  const inactive =
    "text-md font-bold text-gray-300 bg-gradient-to-r from-neutral-700   to-neutral-700 b-4 p-2 rounded-sm max-w-300px hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 transition-colors duration-200 cursor-pointer";

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
    <div className="w-full h-full overflow-scroll flex-1 relative">
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

      <div className="flex flex-col lg:flex-row gap-6 max-h-full overflow-y-scroll py-5">
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

        <form className="space-y-4">
          <div className="space-y-4 my-4 h-fit py-3">
            <span
              onClick={() => {
                setPersonal(!personal);
                setGeographical(false);
                setAuthorize(false);
              }}
              className={personal ? active : inactive}
            >
              Personal Info
            </span>

            {personal && (
              <>
                <Input
                  type="text"
                  className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
                  value={firstname || ""}
                  disabled
                />
                <Input
                  type="text"
                  className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
                  value={lastname || ""}
                  disabled
                />
              </>
            )}
          </div>

          <div className="space-y-2 h-fit py-3">
            <span
              onClick={() => {
                setAuthorize(!authorize);
                setPersonal(false);
                setGeographical(false);
              }}
              className={authorize ? active : inactive}
            >
              Authorization Info
            </span>{" "}
            {authorize && (
              <>
                <Input
                  type="text"
                  className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
                  value={email || ""}
                  disabled
                />
                <Input
                  type="text"
                  className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
                  value={username || ""}
                  disabled
                />
              </>
            )}
          </div>

          <div className="space-y-2 h-fit py-3">
            <span
              onClick={() => {
                setGeographical(!geographical);
                setPersonal(false);
                setAuthorize(false);
              }}
              className={geographical ? active : inactive}
            >
              Geographical Info
            </span>
            {geographical && (
              <>
                <Input
                  type="text"
                  className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
                  placeholder="City"
                  value={city || ""}
                  onChange={(ev) => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
                  placeholder="Address"
                  value={address || ""}
                  onChange={(ev) => setAddress(ev.target.value)}
                />
              </>
            )}
          </div>

          {!otherinfo && (
            <div
              className="bg-amber-900 p-2 rounded-full cursor-pointer px-3 text-[12px]"
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
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[12px] font-bold text-gray-300">
                  Instrument
                </span>
                <select
                  className="w-full p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px]"
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
                  className="w-full p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px]"
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
                    className="w-1/3 p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[10px]"
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
                    className="w-1/3 p-2 rounded-md bg-gray-700 text-gray-300 border-none focus:ring-0 text-[12px]"
                    value={month}
                    onChange={(ev) => setMonth(ev.target.value)}
                  >
                    {months.map((m) => (
                      <option key={m} value={m.toLowerCase()}>
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
              className=" border border-neutral-700 my-8 p-2"
              onClick={() => showUpload(true)}
              type="button"
            >
              Upload Videos For Profile{" "}
              <Plus onClick={() => showUpload(true)} />
            </Button>
          )}
          {/* Update Info Button */}
          <div className="w-full flex justify-center mt-6">
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleUpdate}
              className="w-[80%] -p-1 h-[31px] mx-auto"
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
