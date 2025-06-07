"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ban, Search, RefreshCw, LogOut, ChevronRight } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { BannedUserTableItem } from "@/types/appeal";
import { columns } from "@/components/admin/colums";
import { DataTable } from "@/components/admin/DataTable";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useSWR from "swr";

const BannedUsersPage = () => {
  // State
  const [users, setUsers] = useState<BannedUserTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUnbanning, setIsUnbanning] = useState(false);

  const { signOut } = useClerk();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user?.username
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        user?.email
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        user?.banReference
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [users, debouncedSearchTerm]);

  // Debounce search term
  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(await res.text());
      return res.json();
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Fetch error:", error);
        toast.error("Failed to load banned users", {
          description: "Please check your connection and try again",
        });
      }
      throw error;
    }
  };

  const {
    data,
    isLoading: loading,
    mutate,
  } = useSWR("/api/ban/getusers", fetcher, {
    onSuccess: (myusers) => {
      setUsers(myusers);
    },
  });
  console.log(data);
  // Handle unbanning
  const handleUnbanSelectedUsers = useCallback(async () => {
    if (selectedUsers.length === 0) return;

    setIsUnbanning(true);
    try {
      const response = await fetch("/api/ban/unban-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();

      if (!result.ok) {
        toast.error("Unban Failed", {
          description: result.message || "Error Please try again",
        });
      }
      toast.success("Users Unbanned", {
        description: `${selectedUsers.length} accounts restored`,
        action: {
          label: "Refresh",
          onClick: mutate,
        },
      });

      mutate(
        (prevUsers: BannedUserTableItem[]) =>
          prevUsers.filter((u) => !selectedUsers.includes(u._id)),
        false
      );
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Unban Failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUnbanning(false);
    }
  }, [selectedUsers]);

  return (
    <div className="container mx-auto px-4 py-4 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full shadow-lg bg-gradient-to-br from-red-500 to-amber-500 dark:from-red-600 dark:to-amber-600">
            <Ban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Banned Users
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Manage restricted accounts with precision
            </p>
          </div>
          <div className="px-3 py-1 rounded-full shadow-inner bg-gradient-to-r from-red-100 to-amber-50 text-red-600 dark:bg-gradient-to-r dark:from-red-900/30 dark:to-amber-900/20 dark:text-amber-200">
            <span className="font-medium">{users.length} Banned</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="gap-2 border-2 border-gray-200 hover:border-red-300 bg-white text-gray-800 dark:border-gray-700 dark:hover:border-red-700 dark:bg-gray-800 dark:text-white"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 h-11 rounded-xl border-2 focus:ring-0 transition-all border-gray-200 focus:border-red-300 bg-white text-gray-800 dark:border-gray-700 dark:focus:border-red-700 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => mutate()}
            disabled={loading}
            className="gap-2 border-2 border-gray-200 hover:border-red-300 bg-white text-gray-800 dark:border-gray-700 dark:hover:border-red-700 dark:bg-gray-800 dark:text-white"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>

          <AnimatePresence>
            {selectedUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  variant="destructive"
                  onClick={handleUnbanSelectedUsers}
                  disabled={isUnbanning}
                  className="gap-2 shadow-lg bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600"
                >
                  {isUnbanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Unban Selected
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                        {selectedUsers.length}
                      </span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table Section */}
      <div
        className={cn(
          "rounded-2xl border shadow-sm overflow-hidden",
          "bg-white/80 backdrop-blur-sm dark:bg-gray-900/90",
          "border-gray-200 dark:border-gray-700",
          "transition-colors duration-200 ease-in-out"
        )}
      >
        {" "}
        <DataTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
          onRowSelection={setSelectedUsers}
        />
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center">
        <AnimatePresence>
          {selectedUsers.length > 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="font-medium text-red-600 dark:text-amber-300">
                {selectedUsers.length}
              </span>{" "}
              user(s) selected
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
              Select rows to perform bulk actions
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BannedUsersPage;
