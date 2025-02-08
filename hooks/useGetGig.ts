"use client";

import useStore from "@/app/zustand/useStore";
import { GigProps } from "@/types/giginterface";
import { postedBy } from "@/utils";
import { useEffect, useMemo, useState } from "react";

// Define the shape of the user object

export function useGetGigs(id: string | null) {
  const { setCurrentGig } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  // Memoize the URL to prevent unnecessary re-renders
  const url = useMemo(() => `/api/gigs/getGig/${id}`, [id]);

  useEffect(() => {
    let isMounted = true; // Guard to prevent state updates after unmount

    const getGig = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          console.error(`Failed to fetch gig: ${res.statusText}`);
          if (isMounted)
            setCurrentGig({
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
            });
          return;
        }
        const fetchedGig: GigProps = await res.json();
        if (isMounted) {
          setCurrentGig(fetchedGig);
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
        if (isMounted)
          setCurrentGig({
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
          });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getGig();

    // Cleanup function to avoid setting state after component unmounts
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { loading };
}
