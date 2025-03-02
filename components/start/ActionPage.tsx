"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BallLoader from "../loaders/BallLoader";

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

// interface ActionPageProps {
//   user: UserInput | null | undefined;
//   isSignedIn: boolean | undefined;
// }
const ActionPage = () => {
  const { user, isSignedIn } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const [musicianload, setMusicianLoad] = useState<boolean>(false);
  const [clientload, setClientLoad] = useState<boolean>(false);
  const [userload, setUserload] = useState<boolean>(false);

  const connectAsMusician = useCallback(async () => {
    if (!user) {
      console.error("No user data to send.");
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
      setMusicianLoad(true);
      try {
        const res = await fetch(`/api/user/register `, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transformedUser, isMusician: true,isClient:false }),
        });
        const data = await res.json();
        window.localStorage.setItem("user", JSON.stringify(data.results));
        window.location.reload();
        router.push("/profile");
        console.log(data);
        if (data.userstatus) {
          // Userstatusful connection as musician
          setTimeout(() => {
            window.location.reload();
            router.push("/profile");
          }, 1000);
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
  }, [isSignedIn, user, router]);
  const connectAsClient = useCallback(async () => {
    if (!user) {
      console.error("No user data to send.");
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
          body: JSON.stringify({ transformedUser, isClient: true ,isMusician:false}),
        });
        const data = await res.json();
        window.localStorage.setItem("user", JSON.stringify(data.results));
        console.log(data);

        // Userstatusful connection as client
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
  }, [isSignedIn, user]);

  useEffect(() => {
    setUserload(false);
    setTimeout(() => {
      setUserload(true);
    }, 5000);
  }, []);
  return (
    <div className="flex justify-center items-center h-screen w-full bg-black">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-300 mb-1 -mt-[70px]">
          <span className=" mr-2">Welcome</span>
          to
          <span className="text-gradient ml-2">gigUp</span>
        </h1>
        <p className="text-gray-300 mb-8 text-sm sm:text-base">
          2 more step to connect in gigup
        </p>

        {/* Cards Container */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {/* Creator Card */}
          <div
            onClick={connectAsClient}
            className="bg-gray-800 p-2 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm my-2 mx-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-500 mb-4">
              Client
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Join as a client to create gigs for musicians and choose the best
              talent to deliver quality music for you.
            </p>
            {userload === true && (
              <Button className="!bg-orange-700 !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base">
                {clientload ? <BallLoader /> : "Join as Client"}
              </Button>
            )}
          </div>

          {/* Booker Card */}
          <div
            onClick={connectAsMusician}
            className="bg-gray-800 p-2 sm:p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex-1 max-w-sm my-2 mx-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-4">
              Musician
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Join as a musician to discover and book gigs while connecting with
              fellow musicians and clients.
            </p>
            {userload === true && (
              <Button className="!bg-blue-800 !text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-sm sm:text-base">
                {musicianload ? <BallLoader /> : "Join as Musician"}
              </Button>
            )}
          </div>

          {/* Both Card */}
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
