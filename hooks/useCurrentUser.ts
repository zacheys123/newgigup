"use client";

import useStore from "@/app/zustand/useStore";
import { Review, UserProps } from "@/types/userinterfaces";
import { useEffect, useMemo, useState } from "react";

// Define the shape of the user object

export function useCurrentUser(userId: string | null) {
  const { setCurrentUser, refetchData } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>();

  const [user, setUser] = useState<UserProps>({
    clerkId: "",
    firstname: "",
    lastname: "",
    experience: "",
    instrument: "",
    username: "",
    followers: [],
    followings: [],
    allreviews: [],
    myreviews: [],
    isMusician: false,
    isClient: false,
    videosProfile: [],
  });

  // Memoize the URL to prevent unnecessary re-renders
  const url = useMemo(() => `/api/user/getuser/${userId}`, [userId]);

  // useEffect(() => {
  //   // Safely parse user data from localStorage
  //   if (typeof window !== "undefined") {
  //     try {
  //       const storedUser = window.localStorage.getItem("user");
  //       if (storedUser) {
  //         try {
  //           const parsedUser = JSON.parse(storedUser);
  //           setUser(parsedUser);
  //           setCurrentUser(parsedUser);
  //         } catch (e) {
  //           console.error("Failed to parse user data from localStorage:", e);
  //         }
  //       }
  //     } catch (e) {
  //       console.error("Failed to parse user data from localStorage:", e);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (!userId) {
      setUser({
        clerkId: "",
        firstname: "",
        lastname: "",
        experience: "",
        instrument: "",
        username: "",
        followers: [],
        followings: [],
        allreviews: [],
        myreviews: [],
        isMusician: false,
        isClient: false,
        videosProfile: [],
      });
      return;
    }

    let isMounted = true; // Guard to prevent state updates after unmount

    const getUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch user: ${res.statusText}`);
          if (isMounted)
            setUser({
              clerkId: "",
              firstname: "",
              lastname: "",
              experience: "",
              instrument: "",
              username: "",
              followers: [],
              followings: [],
              allreviews: [],
              myreviews: [],
              isMusician: false,
              isClient: false,
              videosProfile: [],
            });
          return;
        }

        const fetchedUser: UserProps = await res.json();
        if (isMounted) {
          setCurrentUser(fetchedUser);
          setUser(fetchedUser);
          setReviews(fetchedUser?.myreviews);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted)
          setUser({
            clerkId: "",
            firstname: "",
            lastname: "",
            experience: "",
            instrument: "",
            username: "",
            followers: [],
            followings: [],
            allreviews: [],
            myreviews: [],
            isMusician: false,
            isClient: false,
            videosProfile: [],
          });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUser();

    // Cleanup function to avoid setting state after component unmounts
    return () => {
      isMounted = false;
    };
  }, [url, userId, refetchData]);

  return { loading, user, setUser, setReviews, reviews };
}
