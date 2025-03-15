"use client";
import useStore from "@/app/zustand/useStore";
import React from "react";
interface ProfileModalProps {
  children: React.ReactNode;
}
const SlideUpModal = ({ children }: ProfileModalProps) => {
  const { setIsProfileModalOpen, setReviewModalOpen, setRefferenceModalOpen } =
    useStore();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center"
      onClick={() => {
        setIsProfileModalOpen(false);
        setReviewModalOpen(false);
        setRefferenceModalOpen(false);
      }}
    >
      {children}
    </div>
  );
};

export default SlideUpModal;
