// components/ConfettiExplosion.tsx
"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export const ConfettiExplosion = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isClient) return null;

  return (
    <Confetti
      {...dimensions}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
      colors={["#6E45E2", "#88D3CE", "#A78BFA", "#5EEAD4"]}
      onConfettiComplete={() => console.log("Confetti completed!")}
    />
  );
};
