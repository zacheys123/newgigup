import { SignIn } from "@clerk/nextjs";
import React from "react";

export default async function Page() {
  return (
    <div className=" h-screen bg-black overflow-hidden w-full">
      <div className="flex justify-center items-center h-full w-full shadow-slate-700 shadow-xl">
        <SignIn />;
      </div>
    </div>
  );
}
