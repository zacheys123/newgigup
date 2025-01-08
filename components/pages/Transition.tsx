"use client";

import { motion } from "framer-motion";

interface TransitionProps {
  children: React.ReactNode;
  variant: {
    initial: object;
    animate: object;
    transition: object;
  };
  className: string;
  navStates: boolean;
  onClick: () => void;
  // initialStyle: any;
}
export default function Transition({
  children,
  variant,
  className,
  navStates,
  onClick,
}: TransitionProps) {
  return (
    <>
      {navStates ? (
        <motion.div
          initial={variant.initial || {}}
          animate={variant.animate}
          transition={variant.transition}
          className={className}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          //   initial={initialStyle}
          //   animate={animateStyle}
          //   transition={transitionStyle}
          initial={variant.initial}
          animate={variant.animate}
          transition={variant.transition}
          className={className}
          onClick={onClick}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
