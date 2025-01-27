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
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
const ContactPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();
  const handleClose = () => {
    router.back();
    setOpen(false);
  };
  return (
    <div className=" w-[100vw] h-[86%] bg-slate-900 overflow-y-auto">
      <Dialog
        open={open}
        onOpenChange={handleClose} // use onOpenChange to handle closing the dialog
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "lightgray" }}>Reviews</DialogTitle>
          </DialogHeader>
          <EmailForm />
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ContactPage;
