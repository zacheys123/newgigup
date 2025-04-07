"use client";

import useStore from "@/app/zustand/useStore";
import { Review, UserProps } from "@/types/userinterfaces";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

// Define the shape of the user object
export interface UserResponse {
  user: UserProps; // This matches your actual data structure
}
export function useCurrentUser() {
  const { user: clerkUser } = useUser();
  const { setCurrentUser, refetchData } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>();

  const userId = clerkUser?.id;
  const [user, setUser] = useState<UserResponse>({
    user: {
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
      organization: "",
      bio: "",
      handles: "",
      genre: "",
      refferences: [],
      roleType: "",
      djGenre: "",
      djEquipment: "",
      mcType: "",
      mcLanguage: "",
      talentbio: "",
      vocalistGenre: "",
      musicianhandles: [{ platform: "", handle: "" }],
      musiciangenres: [],
      firstLogin: true,
      onboardingComplete: false,
    },
  });

  // Memoize the URL to prevent unnecessary re-renders

  const url = useMemo(
    () => (clerkUser?.id ? `/api/user/getuser/${clerkUser?.id}` : ""),
    [clerkUser?.id]
  );
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
        user: {
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
          organization: "",
          bio: "",
          handles: "",
          genre: "",
          refferences: [],
          roleType: "",
          djGenre: "",
          djEquipment: "",
          mcType: "",
          mcLanguage: "",
          talentbio: "",
          vocalistGenre: "",
          musicianhandles: [{ platform: "", handle: "" }],
          musiciangenres: [],
          firstLogin: true,
          onboardingComplete: false,
        },
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
              user: {
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
                organization: "",
                bio: "",
                handles: "",
                genre: "",
                refferences: [],
                roleType: "",
                djGenre: "",
                djEquipment: "",
                mcType: "",
                mcLanguage: "",
                talentbio: "",
                vocalistGenre: "",
                musicianhandles: [{ platform: "", handle: "" }],
                musiciangenres: [],
                firstLogin: true,
                onboardingComplete: false,
              },
            });
          return;
        }

        const fetchedUser = await res.json();
        if (isMounted) {
          setCurrentUser(fetchedUser);
          setUser(fetchedUser);
          setReviews(fetchedUser?.myreviews);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted)
          setUser({
            user: {
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
              organization: "",
              bio: "",
              handles: "",
              genre: "",
              refferences: [],
              roleType: "",
              djGenre: "",
              djEquipment: "",
              mcType: "",
              mcLanguage: "",
              talentbio: "",
              vocalistGenre: "",
              musicianhandles: [{ platform: "", handle: "" }],
              musiciangenres: [],
              firstLogin: true,
              onboardingComplete: false,
            },
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
// useCurrentUser.ts
// import useStore from "@/app/zustand/useStore";
// import { Review } from "@/types/userinterfaces";
// import { useMemo, useState } from "react";
// import useSWR from "swr";
// import { useUser } from "@clerk/nextjs";
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// // interface UseCurrentUserReturn {
// //   user: UserProps; // Replace with your User type
// //   loading: boolean;
// //   reviews: Review[];
// //   mutateUser: () => void;
// //   setReviews: (reviews: Review[]) => void;
// //   error?: Error;
// // }

// export function useCurrentUser() {
//   const { user: clerkUser } = useUser();
//   const urldata = useMemo(
//     () => (clerkUser?.id ? `/api/user/getuser/${clerkUser?.id}` : ""),
//     [clerkUser?.id]
//   );
//   const setCurrentUser = useStore((state) => state.setCurrentUser);
//   const [reviews, setReviews] = useState<Review[]>([]);

//   const { data, error, } = useSWR(urldata, fetcher, {
//     onSuccess: (userdata) => {
//       if (userdata?.user) {
//         setCurrentUser(userdata.user);
//         setReviews(userdata.user.myReviews || []);
//       }
//     },
//   });

//   return {
//     user: data?.user,
//     loading: !error && !data,
//     reviews,
//     // mutateUser: mutate,
//     setReviews,
//     error,
//   };
// }
