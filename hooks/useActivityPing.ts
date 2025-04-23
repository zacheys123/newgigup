// hooks/useActivityPing.ts
import { useEffect } from "react";

const useActivityPing = (isActive = true, id: string | null) => {
  useEffect(() => {
    if (!isActive) return;

    const pingInterval = setInterval(() => {
      fetch(`/api/user/last-active?id=${id}`, {
        method: "PUT",
        credentials: "include",
      }).catch(console.error);
    }, 30000); // Ping every 30 seconds

    // Initial ping
    fetch(`/api/user/last-active?id=${id}`, {
      method: "PUT",
      credentials: "include",
    }).catch(console.error);

    return () => clearInterval(pingInterval);
  }, [isActive, id]);
};

export default useActivityPing;
