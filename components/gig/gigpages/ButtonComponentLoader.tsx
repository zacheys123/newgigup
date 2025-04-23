import React from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ButtonComponentLoaderProps {
  children: React.ReactNode;
  onClick: () => Promise<void> | void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  loadingText?: string;
  isLoading?: boolean;
  isCurrentLoading?: boolean;
}

const ButtonComponentLoader = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  loadingText = "Processing...",
  isLoading = false,
  isCurrentLoading = false,
}: ButtonComponentLoaderProps) => {
  const showOverlay = isLoading && isCurrentLoading;

  const handleClick = async () => {
    if (!showOverlay) {
      await onClick();
    }
  };

  // Size classes
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full transition-all duration-200 ${sizeClasses[size]} ${
          variant === "secondary" ? "shadow-sm" : ""
        }`}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
      </Button>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 rounded-md flex items-center justify-center ${
              variant === "secondary" ? "bg-background/90" : "bg-foreground/90"
            }`}
          >
            <motion.div
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                <Loader2
                  className={`h-4 w-4 ${
                    variant === "secondary" ? "text-foreground" : "text-white"
                  }`}
                />
              </motion.div>
              <motion.span
                className={`text-sm ${
                  variant === "secondary" ? "text-foreground" : "text-white"
                }`}
              >
                {loadingText}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ButtonComponentLoader;
