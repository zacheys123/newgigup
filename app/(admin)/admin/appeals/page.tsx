"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  RefreshCw,
  Check,
  X,
  ChevronRight,
  LogOut,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { AppealTableItem, AppealStatus } from "@/types/appeal";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "@/components/admin/AppealsColumn";
import { useClerk } from "@clerk/nextjs";
import useSWR, { useSWRConfig } from "swr";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";

const AppealsPage = () => {
  const { signOut } = useClerk();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppeals, setSelectedAppeals] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  // SWR data fetching
  const { data: appeals = [], isLoading } = useSWR<AppealTableItem[]>(
    "/api/ban/appeals/getandupdate",
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  // Filtered appeals
  const filteredAppeals = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return appeals.filter((appeal) => {
      const username = appeal.user?.username?.toLowerCase() || "";
      const email = appeal.user?.email?.toLowerCase() || "";
      return (
        username.includes(term) ||
        email.includes(term) ||
        appeal.message.toLowerCase().includes(term) ||
        appeal.status.toLowerCase().includes(term)
      );
    });
  }, [appeals, searchTerm]);

  // Status update handler
  const updateAppealStatus = async (id: string, status: AppealStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch("/api/ban/appeals/getandupdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appealId: id, status }),
      });

      if (!response.ok) throw new Error("Update failed");

      mutate(
        "/api/ban/appeals/getandupdate",
        (current: AppealTableItem[] | undefined) =>
          current?.map((a) => (a._id === id ? { ...a, status } : a)),
        false
      );

      toast.success(`Appeal ${status} successfully`);
    } catch (error) {
      toast.error(
        `Failed to update: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const { mutate } = useSWRConfig();
  const [isProcessing, setIsProcessing] = useState<boolean>();

  // Bulk actions
  const handleBulkAction = async (status: AppealStatus) => {
    if (selectedAppeals.length === 0) return;
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedAppeals.map((id) => updateAppealStatus(id, status))
      );
      setSelectedAppeals([]);
      toast.success(`Bulk ${status} completed`);
    } catch (error) {
      console.error(error);
      toast.error(`Bulk ${status} failed`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg shadow-md bg-primary/10 text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Appeals Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review and process user ban appeals
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {appeals.length} Total
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => signOut()}
              className="gap-2 hidden md:flex"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Search and Actions - Fixed */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 pb-4 bg-background">
            <div className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appeals..."
                  className="pl-10 pr-4 py-2 h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-background border-input w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <AnimatePresence>
                {selectedAppeals.length > 0 && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleBulkAction("approved")}
                      disabled={isProcessing}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Approve All</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleBulkAction("rejected")}
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Reject All</span>
                    </Button>
                  </>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                onClick={() => mutate("/api/ban/appeals/getandupdate")}
                disabled={isLoading || updatingId !== null || isProcessing}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          {/* Table Section */}
          <div className="rounded-xl border shadow-sm bg-card text-card-foreground border-border">
            <DataTable
              columns={columns}
              data={filteredAppeals}
              loading={isLoading}
              onRowSelection={setSelectedAppeals}
              meta={{
                onStatusChange: updateAppealStatus,
                updatingId,
                darkMode: resolvedTheme === "dark",
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="mt-4 text-sm text-muted-foreground pb-8">
            {selectedAppeals.length > 0 ? (
              <p>{selectedAppeals.length} appeal(s) selected</p>
            ) : (
              <p className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4" />
                Select rows to perform bulk actions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealsPage;
