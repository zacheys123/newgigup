"use client";
import EmailForm from "@/components/user/Email";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
const ContactPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const handleClose = () => {
    router.back();
    setOpen(false);
  };
  return (
    <div className="w-[100vw] h-[86%] bg-slate-900 overflow-y-auto flex justify-center items-center">
      <Dialog
        open={open}
        onOpenChange={handleClose} // use onOpenChange to handle closing the dialog
      >
        <DialogContent className="border-0 ">
          <DialogHeader>
            <DialogTitle style={{ color: "lightgray" }}>Reviews</DialogTitle>
          </DialogHeader>
          <EmailForm handleClose={handleClose} />
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
};

export default ContactPage;
