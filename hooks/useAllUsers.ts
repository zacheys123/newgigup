// "use client";
// import { UserProps, Users } from "@/types/userinterfaces";
// import { useEffect, useMemo, useState } from "react";

// export function useAllUsers() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [users, setUsers] = useState<{ users: UserProps[] } | null>({
//     users: [
//       {
//         _id: "",
//         email: "",
//         clerkId: "",
//         picture: "",
//         firstname: "",
//         lastname: "",
//         city: "",
//         date: "",
//         month: "",
//         year: "",
//         address: "",
//         instrument: "",
//         experience: "",
//         phone: "",
//         verification: "",
//         username: "",
//         followers: [],
//         followings: [],

//         allreviews: [],
//         myreviews: [],
//         isClient: false,
//         isMusician: false,
//         videosProfile: [],
//         organization: "",
//         bio: "",
//         handles: "",
//         genre: "",
//         refferences: [],
//         vocalistGenre: "",
//         roleType: "",
//         djGenre: "",
//         djEquipment: "",
//         mcType: "",
//         mcLanguage: "",
//         talentbio: "",
//       },
//     ],
//   });

//   // Memoize the URL to prevent unnecessary re-renders
//   const url = useMemo(() => `/api/user/getusers`, []);

//   useEffect(() => {
//     let isMounted = true; // Guard to prevent state updates after unmount

//     const getUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok) {
//           console.error(`Failed to fetch gigs: ${res.statusText}`);
//           if (isMounted)
//             setUsers({
//               users: [
//                 {
//                   _id: "",
//                   email: "",
//                   clerkId: "",
//                   picture: "",
//                   firstname: "",
//                   lastname: "",
//                   city: "",
//                   date: "",
//                   month: "",
//                   year: "",
//                   address: "",
//                   instrument: "",
//                   experience: "",
//                   phone: "",
//                   verification: "",
//                   username: "",
//                   followers: [],
//                   followings: [],

//                   allreviews: [],
//                   myreviews: [],
//                   isClient: false,
//                   isMusician: false,
//                   videosProfile: [],
//                   organization: "",
//                   bio: "",
//                   handles: "",
//                   genre: "",
//                   refferences: [],
//                   vocalistGenre: "",
//                   roleType: "",
//                   djGenre: "",
//                   djEquipment: "",
//                   mcType: "",
//                   mcLanguage: "",
//                   talentbio: "",
//                 },
//               ],
//             });
//           return;
//         }

//         const fetchedGigs: Users = await res.json();
//         console.log(fetchedGigs);
//         if (isMounted) setUsers(fetchedGigs);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         if (isMounted)
//           setUsers({
//             users: [
//               {
//                 _id: "",
//                 email: "",
//                 clerkId: "",
//                 picture: "",
//                 firstname: "",
//                 lastname: "",
//                 city: "",
//                 date: "",
//                 month: "",
//                 year: "",
//                 address: "",
//                 instrument: "",
//                 experience: "",
//                 phone: "",
//                 verification: "",
//                 username: "",
//                 followers: [],
//                 followings: [],

//                 allreviews: [],
//                 myreviews: [],
//                 isClient: false,
//                 isMusician: false,
//                 videosProfile: [],
//                 organization: "",
//                 bio: "",
//                 handles: "",
//                 genre: "",
//                 roleType: "",
//                 djGenre: "",
//                 djEquipment: "",
//                 mcType: "",
//                 mcLanguage: "",
//                 talentbio: "",
//                 refferences: [],
//                 vocalistGenre: "",
//               },
//             ],
//           });
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     getUsers();

//     // Cleanup function to avoid setting state after component unmounts
//     return () => {
//       isMounted = false;
//     };
//   }, [url]);

//   return { loading, users };
// }

// // gigs = gigs?.filter((gig) => {
// //   if (gig?.postedBy?.clerkId.includes(id)) {
// //     return gigs;
// //   }
// //   return null;
// // });

import { useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAllUsers() {
  const urldata = useMemo(() => `/api/user/getusers`, []);
  const { data, error, mutate } = useSWR(urldata, fetcher);

  return {
    users: data,
    loading: !error && !data,
    error,
    mutateGigs: mutate, // expose the mutate function
  };
}
