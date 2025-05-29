// app/auth/sign-out/confirm/page.tsx
"use client"; // Add this since we're using interactivity

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConfirmSignOutPage() {
  const router = useRouter();

  // Optional: Auto-trigger sign out after showing confirmation
  useEffect(() => {
    const timer = setTimeout(() => {
      // You could automatically redirect to sign out here if you want
      // router.push('/auth/sign-out/action');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Confirm Sign Out</h1>
        <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>

        <div className="flex gap-4 justify-center">
          <SignOutButton
            redirectUrl="/" // This replaces signOutCallback
          >
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Yes, Sign Out
            </button>
          </SignOutButton>

          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
