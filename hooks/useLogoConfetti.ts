import { useCallback, useState } from "react";
import { animate } from "framer-motion";

type ConfettiConfig = {
  intensity?: number;
  colorPalette?: string[];
  shape?: "mixed" | "circles" | "rectangles";
};

export const useConfetti = () => {
  const [particles, setParticles] = useState<Array<React.ReactNode>>([]);

  const triggerConfetti = useCallback((config?: ConfettiConfig) => {
    const {
      intensity = 1,
      colorPalette = ["#6E45E2", "#88D3CE", "#FF7E5F", "#FEB47B"],
      shape = "mixed",
    } = config || {};

    // Generate dynamic particles
    const newParticles = Array.from({ length: Math.floor(80 * intensity) }).map(
      (_, i) => {
        const size = 8 + Math.random() * 8;
        const rotation = Math.random() * 360;

        return (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 1,
              rotate: rotation,
              scale: 0.8,
            }}
            animate={{
              y: window.innerHeight + 100,
              x: Math.random() * 200 - 100,
              opacity: 0,
              rotate: rotation + 180,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              ease: "linear",
            }}
            style={{
              width: size,
              height: size,
              background:
                colorPalette[Math.floor(Math.random() * colorPalette.length)],
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
              borderRadius:
                shape === "circles"
                  ? "50%"
                  : shape === "rectangles"
                  ? "2px"
                  : Math.random() > 0.5
                  ? "50%"
                  : "2px",
            }}
          />
        );
      }
    );

    setParticles(newParticles);
    animate(
      "#confetti-container > div",
      { opacity: 0 },
      { duration: 0.3, delay: 2 }
    );
  }, []);

  return {
    triggerConfetti,
    Confetti: () => <div id="confetti-container">{particles}</div>,
  };
};
