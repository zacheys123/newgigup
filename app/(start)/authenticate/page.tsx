"use client";
import AllDirections from "@/components/loaders/AllDirections";
import Title from "@/components/loaders/Title";

import { useAuth, useUser } from "@clerk/nextjs";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import "@/components/loaders/word.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import useStore from "@/app/zustand/useStore";

const Authenticate = () => {
  const [firstloader, setfirstloader] = useState<boolean>(false);
  const [secondloader, setsecondloader] = useState<boolean>(false);
  const [thirdloader, setthirdloader] = useState<boolean>(false);
  const [fourthloader, setforthloader] = useState<boolean>(false);
  const [mainloader, setMainloader] = useState<boolean>(false);
  const router = useRouter();
  const { currentUser: myuser } = useStore();
  const { user, isSignedIn } = useUser();
  const { isLoaded } = useAuth();
  const LoadingPage = useCallback(() => {
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
                    // toast.success("Successfully logged in, Welcome!");
                    setforthloader(false);

                    setMainloader(true);
                    // router.push("/");
                    timeoutRefs.current.push(
                      setTimeout(() => {
                        setMainloader(false);
                        if (isSignedIn) {
                          if (myuser?._id) {
                            router.push(`/roles/${user?.id}`);
                          } else {
                            router.push("/");
                          }
                        }
                      }, 5000)
                    );
                  }, 4000)
                );
              }, 4500)
            );
          }, 4000)
        );
      }, 5000)
    );
  }, []);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]); // Timeout references for clearing

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    LoadingPage();

    console.log("User data not available or not signed in.");
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <h3 className="text-red-600 font-bold font-mono">
          Waiting for user info to load :)...
        </h3>
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <h3>User signup failed,no User logged in</h3>
      </div>
    );
  }

  return (
    <div className=" flex justify-center items-center h-screen w-full bg-black">
      <div className="loaderIn ">
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__bar bg-gray-400"></div>
        <div className="loader__ball"></div>
      </div>
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
      {mainloader && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-40">
          <CircularProgress size={70} color="secondary" thickness={4} />
        </div>
      )}
    </div>
  );
};

export default Authenticate;
