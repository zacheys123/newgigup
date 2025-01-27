"use client";
import EmailForm from "@/components/user/Email";
import { useRouter } from "next/navigation";
import React from "react";

const ContactPage = () => {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  return (
    <div className=" w-[100vw] h-[86%] bg-slate-900 overflow-y-auto flex justify-center items-center">
      <EmailForm handleClose={handleClose} />
    </div>
  );
};

export default ContactPage;
