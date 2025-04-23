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
  isLoading?: boolean; // External loading state
  isCurrentLoading?: boolean; // Specific to this item
}

const ButtonComponentLoader = ({
  children,
  onClick,
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

  return (
    <div className={`relative ${className}`} style={{ minHeight: "40px" }}>
      <Button
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className="w-full relative z-0"
      >
        {children}
      </Button>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.span
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                className="text-sm font-medium text-foreground"
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
