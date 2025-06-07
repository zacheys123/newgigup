// hooks/useInitialBanCheck.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useInitialBanCheck = () => {
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const isBanned = localStorage.getItem("isBanned") === "true";
      if (isBanned && !window.location.pathname.startsWith("/banned")) {
        router.push("/banned");
      }
    }
  }, [router]);
};
