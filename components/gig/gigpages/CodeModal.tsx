"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // adjust if needed
import { toast } from "sonner"; // or your toast system

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => Promise<void>;
}

const CodeModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const [clientCode, setClientCode] = useState("");

  // Reset code every time modal opens
  useEffect(() => {
    if (isOpen) setClientCode("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!clientCode.trim()) {
      toast.error("Please enter the confirmation code.");
      return;
    }

    try {
      await onConfirm(clientCode);
      onClose();
    } catch (err) {
      console.error("Error confirming payment:", err);
      toast.error("Failed to confirm payment.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg sm:max-w-[400px] max-w-[370px] w-full">
        <h3 className="text-lg font-medium mb-4">Confirm Payment</h3>
        <p className="mb-2 text-sm text-gray-700">
          Enter the last 3 letters/digits of the payment confirmation message.
          Payment will be marked complete only if both codes match.
        </p>

        <Input
          type="text"
          placeholder="Enter code"
          autoFocus
          className="w-full border px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={clientCode}
          onChange={(e) => setClientCode(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
