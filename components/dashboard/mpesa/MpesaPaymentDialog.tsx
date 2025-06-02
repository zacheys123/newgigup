"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MpesaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentInitiated: (phoneNumber: string) => Promise<void>;
  isProcessing: boolean;
}

export function MpesaPaymentDialog({
  open,
  onOpenChange,
  onPaymentInitiated,
  isProcessing,
}: MpesaPaymentDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Format the phone number for display and validation
  useEffect(() => {
    // Remove all non-digit characters
    const digitsOnly = inputValue.replace(/\D/g, "");

    // Convert to Safaricom format (254 + 9 digits)
    let formattedNumber = "";
    if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
      formattedNumber = "254" + digitsOnly.substring(1);
    } else if (digitsOnly.length === 9) {
      formattedNumber = "254" + digitsOnly;
    } else if (digitsOnly.startsWith("254") && digitsOnly.length === 12) {
      formattedNumber = digitsOnly;
    } else {
      formattedNumber = "254" + digitsOnly;
    }

    // Trim to max 12 digits (254 + 9)
    formattedNumber = formattedNumber.substring(0, 12);

    // Validate - must be exactly 254 followed by 9 digits starting with 7 or 1
    const valid = /^254[17]\d{8}$/.test(formattedNumber);
    setIsValid(valid);

    if (inputValue && !valid) {
      setError("Please enter a valid 9-digit Safaricom number");
    } else {
      setError("");
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 9) {
      // Only allow up to 9 digits (after 254)
      setInputValue(value);
    }
  };

  const formatDisplayNumber = (digits: string) => {
    if (!digits) return "";
    // Format as XXX XXX XXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6)
      return `${digits.substring(0, 3)} ${digits.substring(3)}`;
    return `${digits.substring(0, 3)} ${digits.substring(
      3,
      6
    )} ${digits.substring(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please enter a valid Safaricom number");
      return;
    }
    setError("");
    await onPaymentInitiated(
      "254" + inputValue.replace(/\D/g, "").substring(0, 9)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-gradient-to-b from-green-600 to-green-800 border-green-700 rounded-lg p-6 text-white">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-2 mr-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#FFC72C"
                />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="#007D32"
                />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              M-Pesa Payment
            </DialogTitle>
          </div>
          <DialogDescription className="text-green-100">
            Enter your Safaricom phone number
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-green-100">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300">
                +254
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="712 345 678"
                value={formatDisplayNumber(inputValue)}
                onChange={handleInputChange}
                className="bg-green-700 border-green-600 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400 pl-14 pr-10"
                inputMode="numeric"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <p className="text-green-200 text-xs">
              Enter your 9-digit Safaricom number
            </p>
          </div>

          <div className="bg-green-800 p-4 rounded-lg border border-green-700">
            <div className="flex justify-between text-green-100 text-sm">
              <span>Full Number:</span>
              <span className="font-mono font-bold">
                {inputValue ? (
                  <span className="text-green-300">
                    +254 {formatDisplayNumber(inputValue)}
                  </span>
                ) : (
                  "________________"
                )}
              </span>
            </div>
            <div className="flex justify-between text-green-100 text-sm mt-2">
              <span>Amount:</span>
              <span className="font-bold">KES 100</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isProcessing || !isValid}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Pay with M-Pesa"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-green-200 text-xs">
          <p>You will receive an M-Pesa push notification</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
