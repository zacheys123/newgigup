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
import {
  Plus,
  Edit,
  Globe,
  User,
  Lock,
  Music,
  Briefcase,
  Mail,
  X,
} from "lucide-react";
import { VideoProfileProps } from "@/types/userinterfaces";
import VideoProfileComponent from "../user/VideoProfileComponent";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface UpdateResponse {
  updateStatus: boolean;
  message?: string;
}

const CurrentUserProfile = () => {
  const { userId } = useAuth();
  const { user, mutateUser } = useCurrentUser(userId || null);
  // const { setCurrentFollowers } = useStore();

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
  // const [otherinfo, setOtherinfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [personal, setPersonal] = useState<boolean>(false);
  // const [authorize, setAuthorize] = useState<boolean>(false);
  // const [geographical, setGeographical] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [videos, setVideos] = useState<VideoProfileProps[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [handles, setHandles] = useState<
    { platform: string; handle: string }[]
  >([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [djGenre, setDjGenre] = useState<string>("");
  const [djEquipment, setDjEquipment] = useState<string>("");
  const [mcType, setMcType] = useState<string>("");
  const [mcLanguages, setMcLanguages] = useState<string>("");
  const [talentbio, setTalentbio] = useState<string>("");
  const [isMusician, setIsMusician] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showSocialModal, setShowSocialModal] = useState<boolean>(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>("");
  const [newSocialHandle, setNewSocialHandle] = useState<string>("");
  const [showGenreModal, setShowGenreModal] = useState<boolean>(false);
  const [newGenre, setNewGenre] = useState<string>("");

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
      setVideos(user?.videosProfile || []);
      setPhone(user?.phone || "");
      setOrganization(user?.organization || "");
      setHandles(user?.musicianhandles || []);
      setGenre(user?.musiciangenres || []);
      setDjGenre(user?.djGenre || "");
      setDjEquipment(user?.djEquipment || "");
      setMcType(user?.mcType || "");
      setMcLanguages(user?.mcLanguage || "");
      setTalentbio(user?.talentbio || "");
      setIsMusician(user?.isMusician || false);
      setIsClient(user?.isClient || false);
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
      phone,
      organization,
      myhandles: handles,
      genre,
      djGenre,
      djEquipment,
      mcType,
      mcLanguages,
      talentbio,
      isMusician,
      isClient,
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
          mutateUser();
        } else {
          mutateUser();
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

  // const active =
  //   "text-md font-bold text-gray-300 bg-gradient-to-r from-red-500 via-rose-900 to-neutral-700 b-4 p-2 rounded-sm max-w-300px hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 transition-colors duration-200 cursor-pointer";
  // const inactive =
  //   "text-md font-bold text-gray-300 bg-gradient-to-r from-neutral-700 to-neutral-700 b-4 p-2 rounded-sm max-w-300px hover:bg-gradient-to-r hover:from-neutral-700 hover:to-neutral-800 transition-colors duration-200 cursor-pointer";

  // const followerCount =
  //   user?.followers?.length === 1
  //     ? "1 follower"
  //     : `${user?.followers?.length} followers`;
  // const followingCount =
  //   user?.followings?.length === 1
  //     ? "1 following"
  //     : `${user?.followings?.length} followings`;

  const addSocialHandle = () => {
    if (newSocialPlatform && newSocialHandle) {
      setHandles([
        ...handles,
        { platform: newSocialPlatform, handle: newSocialHandle },
      ]);
      setNewSocialPlatform("");
      setNewSocialHandle("");
      setShowSocialModal(false);
    }
  };

  const removeSocialHandle = (index: number) => {
    const updatedHandles = [...handles];
    updatedHandles.splice(index, 1);
    setHandles(updatedHandles);
  };

  const addGenre = () => {
    if (newGenre && !genre.includes(newGenre)) {
      setGenre([...genre, newGenre]);
      setNewGenre("");
      setShowGenreModal(false);
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenre(genre.filter((g) => g !== genreToRemove));
  };
  const toggleAccountType = (type: "musician" | "client") => {
    if (type === "musician") {
      setIsMusician(true);
      setIsClient(false);
    } else {
      setIsMusician(false);
      setIsClient(true);
    }
  };
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
    <div className="w-full h-full overflow-scroll flex-1 relative bg-gradient-to-b from-neutral-900 to-black  py-1">
      <div className="max-w-4xl mx-auto pb-[50px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-rose-600"
                  width={20}
                  height={20}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-rose-600">
                  <User size={32} className="text-rose-400" />
                </div>
              )}
              <button className="absolute -bottom-2 -right-2 bg-rose-600 p-1 rounded-full">
                <Edit size={16} className="text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {firstname} {lastname}
              </h1>
              <p className="text-neutral-400 flex items-center gap-1">
                <Globe size={14} /> @{username}
              </p>
              <div className="flex gap-2 mt-1">
                <Badge
                  variant={
                    isMusician
                      ? "secondary"
                      : isClient
                      ? "secondary"
                      : "outline"
                  }
                >
                  {isMusician ? "Musician" : isClient ? "Listener" : ""}
                </Badge>
                {isClient && <Badge variant="primary">Client</Badge>}
              </div>
            </div>
          </div>

          <Link
            href={"#startprof"}
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("startprof")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <Button variant="outline" className="border-rose-600 text-rose-400">
              View Public Profile
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="flex justify-between items-center bg-neutral-800/50 p-4 rounded-lg mb-8">
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Followers</p>
            <p className="text-white font-bold text-xl">
              {user?.followers?.length || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Following</p>
            <p className="text-white font-bold text-xl">
              {user?.followings?.length || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Reviews</p>
            <p className="text-white font-bold text-xl">
              {user?.allreviews?.length || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Videos</p>
            <p className="text-white font-bold text-xl">
              {user?.videosProfile?.length || 0}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          id="startprof"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true }}
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Profile Section */}
            {isMusician && (
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Music size={18} /> Performance Videos
                  </h2>
                  <Button
                    variant="ghost"
                    className="text-rose-400 hover:bg-neutral-700"
                    onClick={() => showUpload(true)}
                  >
                    <Plus size={16} className="mr-1" /> Add Video
                  </Button>
                </div>
                <VideoProfileComponent
                  user={user}
                  setVideoUrl={setVideoUrl}
                  videos={videos}
                  showUpload={showUpload}
                  upload={upload}
                  videoUrl={videoUrl}
                />
              </div>
            )}

            {/* About Section */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} /> About
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-400"> Bio</Label>
                  <Textarea
                    className="bg-neutral-800 border-neutral-700 text-white mt-1 text-[13px]"
                    value={talentbio}
                    onChange={(e) => setTalentbio(e.target.value)}
                    placeholder="Describe your talents and skills..."
                  />
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={18} /> Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isMusician && (
                  <>
                    {instrument && (
                      <div>
                        <Label className="text-neutral-400">
                          Primary Instrument
                        </Label>
                        <select
                          className="appearance-none w-full p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm mt-1"
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
                    )}

                    <div>
                      <Label className="text-neutral-400">
                        Experience Level
                      </Label>
                      <select
                        className="w-full p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm mt-1"
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

                    <div>
                      <Label className="text-neutral-400">Music Genre</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {genre.map((g) => (
                          <Badge
                            key={g}
                            variant="outline"
                            className="flex items-center gap-1 text-gray-300"
                          >
                            {g}
                            <button
                              onClick={() => removeGenre(g)}
                              className="text-red-600 text-[10px]"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                        <button
                          onClick={() => setShowGenreModal(true)}
                          className="text-rose-400 text-sm flex items-center"
                        >
                          <Plus size={14} className="mr-1" /> Add
                        </button>
                      </div>
                    </div>
                    {djGenre && (
                      <div>
                        <Label className="text-neutral-400">DJ Genre</Label>
                        <Input
                          className="bg-neutral-800 border-neutral-700 text-white mt-1"
                          value={djGenre}
                          onChange={(e) => setDjGenre(e.target.value)}
                        />
                      </div>
                    )}
                    {djEquipment && (
                      <div>
                        <Label className="text-neutral-400">DJ Equipment</Label>
                        <Input
                          className="bg-neutral-800 border-neutral-700 text-white mt-1"
                          value={djEquipment}
                          onChange={(e) => setDjEquipment(e.target.value)}
                        />
                      </div>
                    )}
                    {mcType && (
                      <div>
                        <Label className="text-neutral-400">MC Type</Label>
                        <Input
                          className="bg-neutral-800 border-neutral-700 text-white mt-1"
                          value={mcType}
                          onChange={(e) => setMcType(e.target.value)}
                        />
                      </div>
                    )}
                    {mcLanguages && mcLanguages.split(",").length > 0 && (
                      <div>
                        <Label className="text-neutral-400">MC Languages</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mcLanguages.split(",").map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isClient && (
                  <div className="bg-neutral-800/50 rounded-lg p-4 mt-4">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Client Details
                    </h3>
                    {/* Client-specific fields */}
                    <div>
                      <Label className="text-neutral-400">
                        Organization Type
                      </Label>
                      <Input
                        className="bg-neutral-800 border-neutral-700 text-white mt-1 text-[12px]"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                    </div>
                    {/* Other client fields */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} /> Personal Info
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-400">First Name</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={firstname ? firstname : ""}
                    disabled
                  />
                </div>

                <div>
                  <Label className="text-neutral-400">Last Name</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={lastname ? lastname : ""}
                    disabled
                  />
                </div>
                {isMusician && (
                  <div>
                    <Label className="text-neutral-400">Date of Birth</Label>
                    <div className="flex gap-2 mt-1">
                      <select
                        className="appearance-none w-1/3 p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm"
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
                        className="appearance-none w-1/3 p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm"
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
                        className="w-1/3 bg-neutral-800 border-neutral-700 text-white text-sm"
                        placeholder="Year"
                        value={year}
                        onChange={(ev) => setYear(ev.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={18} /> Contact Info
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-400">Email</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={email || ""}
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-neutral-400">Phone</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                {/* <div>
                  <Label className="text-neutral-400">Organization</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company or group name"
                  />
                </div> */}
              </div>
            </div>

            {/* Location */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={18} /> Location
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-400">City</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={city || ""}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-neutral-400">Address</Label>
                  <Input
                    className="bg-neutral-800 border-neutral-700 text-white mt-1"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            {isMusician && (
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe size={18} /> Social Media
                </h2>
                <div className="space-y-2">
                  {handles.map((handle, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-sm capitalize">
                          {handle.platform}:
                        </span>
                        <span className="text-white text-sm">
                          {handle.handle}
                        </span>
                      </div>
                      <button
                        onClick={() => removeSocialHandle(index)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowSocialModal(true)}
                    className="text-rose-400 text-sm flex items-center mt-2"
                  >
                    <Plus size={14} className="mr-1" /> Add Social Media
                  </button>
                </div>
              </div>
            )}

            {/* Account Type */}
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={18} /> Account Type
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-neutral-400">
                    Musician/Talent Account
                  </Label>
                  <Switch
                    checked={isMusician}
                    onCheckedChange={() => toggleAccountType("musician")}
                    className="data-[state=checked]:bg-rose-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-neutral-400">Client Account</Label>
                  <Switch
                    checked={isClient}
                    onCheckedChange={() => toggleAccountType("client")}
                    className="data-[state=checked]:bg-rose-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            variant="default"
            className="bg-rose-600 hover:bg-rose-700 px-8 py-2 text-white font-bold"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Social Media Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">
              Add Social Media
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-neutral-400">Platform</Label>
                <Input
                  className="bg-neutral-700 border-neutral-600 text-white mt-1"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  placeholder="Instagram, Twitter, etc."
                />
              </div>
              <div>
                <Label className="text-neutral-400">Handle</Label>
                <Input
                  className="bg-neutral-700 border-neutral-600 text-white mt-1"
                  value={newSocialHandle}
                  onChange={(e) => setNewSocialHandle(e.target.value)}
                  placeholder="Your username"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                className="text-black border-neutral-600"
                onClick={() => setShowSocialModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={addSocialHandle}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Genre Modal */}
      {showGenreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 w-[100%]">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-[80%]">
            <h3 className="text-lg font-bold text-white mb-4">
              Add Music Genre
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-neutral-400">Genre</Label>
                <Input
                  className="bg-neutral-700 border-neutral-600 text-white mt-1 text-[13px]"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Rock, Jazz, Hip-Hop,RnB,Afrobeat,African, etc."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                className="text-black border-neutral-600"
                onClick={() => setShowGenreModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={addGenre}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentUserProfile;
