"use client";

import { useEffect, useMemo, useState } from "react";

// Define the shape of the user object
interface Video {
  title: string;
  source: string;
}

interface Review {
  rating: number;
  comment: string;
  gigId: string; // assuming Gig ID is a string
  updatedAt: Date;
  createdAt: Date;
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
  clerkId: string; // Required and unique
  picture?: string;
  firstname?: string;
  lastname?: string;
  city?: string;
  date?: string;
  month?: string;
  year?: string;
  address?: string;
  instrument?: string;
  experience?: string;
  phone?: string;
  verification?: string;
  username: string; // Required, unique, and lowercase
  followers: string[]; // Array of User IDs
  followings: string[]; // Array of User IDs
  videos: Video[];
  allreviews: Review[];
  myreviews: Review[];
}

export function useCurrentUser(userId: string | null) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    clerkId: "",
    username: "",
    followers: [],
    followings: [],
    videos: [],
    allreviews: [],
    myreviews: [],
  });

  // Memoize the URL to prevent unnecessary re-renders
  const url = useMemo(() => `/api/user/getuser/${userId}`, [userId]);

  useEffect(() => {
    // Safely parse user data from localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUser = window.localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
          }
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setUser({
        clerkId: "",
        username: "",
        followers: [],
        followings: [],
        videos: [],
        allreviews: [],
        myreviews: [],
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
              username: "",
              followers: [],
              followings: [],
              videos: [],
              allreviews: [],
              myreviews: [],
            });
          return;
        }

        const fetchedUser: User = await res.json();
        if (isMounted) setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted)
          setUser({
            clerkId: "",
            username: "",
            followers: [],
            followings: [],
            videos: [],
            allreviews: [],
            myreviews: [],
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
  }, [url, userId]);

  return { loading, user, setUser };
}
