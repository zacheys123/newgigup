// src/context/PendingGigsContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface PendingGigsContextType {
  pendingGigsCount: number;
  setPendingGigsCount: (count: number) => void;
  incrementPendingGigs: () => void;
  decrementPendingGigs: () => void;
}

const PendingGigsContext = createContext<PendingGigsContextType | undefined>(
  undefined
);

export function PendingGigsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingGigsCount, setPendingGigsCount] = useState(0);
  const { userId } = useAuth();

  // Fetch initial pending gigs count
  useEffect(() => {
    if (!userId) return;
    if (userId) {
      const fetchInitialPendingCount = async () => {
        try {
          const response = await fetch(
            `/api/gigs/pending-couunt?userId=${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const text = await response.text(); // First get the raw text
          if (!text) {
            throw new Error("Empty response from server");
          }

          const data = JSON.parse(text); // Then parse it manually
          if (data.success) {
            setPendingGigsCount(data.count);
          }
        } catch (error) {
          console.error("Failed to fetch pending gigs count:", error);
        }
      };

      fetchInitialPendingCount();
    }
  }, [userId]);

  const incrementPendingGigs = () => setPendingGigsCount((prev) => prev + 1);
  const decrementPendingGigs = () =>
    setPendingGigsCount((prev) => Math.max(0, prev - 1));

  return (
    <PendingGigsContext.Provider
      value={{
        pendingGigsCount,
        setPendingGigsCount,
        incrementPendingGigs,
        decrementPendingGigs,
      }}
    >
      {children}
    </PendingGigsContext.Provider>
  );
}

export function usePendingGigs() {
  const context = useContext(PendingGigsContext);
  if (context === undefined) {
    throw new Error("usePendingGigs must be used within a PendingGigsProvider");
  }
  return context;
}
