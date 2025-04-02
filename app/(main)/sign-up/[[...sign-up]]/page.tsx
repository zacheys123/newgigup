import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className=" h-screen bg-black w-full overflow-hidden">
      <div className="flex justify-center items-center  h-full w-full shadow-slate-700 shadow-xl">
        {" "}
        <SignUp />;
      </div>
    </div>
  );
}
