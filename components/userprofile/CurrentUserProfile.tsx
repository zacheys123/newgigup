"use client";

import { CircularProgress } from "@mui/material";
import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import useStore from "@/app/zustand/useStore";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { experiences, instruments } from "@/data";
import { ArrowDown } from "lucide-react";
import { fileupload } from "@/hooks/fileUpload";
import { VideoProfileProps } from "@/types/userinterfaces";

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
  const [uploading, setUpLoading] = useState<boolean>(false);

  const [fileUrl, setFileUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>("");

  const [videos, setVideos] = useState<VideoProfileProps[]>([]);
  const [video, setVideo] = useState<VideoProfileProps>({
    title: "",
    url: "",
    _id: "",
  });
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
    0,
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
      // Ensure videoProfile is an array
      setVideos(user.videosProfile || []);
    }
  }, [user]);

  console.log(user);
  const handleUpdate = async () => {
    const datainfo = {
      city,
      instrument,
      experience,
      age,
      month,
      year,
      address,
      videoUrl,
      title: video?.title,
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
          setRefetchData((prev: boolean) => !prev);
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

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dep = "video";
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      fileupload(
        event,
        (file: string) => {
          if (file) {
            setVideoUrl(file);
          }
        },
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => {
          if (file) {
            setFileUrl(file);
          }
        },
        setUpLoading,
        dep
      );
    },
    [fileUrl]
  );
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVideo((prev) => ({ ...prev, [name]: value }));
  };

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
    <div className="w-full h-full overflow-scroll flex-1">
      <div className="flex justify-center items-center mb-6">
        <h3 className="text-white font-bold text-lg text-center">
          Create Your Profile
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-h-full overflow-y-scroll">
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
          <div className="space-y-2">
            <span className="text-md font-bold text-gray-300">
              Personal Info
            </span>
            <Input
              type="text"
              className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
              value={firstname || ""}
              disabled
            />
            <Input
              type="text"
              className="w-full bg-transparent border-none  text-[12px] focus:ring-0 text-white"
              value={lastname || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <span className="text-md font-bold text-gray-300">
              Authorization Info
            </span>
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
          </div>

          <div className="space-y-2">
            <span className="text-md font-bold text-gray-300">
              Geographical Info
            </span>
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
          <div className="w-full -mt-1">
            {" "}
            <Input
              id="post"
              type="text"
              className=" mt-2 p-2 w-full text-[13px] bg-gray-300 rounded-md focus-within:ring-o outline-none"
              placeholder="Create a Jamtitle...."
              required
              name="title"
              value={video?.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Video Upload Section */}
          {user?.videosProfile?.length < 4 || videos?.length < 4 ? (
            <>
              {!videoUrl ? (
                <div className="flex justify-between items-center w-full mx-auto mt-4">
                  <label
                    htmlFor="postvideo"
                    className="bg-neutral-400 flex justify-center title py-2 px-3 mt-2 min-w-[115px] rounded-xl whitespace-nowrap"
                  >
                    {!uploading ? (
                      <p> Upload Video</p>
                    ) : (
                      <CircularProgress
                        size="13px"
                        sx={{ color: "white", fontBold: "500" }}
                        className="bg-orange-700 rounded-tr-full text-[15px] font-bold"
                      />
                    )}
                  </label>

                  <input
                    id="postvideo"
                    className="hidden"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className="h-[200px] md:h-[320px] bg-gray-800 mt-7">
                  <video
                    className="w-full h-[100%] object-cover"
                    src={fileUrl}
                    autoPlay
                    loop
                    muted
                  />
                </div>
              )}
              {/* 
              {videoUrl && (
                <div className="h-[30px] w-[100%] text-center">
                  <Button
                    disabled={isloading}
                    variant="secondary"
                    type="submit"
                    className="h-full w-[80%]   text-[15px]  p-4 !bg-amber-700 font-sans text-gray-200"
                  >
                    {!isloading ? (
                      "Upload Video"
                    ) : (
                      <CircularProgress
                        size="13px"
                        sx={{ color: "white", fontBold: "500" }}
                        className="bg-orange-700 rounded-tr-full text-[15px] font-bold"
                      />
                    )}
                  </Button>
                </div>
              )} */}
            </>
          ) : (
            <div className="flex flex-col gap-2 my-3 p-2">
              <span className="text-neutral-400 mb-1 text center">{`You've reached the maximum no of clips to upload, delete/remove one to upload another`}</span>
            </div>
          )}
          <div className="">
            {videos?.map((vid: VideoProfileProps) => (
              <div className="flex gap-2" key={vid?._id}>
                <div className="w-[100px] h-[100px] overflow-hidden rounded-full border-2 border-gray-600">
                  <img
                    className="object-cover w-full h-full"
                    src={vid?.url}
                    alt="User Avatar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-sm">{`Clip ${
                    videos.indexOf(video) + 1
                  }`}</span>
                  <span className="text-gray-500 text-sm">{video?.title}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Update Info Button */}
          <div className="w-full flex justify-center mt-4">
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
