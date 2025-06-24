"use client";
import { useResetSystem } from "@/hooks/useResetSystem";
import { Button } from "@/components/ui/button";

const AdminResetControl = () => {
  const { resetAllData, isResetting } = useResetSystem();

  return (
    <div className="p-4 border rounded-xl bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
      <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
        ⚠️ Danger Zone
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        This will reset all gigs and clear user references. This action cannot
        be undone.
      </p>
      <Button
        variant="destructive"
        disabled={isResetting}
        onClick={resetAllData}
        className="w-full"
      >
        {isResetting ? "Resetting..." : "Reset All Gigs & Users"}
      </Button>
    </div>
  );
};

export default AdminResetControl;
