"use client";
import CreateGig from "@/components/gig/CreateGig";
import React from "react";

const GigPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {" "}
        {/* Changed this line */}
        <CreateGig />
      </div>
    </div>
  );
};

export default GigPage;
