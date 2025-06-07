"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { format } from "date-fns";
import Link from "next/link";

export default function BannedPage() {
  const { user: myuser } = useCurrentUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const user = myuser?.user;

  // State for appeal form
  const [isAppealFormOpen, setIsAppealFormOpen] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Set client flag and check localStorage on mount
  useEffect(() => {
    setIsClient(true);
    // Always set banned status if user is banned
    if (user?.isBanned) {
      localStorage.setItem("isBanned", "true");
      localStorage.setItem(
        "banData",
        JSON.stringify({
          reason: user.banReason,
          reference: user.banReference,
          expiresAt: user.banExpiresAt,
        })
      );
    }
  }, [user]);

  // Enhanced redirect and security logic
  useEffect(() => {
    if (!isClient) return;

    const localBan = localStorage.getItem("isBanned") === "true";

    // Only redirect if both server and client agree user is not banned
    if (user && !user.isBanned && !localBan) {
      router.push("/");
      return;
    }

    // If server says not banned but localStorage says banned, wait for confirmation
    if (user && !user.isBanned && localBan) {
      // Optionally add a delay here to confirm with server
      const timer = setTimeout(() => {
        localStorage.removeItem("isBanned");
        localStorage.removeItem("banData");
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, router, isClient]);

  // Prevent going back and force refresh if somehow bypassed
  useEffect(() => {
    if (!isClient) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (user?.isBanned || localStorage.getItem("isBanned") === "true") {
        e.preventDefault();
        return (e.returnValue =
          "You are currently banned. Any unsaved appeal data will be lost.");
      }
    };

    const handlePopState = () => {
      if (user?.isBanned || localStorage.getItem("isBanned") === "true") {
        window.history.pushState(null, "", "/banned");
        window.location.reload();
      }
    };

    window.history.pushState(null, "", "/banned");
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [user, isClient]);

  const handleForceLogout = async () => {
    try {
      localStorage.removeItem("isBanned");
      localStorage.removeItem("banData");
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const appealData = {
        userId: user._id,
        clerkId: user.clerkId,
        email: user.email,
        banReference: user.banReference || "N/A",
        message: appealMessage,
        user: user._id,
        clientData: {
          ip: window.location.hostname,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch("/api/ban/appeals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appeal-Signature": await generateAppealSignature(appealData),
        },
        body: JSON.stringify(appealData),
      }).then((res) => res.json());

      if (!response.success) {
        throw new Error(response.error || "Failed to submit appeal");
      }

      setSubmitSuccess(true);
      setAppealMessage("");
      localStorage.setItem("lastAppealSubmission", new Date().toISOString());

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsAppealFormOpen(false);
      }, 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setSubmitError(
        errorMessage.startsWith("Unexpected")
          ? "Retry sending an appeal"
          : "Try later"
      );
      console.error("Appeal submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a simple signature for appeal verification
  // Generate a secure signature for appeal verification
  const generateAppealSignature = async (data: {
    userId: string;
    clerkId: string;
    email: string;
    banReference: string;
    message: string;
    clientData: {
      ip: string;
      userAgent: string;
      timestamp: string;
    };
  }): Promise<string> => {
    try {
      // Validate required environment variable
      if (!process.env.NEXT_PUBLIC_APPEAL_SECRET) {
        throw new Error("Appeal secret key not configured");
      }

      const encoder = new TextEncoder();

      // Create a salt to prevent rainbow table attacks
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Prepare the data to be signed (data + salt)
      const dataToSign = {
        ...data,
        salt: Array.from(salt)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      };

      // Create HMAC key
      const secretKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(process.env.NEXT_PUBLIC_APPEAL_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      // Generate signature
      const signature = await crypto.subtle.sign(
        "HMAC",
        secretKey,
        encoder.encode(JSON.stringify(dataToSign))
      );

      // Convert to hex string
      const signatureArray = Array.from(new Uint8Array(signature));
      const signatureHex = signatureArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Combine salt and signature for verification
      return `${Array.from(salt)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")}:${signatureHex}`;
    } catch (error) {
      console.error("Signature generation failed:", error);
      throw new Error("Failed to generate security signature");
    }
  };
  // Show loading state if no user data yet but localStorage says banned
  if (!isClient || (!user && localStorage.getItem("isBanned") === "true")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">
            Verifying your account status...
          </h2>
        </div>
      </div>
    );
  }

  // If not banned according to both server and client
  if (!user?.isBanned && localStorage.getItem("isBanned") !== "true") {
    return null; // Will redirect
  }

  // Get ban data from either user or localStorage
  const banData = user?.isBanned
    ? {
        reason: user.banReason,
        reference: user.banReference,
        expiresAt: user.banExpiresAt,
      }
    : JSON.parse(localStorage.getItem("banData") || "{}");
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header with severity indicator */}
        <div className="bg-red-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Account Restricted</h1>
            <span className="px-3 py-1 bg-red-800 rounded-full text-xs font-semibold">
              SERIOUS VIOLATION
            </span>
          </div>
          {banData.reason && (
            <p className="mt-2 text-red-100 text-sm">
              Reason: {banData.reason}
            </p>
          )}
        </div>

        {/* Main content */}
        <div className="p-6 space-y-4">
          <div className="prose dark:prose-invert">
            <p>
              Your account has been suspended due to violations of our community
              guidelines and terms of service.
            </p>

            {user?.banExpiresAt ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
                <p className="font-medium">
                  This restriction is temporary and will be automatically lifted
                  on:{" "}
                  <span className="font-bold">
                    {format(new Date(user.banExpiresAt), "MMMM d, yyyy")}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-red-600 dark:text-red-400 font-medium">
                This restriction is {user?.banReference || "temporary"}.
              </p>
            )}
          </div>

          {/* Ban details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h2 className="font-medium mb-3">Ban Details:</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">🕒</span>
                <span>
                  <strong>Date Issued:</strong>{" "}
                  {user?.bannedAt
                    ? format(new Date(user.bannedAt), "MMMM d, yyyy")
                    : "Unknown"}
                </span>
              </li>
              {user?.banReason && (
                <li className="flex items-start">
                  <span className="mr-2">📜</span>
                  <span>
                    <strong>Reason:</strong> {user.banReason}
                  </span>
                </li>
              )}
              {user?.banReference && (
                <li className="flex items-start">
                  <span className="mr-2">🔗</span>
                  <span>
                    <strong>Case Reference:</strong> {user.banReference}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Enhanced Appeal Process */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Appeal Process:</h3>

            <div className="mb-4">
              <button
                onClick={() => setIsAppealFormOpen(!isAppealFormOpen)}
                className="w-full flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span className="font-medium">
                  {isAppealFormOpen ? "Hide Appeal Form" : "Submit an Appeal"}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isAppealFormOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isAppealFormOpen && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  {submitSuccess ? (
                    <div className="p-3 mb-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 rounded-md">
                      {`Your appeal has been submitted successfully. We'll review
                      it and contact you via email.`}
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleAppealSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="appealMessage"
                            className="block text-sm font-medium mb-1"
                          >
                            Your Appeal Message *
                          </label>
                          <textarea
                            id="appealMessage"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Please explain why you believe this ban should be lifted..."
                            value={appealMessage}
                            onChange={(e) => setAppealMessage(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            By submitting this appeal, you agree to our terms
                            and acknowledge that:
                          </p>
                          <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc pl-5 mt-1 space-y-1">
                            <li>
                              False information may result in permanent ban
                            </li>
                            <li>
                              Response time is typically 5-7 business days
                            </li>
                            <li>Duplicate appeals may delay the process</li>
                          </ul>
                        </div>

                        {submitError && (
                          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-300 text-sm rounded-md">
                            {submitError}
                          </div>
                        )}

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsAppealFormOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                            disabled={isSubmitting || !appealMessage.trim()}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Appeal"}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Alternative Contact Methods:</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="mr-3 mt-1">✉️</span>
                  <Link href="/contact">
                    <p className="font-medium">Email Appeal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send to:{" "}
                      <span className="font-mono">appeals@yourdomain.com</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Include your account email and case reference if available
                    </p>
                  </Link>
                </div>

                <div className="flex items-start">
                  <span className="mr-3 mt-1">📞</span>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Call:{" "}
                      <span className="font-semibold">+254 708 175 949</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Available 9am-5pm EST, Monday to Friday
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-md">
              <p className="text-sm">
                <strong>Note:</strong> Submitting multiple appeals will not
                speed up the process. Our team reviews appeals in the order they
                are received.
              </p>
            </div>

            <button
              onClick={handleForceLogout}
              className="w-full mt-4 p-3 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Your Company. All rights reserved. |{" "}
            <a
              href="/terms"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
