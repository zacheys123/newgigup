"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BallLoader from "../loaders/BallLoader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
import { experiences, instruments } from "@/data";
import { fonts } from "@/utils";

interface UserEmail {
  emailAddress: string;
  verification?: {
    status: string | null | undefined;
  };
}

interface UserPhone {
  phoneNumber: string;
}
interface UserInput {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  imageUrl?: string | null | undefined;
  username?: string | null | undefined;
  emailAddresses: UserEmail[];
  phoneNumbers: UserPhone[];
}
type Error = string[];
const ActionPage = () => {
  const { user, isSignedIn } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const [musicianload, setMusicianLoad] = useState<boolean>(false);
  const [clientload, setClientLoad] = useState<boolean>(false);
  const [userload, setUserload] = useState<boolean>(false);
  const { user: myuser } = useCurrentUser(userId || null);
  const [showMoreInfo, setMoreInfo] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [instrument, setInstrument] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [error, setError] = useState<Error>([]);

  const [roles, setRoles] = useState({
    musician: false,
    client: false,
  });

  const connectAsMusician = useCallback(async () => {
    if (!user) {
      console.error("No user data to send.");
      return;
    }

    console.log("Sending user to backend:", user);

    const errors: string[] = [];

    if (!city) {
      errors.push("City is required");
    }
    if (!instrument) {
      errors.push("Instrument is required");
    }
    if (!experience) {
      errors.push("Experience is required");
    }
    if (errors.length > 0) {
      setError(errors);
      return;
    }

    if (user && isSignedIn) {
      const transformedUser: UserInput = {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
        username: user.username ?? undefined,
        emailAddresses: user.emailAddresses,
        phoneNumbers: user.phoneNumbers,
      };
      setMusicianLoad(true);
      try {
        const res = await fetch(`/api/user/register `, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transformedUser,
            isMusician: true,
            isClient: false,
            city,
            instrument,
            experience,
          }),
        });
        const data = await res.json();
        window.localStorage.setItem("user", JSON.stringify(data.results));

        if (data.userstatus) {
          setMoreInfo(false);
          setTimeout(() => {
            router.push("/profile");
          }, 1000);
          console.log(data);
          toast.success(data.message);
        } else {
          console.log("Failed to connect as musician.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMusicianLoad(false);
      }
    }
  }, [isSignedIn, user, router, city, instrument, experience]);

  const connectAsClient = useCallback(async () => {
    if (!user) {
      console.error("No user data to send.");
      return;
    }
    const errors: string[] = [];
    if (!city) {
      errors.push("City is required");
    }
    if (errors.length > 0) {
      setError(errors);
      return;
    }

    console.log("Sending user to backend:", user);

    if (user && isSignedIn) {
      const transformedUser: UserInput = {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
        username: user.username ?? undefined,
        emailAddresses: user.emailAddresses,
        phoneNumbers: user.phoneNumbers,
      };
      setClientLoad(true);
      try {
        const res = await fetch(`/api/user/register `, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transformedUser,
            isClient: true,
            isMusician: false,
            city,
          }),
        });
        const data = await res.json();
        window.localStorage.setItem("user", JSON.stringify(data.results));
        console.log(data);

        setTimeout(() => {
          router.push(`/client/profile/${userId}`);
        }, 3000);
        toast.success("Welcome to Gigup!!!");
      } catch (error) {
        console.error(error);
      } finally {
        setClientLoad(false);
      }
    }
  }, [isSignedIn, user, city]);

  useEffect(() => {
    setUserload(false);
    setTimeout(() => {
      setUserload(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex justify-center items-center h-screen w-full bg-black">
      <AnimatePresence>
        {showMoreInfo && !myuser?.firstname ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-8 rounded-lg shadow-lg w-[80%] mx-auto max-w-md z-50 relative"
            >
              <span
                className="text-neutral-300 absolute top-3 right-5 text-[19px]"
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
                    {" "}
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
                      console.log("musician");
                    }
                    if (roles.client) {
                      connectAsClient();
                      console.log("client");
                    }
                  }}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors duration-300"
                >
                  Save and Continue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : showMoreInfo && myuser ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          >
            <div>
              {myuser && myuser?.isMusician && (
                <div className="h-[180px] w-[80%] mx-auto bg-neutral-800 p-7 rounded-xl shadow shadow-zinc-700">
                  <span className="flex flex-col">
                    <span className="text-green-300">Status:</span>{" "}
                    <span
                      className="text-neutral-300"
                      style={{ fontFamily: fonts[30] }}
                    >
                      You are currently registered as a musician
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
                      className="text-gray-300 bg-red-700 p-1 my-2 rounded-md "
                      onClick={() => setMoreInfo(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-1 -mt-[70px]">
          <span className=" mr-2">Welcome</span>
          to
          <span className="text-gradient ml-2">gigUp</span>
        </h1>
        <p className="text-gray-300 mb-8 text-sm sm:text-base">
          2 more steps to connect in gigup
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <div
            onClick={(ev) => {
              ev.stopPropagation();
              setRoles({ musician: false, client: true });
              console.log("Setting showMoreInfo to true");
              setMoreInfo(true);
            }}
            className="bg-gray-800 p-2 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm my-2 mx-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-500 mb-4">
              Client
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Join as a client to create gigs for musicians and choose the best
              talent to deliver quality music for you.
            </p>
            {userload && !myuser?.isClient && (
              <Button className="!bg-orange-700 !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base">
                {clientload ? <BallLoader /> : "Join as Client"}
              </Button>
            )}
          </div>

          <div
            onClick={(ev) => {
              ev.stopPropagation();
              setRoles({ musician: true, client: false });
              console.log("Setting showMoreInfo to true");
              setMoreInfo(true);
            }}
            className="bg-gray-800 p-2 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm my-2 mx-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-4">
              Musician
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Join as a musician to discover and book gigs while connecting with
              fellow musicians and clients.
            </p>
            {userload && !myuser?.isMusician && (
              <Button className="!bg-blue-800 !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base">
                {musicianload ? <BallLoader /> : "Join as Musician"}
              </Button>
            )}
          </div>

          <div className="bg-red-800 p-1 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm opacity-70 ">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">
              Both
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Join as both a Client and a musician to be able to create gigs and
              offer other musicians gigs and also be able to book a gig
              yourself.
            </p>

            <Button className="!bg-emerald-800 !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base flex-1">
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPage;
