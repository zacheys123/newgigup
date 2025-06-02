"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";
import { useSocketContext } from "@/app/Context/socket";
import { PageProps } from "./UserDetailPage";

export function BanUserButton({ user }: PageProps) {
  const { sendBanUpdate } = useSocketContext();
  const [isLoading, setIsLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState<"permanent" | "temporary">(
    "permanent"
  );
  const [banDays, setBanDays] = useState(7);
  const router = useRouter();

  const handleAction = async (action: "ban" | "unban") => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user._id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "ban" ? banReason : undefined,
          duration:
            action === "ban" && banDuration === "temporary"
              ? banDays
              : undefined,
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      // Send realtime ban update
      sendBanUpdate(
        user._id,
        action === "ban",
        action === "ban" ? banReason : undefined,
        action === "ban" && banDuration === "temporary" ? banDays : undefined
      );

      toast.success(
        action === "ban"
          ? `User has been ${
              banDuration === "permanent"
                ? "permanently banned"
                : `banned for ${banDays} days`
            }`
          : "User has been unbanned"
      );

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {user.isBanned ? (
        <div className="space-y-4 p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="space-y-2">
            <h3 className="font-medium">Ban Details</h3>
            {user.banReason && (
              <p className="text-sm">
                <span className="font-semibold">Reason:</span> {user.banReason}
              </p>
            )}
            {user.banReference && (
              <p className="text-sm">
                <span className="font-semibold">Reference:</span>{" "}
                {user.banReference}
              </p>
            )}
            {user?.bannedAt && (
              <p className="text-sm">
                <span className="font-semibold">Banned on:</span>{" "}
                {format(new Date(user.bannedAt), "PPpp")}
              </p>
            )}
            {user.banExpiresAt && (
              <p className="text-sm">
                <span className="font-semibold">Expires on:</span>{" "}
                {format(new Date(user.banExpiresAt), "PPpp")}
              </p>
            )}
          </div>

          <button
            onClick={() => handleAction("unban")}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-70 transition-colors"
          >
            {isLoading ? "Processing..." : "Unban User"}
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ban Reason
              </label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                placeholder="Enter reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 ">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ban Duration
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center bg-red-400 text-white  p-2 rounded-xl">
                  <input
                    type="radio"
                    className="form-radio"
                    name="banDuration"
                    checked={banDuration === "permanent"}
                    onChange={() => setBanDuration("permanent")}
                  />
                  <span className="ml-2">Permanent</span>
                </label>
                <label className="inline-flex items-center  bg-neutral-300 p-2 rounded-xl">
                  <input
                    type="radio"
                    className="form-radio"
                    name="banDuration"
                    checked={banDuration === "temporary"}
                    onChange={() => setBanDuration("temporary")}
                  />
                  <span className="ml-2">Temporary</span>
                </label>
              </div>

              {banDuration === "temporary" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (days)
                  </label>
                  <select
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                    value={banDays}
                    onChange={(e) => setBanDays(Number(e.target.value))}
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Note:</strong>{" "}
                {`This action will immediately restrict the
                user's access to the platform.`}
                {banDuration === "temporary" &&
                  ` The ban will automatically expire after ${banDays} day${
                    banDays > 1 ? "s" : ""
                  }.`}
              </p>
            </div>

            <button
              onClick={() => handleAction("ban")}
              disabled={isLoading || !banReason.trim()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-70 transition-colors"
            >
              {isLoading
                ? "Banning..."
                : `Ban User ${
                    banDuration === "temporary"
                      ? `for ${banDays} day${banDays > 1 ? "s" : ""}`
                      : "Permanently"
                  }`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
