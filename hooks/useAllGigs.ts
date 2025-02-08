"use client";

import { GigProps, Gigs } from "@/types/giginterface";
import { postedBy } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export function useAllGigs() {
  const [loading, setLoading] = useState<boolean>(false);
  const [gigs, setGigs] = useState<{ gigs: GigProps[] } | null>({
    gigs: [
      {
        _id: "",
        postedBy: postedBy,
        bookedBy: postedBy,
        title: "",
        secret: "",
        description: "",
        phone: "",
        price: "",
        category: "",
        bandCategory: [],
        bussinesscat: "",
        location: "",
        date: new Date(),
        time: {},
        isTaken: false,
        isPending: false,
        viewCount: [],
        username: "",
        updatedAt: new Date(),
        createdAt: new Date(),
        bookCount: [],
        font: "",
        fontColor: "",
        backgroundColor: "",
        logo: "",
      },
    ],
  });

  // Memoize the URL to prevent unnecessary re-renders
  const url = useMemo(() => `/api/gigs/getgigs`, []);

  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates after unmount

    const getGigs = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch gigs: ${res.statusText}`);
          if (isMounted)
            setGigs({
              gigs: [
                {
                  _id: "",
                  postedBy: postedBy,
                  bookedBy: postedBy,
                  title: "",
                  secret: "",
                  description: "",
                  phone: "",
                  price: "",
                  category: "",
                  bandCategory: [],
                  bussinesscat: "",
                  location: "",
                  date: new Date(),
                  time: {},
                  isTaken: false,
                  isPending: false,
                  viewCount: [],
                  username: "",
                  updatedAt: new Date(),
                  createdAt: new Date(),
                  bookCount: [],
                  font: "",
                  fontColor: "",
                  backgroundColor: "",
                  logo: "",
                },
              ],
            });
          return;
        }

        const fetchedGigs: Gigs = await res.json();
        console.log(fetchedGigs);
        if (isMounted) setGigs(fetchedGigs);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted)
          setGigs({
            gigs: [
              {
                _id: "",
                postedBy: postedBy,
                bookedBy: postedBy,
                title: "",
                secret: "",
                description: "",
                phone: "",
                price: "",
                category: "",
                bandCategory: [],
                bussinesscat: "",
                location: "",
                date: new Date(),
                time: {},
                isTaken: false,
                isPending: false,
                viewCount: [],
                username: "",
                updatedAt: new Date(),
                createdAt: new Date(),
                bookCount: [],
                font: "",
                fontColor: "",
                backgroundColor: "",
                logo: "",
              },
            ],
          });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getGigs();

    // Cleanup function to avoid setting state after component unmounts
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { loading, gigs };
}

// gigs = gigs?.filter((gig) => {
//   if (gig?.postedBy?.clerkId.includes(id)) {
//     return gigs;
//   }
//   return null;
// });
