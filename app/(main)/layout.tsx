"use client";
import { Toaster } from "sonner";
import Nav from "../../components/Nav";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const MainLayout = ({
  contact,
  children,
}: Readonly<{
  children: React.ReactNode;
  contact: React.ReactNode;
}>) => {
  const { user: myuser } = useCurrentUser();
  const { user } = useUser();
  const transformedUser = useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
      username: user.username ?? undefined,
      emailAddresses: user.emailAddresses,
      phoneNumbers: user.phoneNumbers,
    };
  }, [user]);
  useEffect(() => {
    if (!user || !myuser) return;

    // Transform the user data as needed
    if (
      myuser?.isMusician === true ||
      (myuser?.isClient === true && myuser?.city && myuser?.talentbio)
    ) {
      // Transform the user data as needed

      // Send to your backend API
      fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transformedUser }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to register user");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
    }
  }, [user]); // This effect runs when the user object changes

  return (
    <div className="h-screen overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          className: "toast",
        }}
      />
      <Nav />
      {contact}
      {children}
    </div>
  );
};

export default MainLayout;
