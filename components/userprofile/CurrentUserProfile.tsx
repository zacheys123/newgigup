"use client";

import { CircularProgress } from "@mui/material";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useAuth, useUser } from "@clerk/nextjs";
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
import { UserProps, VideoProfileProps } from "@/types/userinterfaces";
import VideoProfileComponent from "../user/VideoProfileComponent";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import CountUp from "react-countup";

interface UpdateResponse {
  updateStatus: boolean;
  message?: string;
}

const CurrentUserProfile = () => {
  // Authentication and user data
  const { userId } = useAuth();
  const { user: userdata } = useUser();
  const { user, mutateUser } = useCurrentUser(userId || null);
  const { setRefetchData } = useStore();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    users: { name: string; email: string }[];
  }>({ title: "", users: [] });
  // User profile state
  const [loading, setLoading] = useState<boolean>(false);
  const [upload, showUpload] = useState<boolean>(false);

  // Personal Information
  const [firstname, setFirstname] = useState<string | null>("");
  const [lastname, setLastname] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [phone, setPhone] = useState<string>("");

  // Location Information
  const [address, setAddress] = useState<string | null>("");
  const [city, setCity] = useState<string>("");

  // Talent Information
  const [instrument, setInstrument] = useState<string>("Piano");
  const [experience, setExperience] = useState<string>("noexp");
  const [talentbio, setTalentbio] = useState<string>("");
  const [genre, setGenre] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState<string>("");
  const [showGenreModal, setShowGenreModal] = useState<boolean>(false);

  // Date of Birth
  const [age, setAge] = useState<string>("1");
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string>("");

  // Social Media
  const [handles, setHandles] = useState<
    { platform: string; handle: string }[]
  >([]);
  const [showSocialModal, setShowSocialModal] = useState<boolean>(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>("");
  const [newSocialHandle, setNewSocialHandle] = useState<string>("");

  // Account Type
  const [isMusician, setIsMusician] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Client Specific
  const [organization, setOrganization] = useState<string>("");
  const [clienthandles, setClientHandles] = useState<string>("");

  // Talent Specific
  const [djGenre, setDjGenre] = useState<string>("");
  const [djEquipment, setDjEquipment] = useState<string>("");
  const [mcType, setMcType] = useState<string>("");
  const [mcLanguages, setMcLanguages] = useState<string>("");

  // Video Profile
  const [videoUrl, setVideoUrl] = useState<string | null>("");
  const [videos, setVideos] = useState<VideoProfileProps[]>([]);

  // Constants
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
  const emailAddresses = useMemo(
    () => userdata?.emailAddresses || [],
    [userdata?.emailAddresses]
  );

  // Initialize user data
  useEffect(() => {
    if (user) {
      setFirstname(userdata?.firstName || "");
      setLastname(userdata?.lastName || "");
      setUsername(userdata?.username || "");
      setEmail(userdata?.emailAddresses[0].emailAddress || "");
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
  }, [
    user,
    userdata?.firstName,
    userdata?.lastName,
    emailAddresses,
    userdata?.username,
  ]);

  // Handle profile update
  const handleUpdate = async () => {
    const datainfo = {
      firstname,
      lastname,
      email,
      username,
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
      clienthandles,
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

  // Social media handlers
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

  // Genre handlers
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

  // Account type toggle
  const toggleAccountType = (type: "musician" | "client") => {
    if (type === "musician") {
      setIsMusician(true);
      setIsClient(false);
    } else {
      setIsMusician(false);
      setIsClient(true);
    }
  };

  // const [searchTerm, setSearchTerm] = useState("");
  // const filteredUsers = modalData.users.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );
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
    <div className="w-full h-full overflow-scroll flex-1 relative bg-gradient-to-b from-neutral-900 to-black py-1">
      <div className="max-w-4xl mx-auto pb-[50px]">
        {/* Profile Header */}
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
            className="flex gap-2 title"
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

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Followers",
              value: user?.followers?.length || 0,
              onClick: () => {
                setModalData({
                  title: "Followers",
                  users:
                    user?.followers?.map((f: UserProps) => ({
                      name: f.firstname + " " + f.lastname,
                      email: f.email,
                    })) || [],
                });
                setShowFollowingModal(true);
                setShowFollowersModal(false);
              },
            },
            {
              label: "Following",
              value: user?.followings?.length || 0,
              onClick: () => {
                setModalData({
                  title: "Following",
                  users:
                    user?.followings?.map((f: UserProps) => ({
                      name: f.firstname + " " + f.lastname,
                      email: f.email,
                    })) || [],
                });
                setShowFollowersModal(false);
                setShowFollowingModal(true);
              },
            },
            { label: "Reviews", value: user?.allreviews?.length || 0 },
            { label: "Videos", value: user?.videosProfile?.length || 0 },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-700/50 rounded-xl p-4 transition-all duration-300 group overflow-hidden"
              onClick={stat.onClick}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,_58,_237,_0.1)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Glow border effect on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/20 pointer-events-none transition-all duration-500" />

              <div className="relative z-10 text-center">
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2 group-hover:text-neutral-200 transition-colors">
                  {stat.label}
                </p>
                <p className="text-white font-bold text-2xl md:text-3xl">
                  <CountUp end={stat.value} duration={1.5} delay={0.2} />
                </p>

                {/* Micro-interaction indicator */}
                <div className="mt-3 h-1 w-6 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          id="startprof"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
          viewport={{ once: true }}
        >
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Videos Section */}
            {isMusician && (
              <SectionContainer
                icon={<Music size={18} />}
                title="Performance Videos"
                action={
                  <Button
                    variant="ghost"
                    className="text-rose-400 hover:bg-neutral-700"
                    onClick={() => showUpload(true)}
                  >
                    <Plus size={16} className="mr-1" /> Add Video
                  </Button>
                }
              >
                <VideoProfileComponent
                  user={user}
                  setVideoUrl={setVideoUrl}
                  videos={videos}
                  showUpload={showUpload}
                  upload={upload}
                  videoUrl={videoUrl}
                />
              </SectionContainer>
            )}

            {/* About/Bio Section */}
            <SectionContainer icon={<User size={18} />} title="About">
              <Label className="text-neutral-400">Bio</Label>
              <Textarea
                className="bg-neutral-800 border-neutral-700 text-white mt-1 text-[13px]"
                value={talentbio}
                onChange={(e) => setTalentbio(e.target.value)}
                placeholder="Describe your talents and skills..."
              />
            </SectionContainer>

            {/* Experience Section */}
            <SectionContainer icon={<Briefcase size={18} />} title="Experience">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isMusician && (
                  <>
                    <SelectInput
                      label="Primary Instrument"
                      value={instrument}
                      onChange={setInstrument}
                      options={instruments().map((ins) => ({
                        value: ins.name,
                        label: ins.val,
                      }))}
                    />

                    <SelectInput
                      label="Experience Level"
                      value={experience}
                      onChange={setExperience}
                      options={experiences().map((ex) => ({
                        value: ex.name,
                        label: ex.val,
                      }))}
                    />

                    <div className="md:col-span-2">
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
                      <TextInput
                        label="DJ Genre"
                        value={djGenre}
                        onChange={setDjGenre}
                      />
                    )}

                    {djEquipment && (
                      <TextInput
                        label="DJ Equipment"
                        value={djEquipment}
                        onChange={setDjEquipment}
                      />
                    )}

                    {mcType && (
                      <TextInput
                        label="MC Type"
                        value={mcType}
                        onChange={setMcType}
                      />
                    )}

                    {mcLanguages && mcLanguages.split(",").length > 0 && (
                      <div className="md:col-span-2">
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
                  <div className="md:col-span-2 bg-neutral-800/50 rounded-lg p-4 mt-4">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Client Details
                    </h3>
                    <TextInput
                      label="Organization Type"
                      value={organization}
                      onChange={setOrganization}
                    />
                  </div>
                )}
              </div>
            </SectionContainer>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            <SectionContainer icon={<User size={18} />} title="Personal Info">
              <TextInput
                label="First Name"
                value={firstname ? firstname : ""}
                disabled
                onChange={setFirstname}
              />
              <TextInput
                label="Last Name"
                value={lastname ? lastname : ""}
                disabled
                onChange={setLastname}
              />

              <TextInput
                label="Username"
                value={username ? username : ""}
                disabled
                onChange={setUsername}
              />
              {isMusician && (
                <div>
                  <Label className="text-neutral-400 text-[12px]">
                    Date of Birth
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <SelectInput
                      value={age}
                      onChange={setAge}
                      options={daysOfMonth.map((day) => ({
                        value: day.toString(),
                        label: day.toString(),
                      }))}
                      className="w-1/3"
                    />
                    <SelectInput
                      value={month ? month : ""}
                      onChange={setMonth}
                      options={months.map((m) => ({
                        value: m.toLowerCase(),
                        label: m.slice(0, 3),
                      }))}
                      className="w-1/3"
                    />
                    <Input
                      type="text"
                      className="w-1/3 bg-neutral-800 border-neutral-700 text-[12px] text-white text-sm"
                      placeholder="Year"
                      value={year}
                      onChange={(ev) => setYear(ev.target.value)}
                    />
                  </div>
                </div>
              )}
            </SectionContainer>

            {/* Contact Information */}
            <SectionContainer icon={<Mail size={18} />} title="Contact Info">
              <TextInput
                label="Email"
                value={email ? email : ""}
                disabled
                onChange={setEmail}
              />
              <TextInput
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="+1 (123) 456-7890"
              />
            </SectionContainer>

            {/* Location Information */}
            <SectionContainer icon={<Globe size={18} />} title="Location">
              <TextInput label="City" value={city || ""} onChange={setCity} />
              <TextInput
                label="Address"
                value={address ? address : ""}
                onChange={setAddress}
              />
            </SectionContainer>

            {/* Client Social Media */}
            {isClient && (
              <div>
                <Label className="text-neutral-400">Social Media</Label>
                <Input
                  className="w-full bg-neutral-700 text-white p-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={clienthandles}
                  onChange={(e) => setClientHandles(e.target.value)}
                  placeholder="Enter social media links, comma-separated"
                />
              </div>
            )}

            {/* Musician Social Media */}
            {isMusician && (
              <SectionContainer icon={<Globe size={18} />} title="Social Media">
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
              </SectionContainer>
            )}

            {/* Account Type Settings */}
            <SectionContainer icon={<Lock size={18} />} title="Account Type">
              <div className="space-y-4">
                <ToggleSwitch
                  label="Musician/Talent Account"
                  checked={isMusician}
                  onChange={() => toggleAccountType("musician")}
                />
                <ToggleSwitch
                  label="Client Account"
                  checked={isClient}
                  onChange={() => toggleAccountType("client")}
                />
              </div>
            </SectionContainer>
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
      <Modal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        title="Add Social Media"
      >
        <TextInput
          label="Platform"
          value={newSocialPlatform}
          onChange={setNewSocialPlatform}
          placeholder="Instagram, Twitter, etc."
        />
        <TextInput
          label="Handle"
          value={newSocialHandle}
          onChange={setNewSocialHandle}
          placeholder="Your username"
        />
        <ModalActions
          onCancel={() => setShowSocialModal(false)}
          onConfirm={addSocialHandle}
          confirmText="Add"
        />
      </Modal>

      {/* Genre Modal */}
      <Modal
        isOpen={showGenreModal}
        onClose={() => setShowGenreModal(false)}
        title="Add Music Genre"
      >
        <TextInput
          label="Genre"
          value={newGenre}
          onChange={setNewGenre}
          placeholder="Rock, Jazz, Hip-Hop, RnB, Afrobeat, etc."
        />
        <ModalActions
          onCancel={() => setShowGenreModal(false)}
          onConfirm={addGenre}
          confirmText="Add"
        />
      </Modal>
      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title={modalData.title}
        users={modalData.users}
      />

      {/* Following Modal */}
      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title={modalData.title}
        users={modalData.users}
      />
    </div>
  );
};

