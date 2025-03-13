import React from "react";
interface ProfileModalProps {
  children: React.ReactNode;
}
const SlideUpModal = ({ children }: ProfileModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center">
      {children}
    </div>
  );
};

export default SlideUpModal;
