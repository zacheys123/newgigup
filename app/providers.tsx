"use client";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorTextOnPrimaryBackground: "#ffffff", // Ensures button text is white
          colorBackground: "#111827",
          colorInputBackground: "#1f2937",
        },
        elements: {
          formButtonPrimary: `
            bg-indigo-600 
            hover:bg-indigo-700 
            text-white
            py-3
            w-full
            transition-colors
          `,
          // Add these to ensure all buttons are visible
          socialButtonsBlockButton: `
            bg-gray-800 
            text-gray-200 
            border-gray-700
            hover:bg-gray-700sss
          `,
          footerActionLink: `
            text-indigo-400 
            hover:text-indigo-300
          `,
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
