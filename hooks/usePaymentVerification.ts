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

  const checkPayment = async (checkoutRequestId: string, attempt = 1) => {
    if (attempt > 10) {
      toast.dismiss("payment-verification");
      toast.error("Payment verification timed out. Please contact support.");
      setIsMutating(false);
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsMutating(true);
      toast.loading(`Verifying payment... Attempt ${attempt}`, {
        id: "payment-verification",
      });

      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const verificationResult = await res.json();

      if (verificationResult.success) {
        toast.dismiss("payment-verification");
        toast.success("Payment confirmed! You’re now Pro 🎉");
        setPaymentSuccess(true);
        setisFirstMonthEnd(false);
        setIsMutating(false);
        options?.onSuccess?.();
      } else if (verificationResult.retry) {
        const delay = Math.min(3000 * attempt, 15000);
        toast.loading(`Still verifying... Attempt ${attempt}`, {
          id: "payment-verification",
        });

        setTimeout(() => checkPayment(checkoutRequestId, attempt + 1), delay);
      } else {
        toast.dismiss("payment-verification");
        const msg =
          verificationResult.errorMessage ||
          verificationResult.message ||
          "Unknown error";
        toast.error(`Payment failed: ${msg}`);
        setIsMutating(false);
        options?.onError?.(msg);
      }
    } catch (err) {
      if (err instanceof Error ? err.name === "AbortError" : undefined) {
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
