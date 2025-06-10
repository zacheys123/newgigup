// hooks/useBannedRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useBannedRedirect = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    // Check LocalStorage first for quick client-side check
    const isBannedLocal = localStorage.getItem("isBanned") === "true";

    // If either server or client indicates banned status
    if (
      (user?.user?.isBanned || isBannedLocal) &&
      !window.location.pathname.startsWith("/banned")
    ) {
      // Update LocalStorage to persist the banned state
      localStorage.setItem("isBanned", "true");
      router.push("/banned");
    } else if (!user?.isBanned && isBannedLocal) {
      // Clear if no longer banned
      localStorage.removeItem("isBanned");
    }
  }, [user, router]);
};
