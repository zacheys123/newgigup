// "use client";

// import useStore from "@/app/zustand/useStore";
// import { GigProps, Gigs } from "@/types/giginterface";
// import { useEffect, useMemo, useState } from "react";

// export function useAllGigs() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const { refetchGig } = useStore();
//   const [gigs, setGigs] = useState<{ gigs: GigProps[] } | null>(null);

//   const url = useMemo(() => `/api/gigs/getgigs`, []);

//   useEffect(() => {
//     let isMounted = true;

//     const getGigs = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Cache-Control": "no-cache, no-store, must-revalidate",
//             Pragma: "no-cache",
//             Expires: "0",
//           },
//         });

//         if (!res.ok) {
//           console.error(`Failed to fetch gigs: ${res.statusText}`);
//           if (isMounted) setGigs(null);
//           return;
//         }

//         const fetchedGigs: Gigs = await res.json();
//         console.log(fetchedGigs); // Check if the fetched data is correct
//         if (isMounted) setGigs(fetchedGigs);
//       } catch (error) {
//         console.error("Error fetching gigs:", error);
//         if (isMounted) setGigs(null);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     getGigs();

//     return () => {
//       isMounted = false;
//     };
//   }, [url, refetchGig]);

//   return { loading, gigs };
// }

import { GigProps } from "@/types/giginterface";
import { useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAllGigs() {
  const [allgigs, setAllGigs] = useState<GigProps[]>([]); // Initialize as empty array
  const urldata = useMemo(() => `/api/gigs/getgigs`, []);
  const { data, error, mutate } = useSWR(urldata, fetcher, {
    onSuccess: (data) => {
      console.log(data);
      setTimeout(() => mutate(urldata), 1000000);
      setAllGigs(data.gigs || []); // Assuming the API returns { gigs: [...] }
    },
  });

  return {
    gigs: allgigs, // Now this is directly the array
    loading: !error && !data,
    error,
    mutateGigs: mutate,
  };
}
