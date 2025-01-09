"use client";

import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import useStore from "@/app/zustand/useStore";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { experiences, instruments } from "@/data";

interface UpdateResponse {
  updateStatus: boolean;
  message?: string;
}

const CurrentUserProfile = () => {
  const { userId } = useAuth();
  const { user } = useCurrentUser(userId || null);
  const { setCurrentFollowers } = useStore();
  const [
    loadingUser,
    // setLoadingUser
  ] = useState<boolean>(false);

  // User details states
  const [firstname, setFirstname] = useState<string | null>("");
  const [lastname, setLastname] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [phone, setPhone] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");
  const [instrument, setInstrument] = useState<string>("Piano");
  const [experience, setExperience] = useState<string>("noexp");
  const [age, setAge] = useState<string>("1");
  const [city, setCity] = useState<string>("");
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string>("");
  const [message] = useState<{ error: string; success: string }>({
    error: "",
    success: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

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
      setPhone(user.phone || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setCity(user.city || "");
      setExperience(user.experience || "");
      setInstrument(user.instrument || "");
      setYear(user.year || "");
      setMonth(user.month || "");
      setAge(user.date || "");
      setAddress(user.address || "");
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
          window.location.reload();
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
        <h6 className="text-yellow-500 text-[11px] mt-2  rounded-tl-md rounded-b-r-xl ">
          Loading profile data...
        </h6>
      </div>
    );
  }

  return (
    <>
      <div className="container flex justify-between items-center  shadow-sm shadow-red-500 h-[100vh]">
        {/* <Logo /> */}
        <h3 className="text-white font-bold hidden md:block text-[12px]">
          Add More Info
        </h3>
        {/* <div>
          <AvatarComponent
            picture={user?.picture || ""}
            posts="w-[32px] h-[32px] rounded-full object-fit"
            firstname={user.firstname || ""}
          />
        </div> */}
      </div>

      <Box className="block w-full lg:flex gap-3 h-full">
        <div className="w-full py-7 h-[800px] lg:ml-[70px]">
          {!loadingUser && (
            <div className="text-red-300 text-[14px] font-bold font-mono my-3 ml-8 flex items-center justify-between">
              {user?.followers?.length === 0 ? (
                <h6 className="text-red-300">No followers</h6>
              ) : (
                <h6
                  className="text-red-600 mb-1 text-[14px] bg-gray-200 w-fit p-1 rounded-sm"
                  onClick={() => setCurrentFollowers(true)}
                >
                  {followerCount}
                </h6>
              )}
              {user?.followings?.length === 0 ? (
                <h6 className="text-red-300 mr-4">No followings</h6>
              ) : (
                <h6 className="text-red-600 mb-1 text-[14px] bg-gray-200 w-fit p-1 rounded-sm">
                  {followingCount}
                </h6>
              )}
            </div>
          )}
          <form className="w-full sm:w-11/12 md:w-1/2 lg:w-0 lg:hidden">
            {/* Personal Information */}
            <div className="h-[165px] mt-3 w-full">
              <div className="flex flex-col gap-2">
                <span className="text-gray-400 font-bold font-mono mt-2 mx-2 mb-1 text-[13px]">
                  Full Names
                </span>
                <Input
                  type="text"
                  className="md:text-slate-200 text-blue-100 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                  value={firstname || ""}
                  disabled
                />
              </div>
              <Input
                type="text"
                className="md:text-slate-200 text-blue-100 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                value={lastname || ""}
                disabled
              />
            </div>

            {/* Authorization Info */}
            <div className="h-[165px] mt-3 w-full">
              <span className="text-gray-400 font-bold font-mono m-3 text-[13px]">
                Authorization Info
              </span>
              <Input
                type="text"
                className="md:text-slate-200 text-blue-100 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                value={email || ""}
                disabled
              />
              <Input
                type="text"
                className="md:text-slate-200 text-blue-100 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                value={username || ""}
                disabled
              />
              <Input
                type="text"
                placeholder="Phone No"
                className="md:text-slate-200 text-blue-100 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                value={phone || ""}
                disabled
              />
            </div>

            {/* Geographical Info */}
            <div className="h-[170px] mt-4 w-full">
              <span className="text-gray-400 font-bold font-mono m-3 text-[13px]">
                Geographical Info
              </span>
              <Input
                type="text"
                className="md:text-slate-500 text-gray-200 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                placeholder="City"
                value={city || ""}
                onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  setCity(ev.target.value)
                }
              />
              <Input
                type="text"
                className="md:text-slate-200 text-gray-200 md:w-[80%] mx-auto font-bold text-[12px] my-3"
                placeholder="Address"
                value={address || ""}
                onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  setAddress(ev.target.value)
                }
              />
            </div>

            {/* Instrument and Experience Selection */}
            <div className="w-full flex flex-col mb-2 h-[65px]">
              <span className="text-[11px] font-bold font-mono text-gray-400 mb-2">
                Instrument
              </span>
              <select
                className="my-2 text-gray-200 w-[80%] mx-auto pl-2 rounded-md text-[9px] font-mono h-full"
                value={instrument || ""}
                onChange={(ev: ChangeEvent<HTMLSelectElement>) =>
                  setInstrument(ev.target.value)
                }
              >
                {instruments().map((ins) => (
                  <option key={ins.id} value={ins.name}>
                    {ins.val}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[80%] mx-auto flex flex-col my-2 h-[65px]">
              <span className="text-[11px] text-gray-400 mb-2 font-bold font-mono">
                Experience
              </span>
              <select
                className="my-2 text-gray-200 w-[100%] mx-auto pl-2 rounded-md text-[9px] font-mono h-full"
                value={experience || ""}
                onChange={(ev: ChangeEvent<HTMLSelectElement>) =>
                  setExperience(ev.target.value)
                }
              >
                {experiences().map((ex) => (
                  <option key={ex.id} value={ex.name}>
                    {ex.val}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="w-[80%] mx-auto flex flex-col h-[65px]">
              <span className="text-[11px] font-bold font-mono text-gray-400">
                Date
              </span>
              <select
                className="my-2 text-gray-200 w-[100%] mx-auto pl-2 rounded-md text-[9px] font-mono h-full"
                value={age || ""}
                onChange={(ev: ChangeEvent<HTMLSelectElement>) =>
                  setAge(ev.target.value)
                }
              >
                {daysOfMonth.map((i) => (
                  <option key={i} value={i.toString()}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full   flex flex-col  my-2">
              <span className="text-[11px] text-gray-400 mb-2  font-bold font-mono   ">
                Month
              </span>
              <select
                className="text-gray-200 titler text-[10px] w-full  pl-2 element-with-overflow  h-[35px] rounded-md   font-bold  font-mono"
                value={month !== undefined ? month : ""}
                onChange={(ev: ChangeEvent<HTMLSelectElement>) =>
                  setMonth(ev.target.value)
                }
              >
                {months.map((ex) => {
                  return (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="w-full   flex flex-col  my-2">
              <span className="text-[11px] text-gray-400 mb-2  font-bold font-mono   ">
                Year
              </span>
              <Input
                value={year !== undefined ? year : ""}
                onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  setYear(ev.target.value)
                }
                type="text"
                className={
                  message?.error?.split(" ").includes("year") && year === ""
                    ? "border-2 border-red-500 rounded-xl  outline-none focus:ring-0 text-blue-600 md:text-gray-400 font-bold "
                    : "mt-1 border-neutral-300    focus:ring-0 text-blue-600 md:text-gray-200 md:w-[80%] mx-auto font-bold "
                }
                placeholder="Year,e.g 1992=>92 or 2024 =>24"
              />
            </div>
            <div className="w-full flex justify-center items-center mt-4">
              <Button
                variant="destructive"
                disabled={loading}
                title="Update"
                className="text-[12px] h-[26px] mb-4"
                onClick={handleUpdate}
              >
                {!loading ? (
                  "Update Info"
                ) : (
                  <CircularProgress size="20px" sx={{ color: "white" }} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </>
  );
};

export default CurrentUserProfile;
