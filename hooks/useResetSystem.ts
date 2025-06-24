// hooks/useResetSystem.ts
import { toast } from "sonner";
import { useState } from "react";

export const useResetSystem = () => {
  const [isResetting, setIsResetting] = useState(false);

  const resetAllData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/resetgigs-users", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      toast.success(data.message || "Reset successful.");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to reset system."
      );
    } finally {
      setIsResetting(false);
    }
  };

  return { resetAllData, isResetting };
};
