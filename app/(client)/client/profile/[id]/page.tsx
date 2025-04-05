"use client";
import BallLoader from "@/components/loaders/BallLoader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useStore from "@/app/zustand/useStore";
import { motion } from "framer-motion";

interface UpdateResponse {
  data: {
    updateStatus: boolean;
    message?: string;
  };
}
const ClientProfile = () => {
  const { user } = useUser();
  const { user: myuser } = useCurrentUser();
  const { setRefetchData } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  // State for form inputs
  const [formData, setFormData] = useState({
    fullName:
      myuser?.firstname && myuser?.lastname
        ? `${myuser?.firstname} ${myuser?.lastname}`
        : "",
    username: myuser?.username || "",
    location: myuser?.city || "",
    bio: myuser?.bio || "",
    handles: "",
    organization: "",
    picture: user?.imageUrl,
  });

  useEffect(() => {
    if (myuser) {
      setFormData({
        fullName:
          myuser?.firstname && myuser?.lastname
            ? `${myuser?.firstname} ${myuser?.lastname}`
            : "",
        username: myuser?.username || "",
        location: myuser?.city || "",
        bio: myuser?.bio ? myuser?.bio : myuser?.talentbio || "",
        handles: myuser?.handles || "",
        organization: myuser?.organization || "",
        picture: user?.imageUrl,
      });
    }
  }, [myuser]);
  console.log(user);
  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate Profile Completion
  const calculateCompletion = () => {
    const fields = [
      "fullName",
      "username",
      "location",
      "bio",
      "handles",
      "organization",
    ];
    const filledFields = fields.filter(
      (field) => formData[field as keyof typeof formData]
    );
    const percentage = (filledFields.length / fields.length) * 100;
    return Math.ceil(percentage);
  };

  const completion = calculateCompletion();

  //   const router = useRouter();
  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Example:
    setLoading(true);
    try {
      const { data }: UpdateResponse = await axios.put(
        `/api/user/client/${myuser?._id}`,
        formData
      );
      console.log(data);
      setRefetchData(true);
      toast.success(data?.message);
    } catch (error) {
      console.error("Error updating user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!myuser?.firstname || !myuser?.lastname || !myuser?.username) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300 backdrop-blur-sm bg-neutral-700/50 flex-col gap-4 ">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"
        >
          <BallLoader />
        </motion.div>
        <h6 className="animate-pulse font-mono text-1xl  text-amber-500">
          {`Loading User's Data`}
        </h6>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-black text-white px-4">
      <form
        className="max-w-4xl w-full bg-neutral-800/80 rounded-xl shadow-lg p-4 sm:p-8 overflow-y-scroll max-h-screen"
        onSubmit={handleSubmit}
      >
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-neutral-700 pb-4">
          {user && myuser?.picture && (
            <Image
              src={myuser.picture || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-neutral-500"
              width={128}
              height={128}
            />
          )}
          <div className="w-full">
            <label className="block text-sm text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              className="title w-full bg-neutral-700 p-2 rounded-lg focus:outline-none text-neutral-400"
              disabled
            />

            <label className="block text-sm text-neutral-400 my-3">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              className="title w-full bg-neutral-700 p-2 rounded-lg focus:outline-none text-neutral-400"
              disabled
            />

            <label className="block text-sm text-neutral-400 my-3">City</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="title w-full bg-neutral-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm text-neutral-400 my-3">
              Organization/Company Name
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="title w-full bg-neutral-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <h2 className="text-1xl font-semibold text-neutral-300">Your Bio</h2>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="title w-full bg-neutral-700 text-white p-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            placeholder="Write something about your company/yourself..."
          ></textarea>
        </div>

        {/* Social Media Links */}
        <div className="mt-6">
          <h2 className="text-1xl font-semibold text-neutral-300">
            Social Media
          </h2>
          <input
            type="text"
            name="handles"
            value={formData.handles}
            onChange={handleChange}
            className="title w-full bg-neutral-700 text-white p-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter social media links, comma-separated"
          />
        </div>

        {/* Profile Completion */}
        <div className="mt-6">
          <h2 className="text-1xl font-semibold text-neutral-300">
            Profile Completion
          </h2>
          <div className="w-full bg-neutral-700 h-4 rounded-lg mt-2 overflow-hidden">
            <div
              className="h-4 rounded-lg transition-all duration-500"
              style={{
                width: `${completion}%`,
                background: completion === 100 ? "limegreen" : "orange",
              }}
            ></div>
          </div>
          <p
            className={`text-sm mt-1 font-semibold ${
              completion === 100 ? "text-green-400" : "text-blue-400"
            }`}
          >
            {completion}% completed
          </p>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end pb-4 mb-10">
          <Button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg shadow-md transition ${
              completion === 100
                ? "bg-green-500 hover:bg-green-600 "
                : "bg-blue-700 hover:bg-blue-600 !text-neutral-200"
            }  text-white bg-opacity-90`}
          >
            {loading ? <BallLoader /> : "Save Changes"}{" "}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientProfile;