// Reusable Components
const SectionContainer = ({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-neutral-800/50 rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        {icon} {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <Label className="text-neutral-400 text-[12px]">{label}</Label>
    <Input
      className={`bg-neutral-800 border-neutral-700 text-white mt-1 text-[12px] ${
        disabled ? "opacity-70" : ""
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) => (
  <div className={className}>
    {label && <Label className="text-neutral-400 text-[12px]">{label}</Label>}
    <select
      className={`appearance-none w-full p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm mt-1 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center justify-between">
    <Label className="text-neutral-400">{label}</Label>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-rose-600"
    />
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          {/* Overlay with subtle gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-purple-900/20" />

          <motion.div
            ref={modalRef}
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-700/50 shadow-2xl overflow-hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5 text-neutral-300">{children}</div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-purple-500/30 transition-all duration-500 rounded-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const UserListModal = ({
  isOpen,
  onClose,
  title,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: { name: string; email: string }[];
}) => {
  console.log(users);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="max-h-[60vh] overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-neutral-400 text-center py-4">
            No {title.toLowerCase()} found
          </p>
        ) : (
          <ul className="divide-y divide-neutral-700">
            {users.map((user, index) => (
              <li
                key={index}
                className="py-3 px-2 hover:bg-neutral-800/50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                    <User size={16} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-neutral-400 text-sm">{user.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};
const ModalActions = ({
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
}) => (
  <div className="flex justify-end gap-2 mt-6">
    <Button
      variant="outline"
      className="text-black border-neutral-600"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
      {confirmText}
    </Button>
  </div>
);

export default CurrentUserProfile;
