"use client";

import AllDirections from "@/components/loaders/AllDirections";
import Title from "@/components/loaders/Title";
import { useAuth, useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
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
  imageUrl?: string;
  username?: string;
  emailAddresses: UserEmail[];
  phoneNumbers: UserPhone[];
}

const Authenticate = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [firstloader, setfirstloader] = useState<boolean>(false);
  const [secondloader, setsecondloader] = useState<boolean>(false);
  const [thirdloader, setthirdloader] = useState<boolean>(false);
  const [fourthloader, setforthloader] = useState<boolean>(false);
  const { isLoaded, userId } = useAuth();
  const registerUser = useCallback(
    async (user: UserInput | null | undefined) => {
      if (!user) {
        console.error("No user data to send.");
        return;
      }

      console.log("Sending user to backend:", user);

      try {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        });

        if (!res.ok) {
          console.error("Failed to register user.");
          return;
        }

        const data: { userstatus: boolean; results: object } = await res.json();
        console.log(data);

        window.localStorage.setItem("user", JSON.stringify(data.results));

        if (data.userstatus === false) {
          setfirstloader(true);

          // Store timeouts in refs
          timeoutRefs.current.push(
            setTimeout(() => {
              setfirstloader(false);
              setsecondloader(true);

              timeoutRefs.current.push(
                setTimeout(() => {
                  setsecondloader(false);
                  setthirdloader(true);

                  timeoutRefs.current.push(
                    setTimeout(() => {
                      setthirdloader(false);
                      setforthloader(true);

                      timeoutRefs.current.push(
                        setTimeout(() => {
                          toast.success("Successfully logged in, Welcome!");
                          setforthloader(false);
                          router.push("/");
                        }, 6000)
                      );
                    }, 5500)
                  );
                }, 3500)
              );
            }, 2000)
          );
        }
      } catch (error) {
        console.error("Error during user registration:", error);
      }
    },
    []
  );

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]); // Timeout references for clearing

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (user && isSignedIn) {
      const transformedUser: UserInput = {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
        username: user.username ?? undefined,
        emailAddresses: user.emailAddresses,
        phoneNumbers: user.phoneNumbers,
      };
      registerUser(transformedUser);
    } else {
      console.log("User data not available or not signed in.");
    }
  }, [user, isSignedIn, registerUser]);

  if (!isLoaded) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <h3 className="text-red-600 font-bold font-mono">
          Waiting for user info to load :)...
        </h3>
      </div>
    );
  }
  if (!userId) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <h3>User signup failed,no User logged in</h3>
      </div>
    );
  }

  return (
    <div className=" flex justify-center items-center h-screen w-full bg-black">
      {/* <div className="loaderIn ">
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__ball"></div>
      </div>
       */}
      {firstloader && (
        <div className="container">
          <div className="loader_data"></div>
          <div className="loader_data"></div>
          <div className="loader_data"></div>
        </div>
      )}
      {secondloader && (
        <div className="card">
          <div className="loaderin">
            <div className="words">
              <span className="word">Create</span>
              <span className="word">Connect</span>
              <span className="word">Improve</span>
              <span className="word">With</span>
              <span className="word text-amber-600 font-mono">gigUp</span>
            </div>
          </div>
        </div>
      )}
      {thirdloader && (
        <div className="flex justify-center items-center h-screen w-full bg-black">
          <AllDirections />
        </div>
      )}
      {fourthloader && (
        <div className="flex justify-center items-center h-screen w-full bg-black">
          <Title />
        </div>
      )}
    </div>
  );
};

export default Authenticate;
