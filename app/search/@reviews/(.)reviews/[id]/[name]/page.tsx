"use client";
import FriendReviewComponent from "@/components/friend/FriendReviewComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
const ReviewPage = () => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="w-[70%] mx-auto inset-0 flex items-center justify-center bg-black bg-opacity-30 ">
      <Dialog
        open={open}
        onOpenChange={handleClose} // use onOpenChange to handle closing the dialog
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: "lightgray" }}>Reviews</DialogTitle>
          </DialogHeader>
          <FriendReviewComponent rev={false} />
        </DialogContent>
      </Dialog>{" "}
    </div>
  );
};

export default ReviewPage;
