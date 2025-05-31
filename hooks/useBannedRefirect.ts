// hooks/useBannedRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useBannedRedirect = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (user?.user?.isBanned && window.location.pathname !== "/banned") {
      router.push("/banned");
    }
  }, [user, router]);
};
