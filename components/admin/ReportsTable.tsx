"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { ReportsTableProps } from "@/types/reports";
import { PageProps } from "@/types/admininterfaces";
import { BanUserButton } from "./BanButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Flag,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ReportsTable({
  reports: initialReports,
}: ReportsTableProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<PageProps | null>(null);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [reports, setReports] = useState(initialReports);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [userReportsModal, setUserReportsModal] = useState({
    open: false,
    userId: "",
    reports: [] as typeof initialReports,
  });

  useEffect(() => {
    // Simulate loading initial data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/reports/latest", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to refresh reports");
      }

      const data = await response.json();
      setReports(data.reports);
      toast.success("Reports refreshed successfully");
    } catch (error) {
      console.error("Error refreshing reports:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to refresh reports"
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Reports data:", reports);
  }, [reports]);

  // Auto-refresh every 5 minutes (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const viewAllReports = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user reports");

      const userReports = await response.json();
      setUserReportsModal({
        open: true,
        userId,
        reports: userReports,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load user reports"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        <span className="ml-4">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Refresh Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage and review user-reported incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/reports/history")}
          >
            View History
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only sm:not-sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Loading state during refresh */}
      {isRefreshing && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span className="title">Loading new reports...</span>
        </div>
      )}

      {/* Empty State */}
      {!isRefreshing && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
          <Flag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold tracking-tight">
            No Reports Found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            When users submit reports, they will appear here for your review.
          </p>
          <Button
            variant="ghost"
            className="mt-6 gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Check for New Reports
          </Button>
        </div>
      )}

      {/* Mobile/Tablet View - Card Layout */}
      {!isRefreshing && reports.length > 0 && (
        <div className="lg:hidden space-y-4">
          {reports.map((report) => (
            <Card
              key={report._id.toString()}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-muted/50 p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {report.reportedUser.firstname}{" "}
                        {report.reportedUser.lastname}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {report.reportedUser.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      report.status === "resolved"
                        ? "success"
                        : report.status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Flag className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Report Reason</p>
                    <p className="text-muted-foreground">{report.reason}</p>
                  </div>
                </div>

                {report.additionalInfo && (
                  <div className="text-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Additional Details</p>
                        <p
                          className={`text-muted-foreground ${
                            expandedReport === report._id ? "" : "line-clamp-2"
                          }`}
                        >
                          {report.additionalInfo}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs gap-1"
                          onClick={() => toggleExpand(report._id)}
                        >
                          {expandedReport === report._id ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              Show more
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reported by</p>
                      <p className="text-muted-foreground">
                        {report.reportedBy.firstname}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date Reported</p>
                      <time
                        dateTime={new Date(report.createdAt).toISOString()}
                        className="text-muted-foreground"
                      >
                        {formatDate(report.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary h-auto p-0"
                    onClick={() =>
                      viewAllReports(report.reportedUser._id as string)
                    }
                  >
                    View all reports for this user
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end p-4 border-t">
                <Button
                  variant={
                    report.reportedUser.isBanned ? "outline" : "destructive"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedUser({
                      ...report.reportedUser,
                      _id: report.reportedUser._id as string,
                      firstname: report.reportedUser.firstname,
                      lastname: report.reportedUser.lastname || "",
                      email: report.reportedUser.email,
                      isBanned: report.reportedUser.isBanned || false,
                      banReason: report.reportedUser.banReason || "",
                      banReference: report.reportedUser.banReference || "",
                      bannedAt: report.reportedUser.bannedAt
                        ? new Date(report.reportedUser.bannedAt)
                        : undefined,
                      banExpiresAt: report.reportedUser.banExpiresAt
                        ? new Date(report.reportedUser.banExpiresAt)
                        : undefined,
                    })
                  }
                >
                  {report.reportedUser.isBanned ? "Banned" : "Ban User"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Desktop View - Table Layout */}
      {!isRefreshing && reports.length > 0 && (
        <div className="hidden lg:block">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[220px]">Reported User</TableHead>
                  <TableHead className="w-[220px]">Reported By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Additional Info</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow
                    key={report._id.toString()}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {report.reportedUser.firstname}{" "}
                            {report.reportedUser.lastname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {report.reportedUser.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {report.reportedBy.firstname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {report.reportedBy.email}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="line-clamp-2">{report.reason}</div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {report.additionalInfo ? (
                        <div className="line-clamp-2">
                          {report.additionalInfo}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "resolved"
                            ? "success"
                            : report.status === "pending"
                            ? "warning"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <time
                        dateTime={new Date(report.createdAt).toISOString()}
                        className="text-sm"
                      >
                        {formatDate(report.createdAt)}
                      </time>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            viewAllReports(report.reportedUser._id as string)
                          }
                        >
                          View All
                        </Button>
                        <Button
                          variant={
                            report.reportedUser.isBanned
                              ? "outline"
                              : "destructive"
                          }
                          size="sm"
                          onClick={() =>
                            setSelectedUser({
                              ...report.reportedUser,
                              _id: report.reportedUser._id as string,
                              firstname: report.reportedUser.firstname,
                              lastname: report.reportedUser.lastname || "",
                              email: report.reportedUser.email,
                              isBanned: report.reportedUser.isBanned || false,
                              banReason: report.reportedUser.banReason || "",
                              banReference:
                                report.reportedUser.banReference || "",
                              bannedAt: report.reportedUser.bannedAt || null,
                              banExpiresAt:
                                report.reportedUser.banExpiresAt || null,
                            })
                          }
                        >
                          {report.reportedUser.isBanned ? "Banned" : "Ban"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Ban User Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedUser?.isBanned ? (
                <>
                  <span className="text-green-600">Unban</span> User
                </>
              ) : (
                <>
                  <span className="text-red-600">Ban</span> User
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <BanUserButton user={selectedUser} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* All Reports Dialog */}
      <Dialog
        open={userReportsModal.open}
        onOpenChange={(open) =>
          setUserReportsModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              All Reports for{" "}
              {userReportsModal.reports[0]?.reportedUser.firstname}
            </DialogTitle>
            <DialogDescription>
              Total reports: {userReportsModal.reports.length}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {userReportsModal.reports.map((report) => (
              <Card key={report._id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {formatDate(report.createdAt)}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Status:{" "}
                        <Badge
                          variant={
                            report.status === "resolved"
                              ? "success"
                              : report.status === "pending"
                              ? "warning"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {report.status}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      Reported by: {report.reportedBy.firstname}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div>
                    <p className="font-medium text-sm">Reason:</p>
                    <p className="text-sm">{report.reason}</p>
                  </div>
                  {report.additionalInfo && (
                    <div>
                      <p className="font-medium text-sm">Details:</p>
                      <p className="text-sm text-muted-foreground">
                        {report.additionalInfo}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
