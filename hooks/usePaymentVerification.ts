import { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCheckTrial } from "./useCheckTrials";
import { useCurrentUser } from "./useCurrentUser";

interface UsePaymentVerificationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export function usePaymentVerification(
  options?: UsePaymentVerificationOptions
) {
  const { user } = useCurrentUser();
  const [isMutating, setIsMutating] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { setisFirstMonthEnd } = useCheckTrial(user?.user);
  const abortControllerRef = useRef<AbortController | null>(null);

  // In your usePaymentVerification hook
  const checkPayment = async (checkoutRequestId: string, attempt = 1) => {
    abortControllerRef.current = new AbortController();

    try {
      setIsMutating(true);
      toast.loading(`Verifying payment... (Attempt ${attempt}/10)`, {
        id: "payment-verification",
      });

      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId, attempt }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const verificationResult = await res.json();

      if (verificationResult.success) {
        // Success case
        toast.success("Payment confirmed! You're now Pro 🎉");
        setPaymentSuccess(true);
        setIsMutating(false);
        setisFirstMonthEnd(false);
        options?.onSuccess?.();
      } else if (verificationResult.shouldCancel) {
        // 👈 Handle shouldCancel from backend
        toast.dismiss("payment-verification");
        toast.error(
          verificationResult.message ||
            "Payment verification timed out. Please try again."
        );
        setIsMutating(false);
        options?.onError?.(verificationResult.message || "Verification failed");
      } else if (verificationResult.retry) {
        // Continue retrying
        const delay = Math.min(3000 * attempt, 15000);
        setTimeout(() => checkPayment(checkoutRequestId, attempt + 1), delay);
      } else {
        // Other errors
        toast.dismiss("payment-verification");
        toast.error(
          verificationResult.message || "Payment verification failed"
        );
        setIsMutating(false);
        options?.onError?.(verificationResult.message || "Verification failed");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.dismiss("payment-verification");
        toast.error("Verification cancelled.");
        options?.onCancel?.();
      } else {
        toast.dismiss("payment-verification");
        toast.error("Error verifying payment. Please try again.");
        console.error("Verification error:", err);
        options?.onError?.(
          err instanceof Error ? err.message : "Unknown error"
        );
      }
      setIsMutating(false);
    }
  };

  const cancelVerification = () => {
    abortControllerRef.current?.abort();
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    checkPayment,
    cancelVerification,
    isMutating,
    paymentSuccess,
    setPaymentSuccess,
  };
}
