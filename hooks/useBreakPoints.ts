// hooks/useBreakpoints.ts
"use client";

import { BREAKPOINTS } from "@/constants";
import { useMediaQuery } from "./useMediaQuery";

export function useBreakpoints() {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET);
  const isDesktop = useMediaQuery(BREAKPOINTS.DESKTOP);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
}
