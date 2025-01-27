// import { getAuth } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Nav from "../../components/Nav";
import React from "react";

const MainLayout = ({
  contact,

  children,
}: Readonly<{
  children: React.ReactNode;
  contact: React.ReactNode; // Add Chat type here
}>) => {
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
