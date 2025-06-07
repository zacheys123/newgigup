"use client";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavBar";
import { Spinner } from "@/components/admin/Spinner";
import { AdminNavbarProps } from "@/types/admininterfaces";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [dbUser, setDbUser] = useState<AdminNavbarProps>();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/verify-admin");
        const { dbUser } = await response.json();

        if (!response.ok) {
          throw new Error(dbUser.message || "Failed to verify admin status");
        }

        setDbUser(dbUser);
      } catch (error) {
        console.error("Admin verification failed:", error);
        signOut(() => router.push("/sign-in"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, router, signOut]);

  useEffect(() => {
    if (dbUser?.isAdmin) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dbUser]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!dbUser?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            {`You don't have permission to access this page.`}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 rounded transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      <AdminNavbar user={dbUser} />

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div
              className={cn(
                "rounded-xl p-6 md:p-8 shadow-2xl text-center max-w-md md:max-w-2xl w-full",
                "bg-gradient-to-br from-card via-card/80 to-card",
                "border border-border"
              )}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                Welcome, System Admin
              </h1>

              <div className="text-xl md:text-2xl font-semibold mb-6 h-10 md:h-12 flex justify-center items-center text-secondary-foreground">
                <div className="text-center w-full">
                  <TypeAnimation
                    sequence={[
                      dbUser.firstname || "Administrator",
                      1000,
                      "Welcome back!",
                      1000,
                      "Ready to manage?",
                      1000,
                    ]}
                    wrapper="span"
                    speed={50}
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      width: "100%",
                    }}
                    repeat={Infinity}
                  />
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
                className="inline-block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 md:h-16 md:w-16 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main
        className={cn(
          "flex-1 transition-all duration-500",
          showWelcome ? "opacity-30 blur-sm" : "opacity-100 blur-none"
        )}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
