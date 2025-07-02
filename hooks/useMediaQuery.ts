// hooks/useMediaQuery.ts
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);

      // Update the state with the current value
      setMatches(media.matches);

      // Create an event listener to update the state when the media query changes
      const listener = () => setMatches(media.matches);

      // Add the listener
      media.addEventListener("change", listener);

      // Remove the listener on cleanup
      return () => media.removeEventListener("change", listener);
    }
  }, [query]);

  return matches;
}
