"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type PaymentStatus = "pending" | "success" | "failed" | "error";

type Payment = {
  _id: string;
  phoneNumber: string;
  amount: number;
  checkoutRequestId: string;
  clerkId: string;
  status: PaymentStatus;
  createdAt: string;
};

export default function M_PesaTransactionsAdmin() {
  const [activeTab, setActiveTab] = useState<PaymentStatus>("pending");
  const [loading, setLoading] = useState(false);

  const [payments, setPayments] = useState<{
    pending: Payment[];
    success: Payment[];
    failed: Payment[];
    error: Payment[];
  }>({
    pending: [],
    success: [],
    failed: [],
    error: [],
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mpesa/payments/${activeTab}`);
      const data = await res.json();
      setPayments((prev) => ({
        ...prev,
        [activeTab]: data[`${activeTab}Payments`] || [],
      }));
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [activeTab]);

  const updatePaymentStatus = async (
    checkoutRequestId: string,
    status: PaymentStatus
  ) => {
    try {
      const res = await fetch("/api/admin/mpesa/payments/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId, status }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Payment status updated");
        fetchPayments();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const renderTable = (list: Payment[]) => {
    if (list.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No transactions in this category.
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-border bg-muted/10 ">
        <div className="overflow-auto max-h-[calc(100vh-250px)] mb-15">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Checkout ID</TableHead>
                <TableHead>Clerk ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.phoneNumber}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    KES {p.amount}
                  </TableCell>
                  <TableCell>{p.checkoutRequestId}</TableCell>
                  <TableCell>{p.clerkId}</TableCell>
                  <TableCell
                    className={clsx("capitalize", {
                      "text-yellow-500": p.status === "pending",
                      "text-green-600": p.status === "success",
                      "text-red-600": p.status === "failed",
                      "text-orange-500": p.status === "error",
                    })}
                  >
                    {p.status}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2 justify-center py-2">
                    {p.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updatePaymentStatus(p.checkoutRequestId, "success")
                          }
                        >
                          Mark Success
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updatePaymentStatus(p.checkoutRequestId, "failed")
                          }
                        >
                          Mark Failed
                        </Button>
                      </>
                    )}
                    {(p.status === "failed" || p.status === "error") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updatePaymentStatus(p.checkoutRequestId, "pending")
                        }
                      >
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 py-8 bg-background text-foreground rounded-md shadow-xl space-y-6 max-w-screen-xl mx-auto h-[calc(100vh-100px)] overflow-y-auto">
      <header className="space-y-1 sticky top-0 bg-background pb-4 z-10">
        <h2 className="text-2xl font-bold tracking-tight">
          M-Pesa Transaction Management
        </h2>
        <p className="text-muted-foreground text-sm">
          Review and manage M-Pesa payments by status. You can manually resolve
          issues below.
        </p>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as PaymentStatus)}
        className="space-y-4"
      >
        <TabsList className="w-full flex justify-start gap-2  p-2 rounded-lg sticky top-[120px] bg-background z-10">
          {["pending", "success", "failed", "error"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {["pending", "success", "failed", "error"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            ) : (
              renderTable(payments[tab as PaymentStatus])
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
