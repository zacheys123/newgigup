// app/admin/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavBar";
import { UserProps } from "@/types/userinterfaces";
import { Spinner } from "@/components/admin/Spinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [dbUser, setDbUser] = useState<UserProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/verify-admin");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to verify admin status");
        }

        setDbUser(data.user);
      } catch (error) {
        console.error("Admin verification failed:", error);
        signOut(() => router.push("/sign-in"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, router, signOut]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const res = await fetch("/api/admin/verify-admin");
      const { isAdmin } = await res.json();
      setIsAdmin(isAdmin);
    };
    checkAdmin();
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }
  if (!isAdmin) return null;

  if (!dbUser?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            {`You don't have permission to access this page.`}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar adminRole={dbUser.adminRole} />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
