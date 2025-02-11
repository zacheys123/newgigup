"use client";
import CreateGig from "@/components/gig/CreateGig";
import React from "react";

const GigPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-[100vh] w-[95%]  p-4 rounded-xl shadow-lg overflow-hidden  shadow-slate-700">
        <CreateGig />
      </div>
    </div>
  );
};

export default GigPage;
