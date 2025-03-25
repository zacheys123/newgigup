"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BallLoader from "../loaders/BallLoader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
import { experiences, instruments } from "@/data";
import { fonts } from "@/utils";
import GigCard from "../GigCard";

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

  const validateMusicianFields = useCallback(() => {
    const errors: string[] = [];
    if (!city) errors.push("City is required");
    if (!instrument) errors.push("Instrument is required");
    if (!experience) errors.push("Experience is required");
    return errors;
  }, [city, instrument, experience]);

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
            ...(isMusician && { instrument, experience }),
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
    const timer = setTimeout(() => setUserload(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => setError([]), 5000);
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

  const renderMoreInfoModal = () => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
    >
      {myuser?.firstname ? (
        <div className="h-[180px] w-[80%] mx-auto bg-neutral-800 p-7 rounded-xl shadow shadow-zinc-700">
          <span className="flex flex-col">
            <span className="text-green-300">Status:</span>
            <span
              className="text-neutral-300"
              style={{ fontFamily: fonts[30] }}
            >
              You are currently registered as a{" "}
              {myuser.isMusician ? "musician" : "client"}
            </span>
            <span
              className="text-neutral-300 text-[10px]"
              style={{ fontFamily: fonts[30] }}
            >
              N/B://not possible to register again
            </span>
          </span>
          <div className="flex justify-center w-full my-2">
            <button
              className="text-gray-300 bg-red-700 p-1 my-2 rounded-md"
              onClick={() => setMoreInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-[80%] mx-auto max-w-md z-50 relative"
        >
          <span
            className="text-neutral-300 absolute top-3 right-5 text-[19px] cursor-pointer"
            onClick={() => setMoreInfo(false)}
          >
            &times;
          </span>
          <h2 className="text-2xl font-semibold text-orange-300 mb-6">
            More Information
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            {roles.musician && (
              <>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  {instruments().map((ins) => (
                    <option key={ins.id} value={ins.name}>
                      {ins.val}
                    </option>
                  ))}
                </select>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  {experiences().map((ex) => (
                    <option key={ex.id} value={ex.name}>
                      {ex.val}
                    </option>
                  ))}
                </select>
              </>
            )}
            {error.length > 0 && (
              <div className="text-red-400 text-xs mt-2 font-bold font-mono my-1">
                {error.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </div>
            )}

            <Button
              onClick={(ev) => {
                ev.preventDefault();
                if (roles.musician) {
                  connectAsMusician();
                } else {
                  connectAsClient();
                }
              }}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors duration-300"
            >
              {musicianload || clientload ? (
                <BallLoader />
              ) : (
                " Save and Continue "
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="flex justify-center items-center h-screen w-full bg-black">
      <AnimatePresence>{showMoreInfo && renderMoreInfoModal()}</AnimatePresence>

      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-1 -mt-[70px]">
          <span className="mr-2">Welcome</span>
          to
          <span className="text-gradient ml-2">gigUp</span>
        </h1>
        <p className="text-gray-300 mb-8 text-sm sm:text-base">
          2 more steps to connect in gigup
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {[
            {
              role: "client",
              title: "Client",
              color: "orange",
              description:
                "Join as a client to create gigs for musicians and choose the best talent to deliver quality music for you.",
              onClick: () => handleRoleSelection(false),
              buttonText: "Join as Client",
              disabled: !!myuser?.isClient,
            },
            {
              role: "musician",
              title: "Musician",
              color: "blue",
              description:
                "Join as a musician to discover and book gigs while connecting with fellow musicians and clients.",
              onClick: () => handleRoleSelection(true),
              buttonText: "Join as Musician",
              disabled: !!myuser?.isMusician,
            },
            {
              role: "both",
              title: "Both",
              color: "gray",
              description:
                "Join as both a Client and a musician to be able to create gigs and offer other musicians gigs and also be able to book a gig yourself.",
              buttonText: "Coming Soon",
              disabled: true,
            },
          ].map(
            ({
              role,
              title,
              color,
              description,
              onClick,
              buttonText,
              disabled,
            }) => (
              <GigCard
                key={role}
                role={role}
                title={title}
                color={color}
                description={description}
                onClick={onClick}
                buttonText={buttonText}
                disabled={disabled}
                userload={userload}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionPage;
