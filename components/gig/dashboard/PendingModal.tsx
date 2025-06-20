"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useStore from "@/app/zustand/useStore";

interface CancelationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isLoading?: boolean;
  userType: "musician" | "client";
}

export const CancelationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  userType,
}: CancelationModalProps) => {
  const { cancelationreason, setcancelationreason } = useStore();

  const handleSubmit = () => {
    onSubmit(cancelationreason);
    setcancelationreason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {userType === "musician" ? "Cancel Booking" : "Cancel Gig"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-300">
            Please provide a reason for cancellation (optional):It will assist
            the musician to improve
          </p>
          <Input
            value={cancelationreason}
            onChange={(e) => setcancelationreason(e.target.value)}
            placeholder="Reason for cancellation..."
            className="bg-gray-800 text-neutral-400 title border-gray-700"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="text-gray border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Submitting..." : "Confirm Cancellation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
