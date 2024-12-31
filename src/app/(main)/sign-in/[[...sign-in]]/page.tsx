import { SignIn } from "@clerk/nextjs";
import React from "react";

export default async function Page({ searchParams }: any) {
  return (
    <div className=" h-[calc(100vh-60px)] bg-black overflow-hidden w-full">
      <div className="flex justify-center items-center h-full w-full shadow-slate-700 shadow-xl">
        <SignIn />;
      </div>
    </div>
  );
}
