"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// import BallLoader from "../loaders/BallLoader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
import { experiences, instruments } from "@/data";
import { MusicIcon, UsersIcon } from "lucide-react";
import { HiSwitchHorizontal } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";

// interface UserEmail {
//   emailAddress: string;
//   verification?: {
//     status: string | null | undefined;
//   };
// }

// interface UserPhone {
//   phoneNumber: string;
// }

// // interface UserInput {
// //   firstName?: string | null | undefined;
// //   lastName?: string | null | undefined;
// //   imageUrl?: string | null | undefined;
// //   username?: string | null | undefined;
// //   emailAddresses: UserEmail[];
// //   phoneNumbers: UserPhone[];
// // }

type Error = string[];
type RoleSteps = {
  instrumentalist: string[];
  dj: string[];
  mc: string[];
  vocalist: string[];
  default: string[];
};

// Define a type for valid role types
type RoleType = keyof Omit<RoleSteps, "default">; // 'instrumentalist' | 'dj' | 'mc'

const ActionPage = () => {
  const { user, isSignedIn } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const [musicianload, setMusicianLoad] = useState(false);
  const [clientload, setClientLoad] = useState(false);
  const [userload, setUserload] = useState(false);
  const { user: myuser } = useCurrentUser(userId || null);
  const [showMoreInfo, setMoreInfo] = useState(false);
  const [city, setCity] = useState("");
  const [instrument, setInstrument] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState<Error>([]);

  const [roles, setRoles] = useState({
    musician: false,
    client: false,
  });

  const transformedUser = useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
      username: user.username ?? undefined,
      emailAddresses: user.emailAddresses,
      phoneNumbers: user.phoneNumbers,
    };
  }, [user]);

  const [roleType, setRoleType] = useState<RoleType>("instrumentalist");
  const [djGenre, setDjGenre] = useState("");
  const [vocalistGenre, setVocalistGenre] = useState("");
  const [djEquipment, setDjEquipment] = useState("");
  const [mcType, setMcType] = useState("");
  const [mcLanguages, setMcLanguages] = useState("");
  const [talentbio, setTalentbio] = useState("");

  const validateMusicianFields = useCallback(() => {
    const errors: string[] = [];
    if (!city) errors.push("City is required");
    if (roleType === "instrumentalist" && !instrument)
      errors.push("Instrument is required");
    if (!experience) errors.push("Experience is required");
    if (roleType === "dj" && (!djGenre || !djEquipment))
      errors.push("DjGenre or Equipment is required");
    if (
      roleType === "vocalist" &&
      (!vocalistGenre || !experience || !talentbio)
    )
      errors.push("Genre or Experience and bio is required");
    if (roleType === "mc" && (!mcType || !mcLanguages))
      errors.push("MCType or Languages is required");
    if (talentbio.length > 200)
      errors.push("bio is too long (max 200 characters)");
    return errors;
  }, [
    city,
    instrument,
    experience,
    roleType,
    djGenre,
    djEquipment,
    mcType,
    mcLanguages,
    talentbio,
    vocalistGenre,
  ]);

  const validateClientFields = useCallback(() => {
    const errors: string[] = [];
    if (!city) errors.push("City is required");
    return errors;
  }, [city]);

  const registerUser = useCallback(
    async (isMusician: boolean) => {
      if (!transformedUser || !isSignedIn) {
        console.error("No user data or not signed in");
        return false;
      }
      if (!roleType) {
        error.push("No role type selected");
        return false;
      }
      const errors = isMusician
        ? validateMusicianFields()
        : validateClientFields();
      if (errors.length > 0) {
        setError(errors);
        return false;
      }

      try {
        const res = await fetch(`/api/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transformedUser,
            isMusician,
            isClient: !isMusician,
            city,
            ...(isMusician && {
              instrument,
              experience,
              roleType,
              djGenre,
              djEquipment,
              mcType,
              mcLanguages,
              talentbio,
              vocalistGenre,
            }),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        window.localStorage.setItem("user", JSON.stringify(data.results));
        return true;
      } catch (err) {
        console.error(err);
        toast.error("Registration failed");
        return false;
      }
    },
    [
      transformedUser,
      isSignedIn,
      city,
      instrument,
      experience,
      validateMusicianFields,
      validateClientFields,
      roleType,
      djGenre,
      djEquipment,
      mcType,
      mcLanguages,
      talentbio,
      error,
      vocalistGenre,
    ]
  );

  const connectAsMusician = useCallback(async () => {
    setMusicianLoad(true);
    try {
      const success = await registerUser(true);
      if (success) {
        setMoreInfo(false);
        setTimeout(() => router.push("/profile"), 1000);
        toast.success("Musician registration successful!");
      }
    } finally {
      setMusicianLoad(false);
    }
  }, [registerUser, router]);

  const connectAsClient = useCallback(async () => {
    setClientLoad(true);
    try {
      const success = await registerUser(false);
      if (success) {
        setTimeout(() => router.push(`/client/profile/${userId}`), 3000);
        toast.success("Welcome to Gigup!!!");
      }
    } finally {
      setClientLoad(false);
    }
  }, [registerUser, router, userId]);

  useEffect(() => {
    const timer = setTimeout(() => setUserload(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => setError([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRoleSelection = useCallback(
    (isMusician: boolean) => {
      if (myuser?.isMusician || myuser?.isClient) {
        setMoreInfo(true);
        return;
      }
      setRoles({ musician: isMusician, client: !isMusician });
      setMoreInfo(true);
    },
    [myuser]
  );
  console.log(roleType);
  const [currentStep, setCurrentStep] = useState(0);
  const renderMoreInfoModal = () => {
    const roleSteps: RoleSteps = {
      instrumentalist: ["city", "instrument", "experience", "talentbio"],
      dj: ["city", "genre", "equipment", "experience", "talentbio"],
      mc: ["city", "type", "languages", "experience", "talentbio"],
      vocalist: ["city", "vocalistgenre", "experience", "talentbio"],
      default: ["city"],
    };

    const steps = roles.musician
      ? roleSteps[roleType] || roleSteps.default
      : roleSteps.default;
    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handleBack = () => setCurrentStep((prev) => prev - 1);

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {currentStep > 0 && (
              <button onClick={handleBack} className="text-orange-400">
                <IoArrowBack />
              </button>
            )}
            <h3 className="text-orange-400 font-bold">
              Step {currentStep + 1}/{steps.length}
            </h3>
            <div className="w-8"></div> {/* Spacer */}
          </div>

          {/* Current Step Content */}
          <div className="mb-6 space-y-4">
            {steps[currentStep] === "city" && (
              <input
                type="text"
                placeholder="Your City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              />
            )}
            {/* Role Type Selection */}
            {roles.musician && (
              <div className="mt-4">
                <label className="block text-sm text-neutral-300 mb-2">
                  What do you do?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["instrumentalist", "dj", "mc", "vocalist"] as RoleType[]
                  ).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRoleType(role)}
                      className={`p-2 rounded border text-white text-[11px] ${
                        roleType === role
                          ? "border-orange-500 bg-orange-500/20"
                          : "border-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {role === "instrumentalist" && "Instrumentalist"}
                      {role === "dj" && "DJ"}
                      {role === "mc" && "MC/Host"}
                      {role === "vocalist" && "Vocalist"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {steps[currentStep] === "instrument" && (
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              >
                {instruments().map((inst) => (
                  <option key={inst.id} value={inst.name}>
                    {inst.val}
                  </option>
                ))}
              </select>
            )}

            {steps[currentStep] === "genre" && (
              <select
                value={djGenre}
                onChange={(e) => setDjGenre(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              >
                <option value="">Select DJ Genre</option>
                <option value="hiphop">Hip Hop</option>
                <option value="electronic">Electronic/Dance</option>
                <option value="reggae">Reggae/Dancehall</option>
                <option value="afrobeats">Afrobeats</option>
                <option value="openformat">Open Format</option>
              </select>
            )}
            {steps[currentStep] === "vocalistgenre" && (
              <select
                value={vocalistGenre}
                onChange={(e) => setVocalistGenre(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              >
                <option value="">Select Genre</option>
                <option value="hiphop">Jazz</option>
                <option value="electronic">Neo Soul</option>
                <option value="reggae">Mugithi</option>
                <option value="afrobeats">Afrobeats</option>
                <option value="openformat">Mix</option>
              </select>
            )}

            {steps[currentStep] === "equipment" && (
              <input
                type="text"
                placeholder="DJ Equipment (e.g. Pioneer CDJs)"
                value={djEquipment}
                onChange={(e) => setDjEquipment(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              />
            )}

            {steps[currentStep] === "type" && (
              <select
                value={mcType}
                onChange={(e) => setMcType(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              >
                <option value="">Select MC Type</option>
                <option value="eventhost">Event Host</option>
                <option value="weddingmc">Wedding MC</option>
                <option value="corporate">Corporate MC</option>
                <option value="battlemc">Battle MC</option>
              </select>
            )}

            {steps[currentStep] === "languages" && (
              <input
                type="text"
                placeholder="Languages spoken (comma separated)"
                value={mcLanguages}
                onChange={(e) => setMcLanguages(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              />
            )}

            {steps[currentStep] === "experience" && (
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              >
                {experiences().map((exp) => (
                  <option key={exp.id} value={exp.name}>
                    {exp.val}
                  </option>
                ))}
              </select>
            )}

            {steps[currentStep] === "talentbio" && (
              <textarea
                placeholder="Brief description of your style/skills"
                value={talentbio}
                onChange={(e) => setTalentbio(e.target.value)}
                rows={3}
                className="w-full p-2 rounded bg-gray-700 text-[12px] text-white"
              />
            )}
          </div>

          {/* Navigation */}
          <button
            onClick={
              currentStep === steps.length - 1
                ? () =>
                    roles.musician ? connectAsMusician() : connectAsClient()
                : handleNext
            }
            className="w-full py-2 bg-orange-500 rounded hover:bg-orange-600 text-white text-[13px]"
            disabled={musicianload || clientload}
          >
            {musicianload || clientload
              ? "Processing..."
              : currentStep === steps.length - 1
              ? "Complete Registration"
              : "Next"}
          </button>

          {error.length > 0 && (
            <div className="mt-4 text-red-400 text-sm">
              {error.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    // <div className="relative flex min-h-screen w-full items-center justify-center bg-neutral-950 px-4 py-16">
    //   {/* Animated background particles */}
    //   <div className="absolute inset-0 overflow-hidden opacity-20">
    //     {[...Array(20)].map((_, i) => (
    //       <div
    //         key={i}
    //         className="absolute rounded-full bg-orange-500/30"
    //         style={{
    //           width: `${Math.random() * 10 + 2}px`,
    //           height: `${Math.random() * 10 + 2}px`,
    //           top: `${Math.random() * 100}%`,
    //           left: `${Math.random() * 100}%`,
    //           animation: `float ${Math.random() * 10 + 10}s linear infinite`,
    //         }}
    //       />
    //     ))}
    //   </div>

    //   <AnimatePresence>{showMoreInfo && renderMoreInfoModal()}</AnimatePresence>

    //   <div className="relative z-10 w-full max-w-7xl">
    //     {/* Premium header */}
    //     <div className="mb-16 text-center">
    //       <motion.h1
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ duration: 0.6 }}
    //         className="text-5xl font-light tracking-tight text-white md:text-6xl"
    //       >
    //         Welcome to{" "}
    //         <span className="font-medium bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
    //           gigUp
    //         </span>
    //       </motion.h1>
    //       <motion.p
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ delay: 0.2, duration: 0.6 }}
    //         className="mt-4 text-sm uppercase tracking-widest text-neutral-400"
    //       >
    //         Elevate Your Creative Journey
    //       </motion.p>
    //     </div>

    //     {/* Role selection grid */}
    //     <motion.div
    //       initial={{ opacity: 0 }}
    //       animate={{ opacity: 1 }}
    //       transition={{ delay: 0.4 }}
    //       className="grid grid-cols-1 gap-8 md:grid-cols-3"
    //     >
    //       {[
    //         {
    //           role: "client",
    //           title: "Hire Talent",
    //           gradient: "from-orange-500 to-amber-600",
    //           description:
    //             "Access elite performers and streamline your event planning",
    //           icon: (
    //             <svg
    //               className="h-8 w-8"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth={1.5}
    //                 d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    //               />
    //             </svg>
    //           ),
    //           onClick: () => handleRoleSelection(false),
    //           buttonText: "Join as Client",
    //           disabled: !!myuser?.isClient,
    //           color: colors[12],
    //         },
    //         {
    //           role: "musician",
    //           title: "Find Gigs",
    //           gradient: "from-blue-500 to-cyan-600",
    //           description:
    //             "Showcase your artistry and connect with premium opportunities",
    //           icon: (
    //             <svg
    //               className="h-8 w-8"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth={1.5}
    //                 d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    //               />
    //             </svg>
    //           ),
    //           onClick: () => handleRoleSelection(true),
    //           buttonText: "Join as Talent",
    //           disabled: !!myuser?.isMusician,
    //           color: colors[12],
    //         },
    //         {
    //           role: "both",
    //           title: "Dual Role",
    //           gradient: "from-gray-700 to-gray-800",
    //           description:
    //             "Coming soon: Fluidly switch between hiring and performing",
    //           icon: (
    //             <svg
    //               className="h-8 w-8"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth={1.5}
    //                 d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    //               />
    //             </svg>
    //           ),
    //           buttonText: "Coming Soon",
    //           disabled: true,
    //           color: colors[12],
    //         },
    //       ].map(
    //         ({
    //           role,
    //           title,
    //           color,
    //           description,
    //           onClick,
    //           buttonText,
    //           disabled,
    //         }) => (
    //           <GigCard
    //             key={role}
    //             role={role}
    //             title={title}
    //             color={color}
    //             description={description}
    //             onClick={onClick}
    //             buttonText={buttonText}
    //             disabled={disabled}
    //             userload={userload}
    //           />
    //         )
    //       )}
    //     </motion.div>

    //     {/* Watermark */}
    //     <div className="mt-20 text-center">
    //       <p className="text-xs font-mono tracking-widest text-neutral-600">
    //         GIGUP {new Date().getFullYear()} | PREMIUM NETWORK
    //       </p>
    //     </div>
    //   </div>

    //   <style jsx>{`
    //     @keyframes float {
    //       0% {
    //         transform: translateY(0) rotate(0deg);
    //       }
    //       50% {
    //         transform: translateY(-20px) rotate(5deg);
    //       }
    //       100% {
    //         transform: translateY(0) rotate(0deg);
    //       }
    //     }
    //   `}</style>
    // </div>
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] px-4 py-16 overflow-hidden">
      {/* Holographic grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Animated border elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-orange-400/30 to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
      </div>

      <AnimatePresence>
        {showMoreInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {renderMoreInfoModal()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header with animated underline */}
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-medium tracking-tight text-white"
          >
            <span className="relative inline-block">
              Welcome to
              <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></span>
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              gigUp
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-sm uppercase tracking-[0.3em] text-neutral-400"
          >
            The Future of Creative Collaboration
          </motion.p>
        </div>

        {/* Role cards with glass morphism effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              role: "client",
              title: "Hire Talent",
              accent: "orange",
              description:
                "Create gigs and book top-tier musicians, DJs, and performers",
              buttonText: "Join as Client",
              disabled: !!myuser?.isClient,
              onClick: () => handleRoleSelection(false),
            },
            {
              role: "musician",
              title: "Find Gigs",
              accent: "blue",
              description:
                "Showcase your talent and connect with premium opportunities",
              buttonText: "Join as Talent",
              onClick: () => handleRoleSelection(true),
              disabled: !!myuser?.isMusician,
            },
            {
              role: "both",
              title: "Dual Role",
              accent: "gray",
              description: "Coming soon: Switch between hiring and performing",
              buttonText: "Coming Soon",
              disabled: true,
            },
          ].map((card) => (
            <div
              key={card.role}
              className={`
        relative overflow-hidden rounded-xl border border-transparent
        transition-all duration-300 hover:shadow-xl
        ${card.disabled ? "opacity-80" : "hover:-translate-y-1"}
        ${
          card.accent === "orange"
            ? "hover:border-orange-500/30 hover:shadow-orange-500/10"
            : card.accent === "cyan"
            ? "hover:border-blue-500/30 hover:shadow-blue-500/10"
            : "hover:border-gray-500/30"
        }
      `}
              onClick={!card.disabled ? card.onClick : undefined}
            >
              {/* Gradient border effect */}
              <div
                className={`
        absolute inset-0 bg-gradient-to-br rounded-xl
        ${
          card.accent === "orange"
            ? "from-orange-500/20 to-amber-600/10"
            : card.accent === "blue"
            ? "from-blue-500/20 to-cyan-600/10"
            : "from-gray-700/20 to-gray-800/10"
        }
      `}
              ></div>

              {/* Card content */}
              <div className="relative flex h-full flex-col bg-neutral-900/80 backdrop-blur-sm p-6">
                {/* Accent indicator */}
                <div
                  className={`
          absolute -left-1 top-6 h-8 w-1 rounded-full
          ${
            card.accent === "orange"
              ? "bg-orange-500"
              : card.accent === "blue"
              ? "bg-blue-500"
              : "bg-gray-600"
          }
        `}
                ></div>

                {/* Card header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-medium text-white">
                    {card.title}
                  </h3>
                  <div
                    className={`
            rounded-full p-2
            ${
              card.accent === "orange"
                ? "bg-orange-500/10 text-orange-400"
                : card.accent === "blue"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-gray-600/10 text-gray-400"
            }
          `}
                  >
                    {card.accent === "orange" ? (
                      <UsersIcon className="h-5 w-5" />
                    ) : card.accent === "blue" ? (
                      <MusicIcon className="h-5 w-5" />
                    ) : (
                      <HiSwitchHorizontal className="h-5 w-5" />
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-neutral-400">
                  {card.description}
                </p>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Button */}
                {userload && (
                  <button
                    onClick={card.onClick}
                    disabled={card.disabled}
                    className={`
            mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-all
            ${
              card.disabled
                ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                : card.accent === "orange"
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : card.accent === "blue"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-neutral-800 text-neutral-400"
            }
          `}
                  >
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Futuristic footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-400"></div>
            <p className="text-xs font-mono tracking-widest text-neutral-500">
              GIGUP v2.0 • {new Date().getFullYear()}
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-blue-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPage;
