"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Authenticate = () => {
  const [activeLoader, setActiveLoader] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const router = useRouter();
  const { user: myuser } = useCurrentUser();
  const { user, isSignedIn } = useUser();
  const { isLoaded } = useAuth();
  const initialized = useRef(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const progressInterval = useRef<number | undefined>(undefined);

  // Initialize first visit state
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const hasVisited = localStorage.getItem("hasVisited");
    setIsFirstVisit(!hasVisited);
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  // Memoized loaders based on isFirstVisit
  const loaders = React.useMemo(() => {
    return [
      {
        component: <InitialWaveLoader progress={progress} />,
        duration: 1000,
      },
      {
        component: <TextRevealLoader />,
        duration: isFirstVisit ? 2500 : 0,
      },
      {
        component: <ParticleLoader />,
        duration: isFirstVisit ? 2000 : 0,
      },
      {
        component: <GeometricLoader />,
        duration: isFirstVisit ? 1500 : 0,
      },
      {
        component: <FinalLoader />,
        duration: isFirstVisit ? 2000 : 2500,
      },
    ];
  }, [isFirstVisit, progress]);

  const startProgress = useCallback(() => {
    const totalDuration = loaders.reduce(
      (sum, loader) => sum + loader.duration,
      0
    );
    const increment = (100 / totalDuration) * 50;

    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + increment, 100);
        if (newProgress >= 100 && progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = undefined;
        }
        return newProgress;
      });
    }, 50);
  }, [loaders]);

  const redirectUser = useCallback(() => {
    if (myuser?.user?.isBanned) {
      router.push("/banned");
      return;
    }

    if (myuser?.user?.isAdmin) {
      router.push(`/admin/dashboard`);
    } else {
      if (!myuser?.user?.firstname) {
        router.push(`/roles/${user?.id}`);
      } else {
        router.push("/");
      }
    }
  }, [myuser, user?.id, router]);

  const runLoaderSequence = useCallback(() => {
    startProgress();

    let cumulativeDelay = 0;
    timeoutRefs.current = [];

    loaders.forEach((loader, index) => {
      const timeout = setTimeout(() => {
        setActiveLoader(index + 1);

        if (index === loaders.length - 1) {
          redirectUser();
        }
      }, cumulativeDelay);

      cumulativeDelay += loader.duration;
      timeoutRefs.current.push(timeout);
    });
  }, [loaders, startProgress, redirectUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      if (progressInterval.current !== undefined) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Main effect to trigger the sequence
  useEffect(() => {
    if (!isLoaded || !myuser) return;

    if (myuser?.user?.isBanned) {
      redirectUser();
      return;
    }

    runLoaderSequence();
  }, [isLoaded, myuser, runLoaderSequence, redirectUser]);

  if (myuser?.user?.isBanned) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500"
          />
          <p className="text-gray-300 font-medium">
            Initializing your experience...
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-4xl">⚠️</div>
          <h3 className="text-gray-200 text-xl font-medium">
            Authentication required
          </h3>
          <p className="text-gray-400 max-w-md">
            Please sign in to access this content. Redirecting you to the login
            page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLoader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          {loaders[activeLoader]?.component || <FinalLoader />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 px-10 max-w-3xl mx-auto">
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-gray-400 text-sm mt-2">
          {Math.round(progress)}% loaded
        </p>
      </div>
    </div>
  );
};

// Loader Components
const InitialWaveLoader = ({ progress }: { progress: number }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Background gradient circles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`circle-${i}`}
        className="absolute rounded-full"
        style={{
          width: `${60 + i * 40}px`,
          height: `${60 + i * 40}px`,
          background: `conic-gradient(from ${
            i * 45
          }deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.3), transparent 70%)`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 0.9],
          opacity: [0, 0.6, 0.3],
          rotate: [0, i % 2 ? 180 : -180],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.2,
          ease: "anticipate",
        }}
      />
    ))}

    {/* Pulse waves */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`wave-${i}`}
        className="absolute rounded-full border-2 border-opacity-10"
        style={{
          width: `${80 + i * 60}px`,
          height: `${80 + i * 60}px`,
          borderColor: i % 2 ? "#8b5cf6" : "#6366f1",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.8, 1.5, 0.8],
          opacity: [0.4, 0.8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeOut",
        }}
      />
    ))}

    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full bg-white"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
        }}
        animate={{
          y: [0, (Math.random() - 0.5) * 100],
          x: [0, (Math.random() - 0.5) * 50],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 3 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Main text container */}
    <motion.div
      className="relative z-20 text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "backOut" }}
    >
      <motion.div
        className="text-5xl font-bold mb-4"
        style={{
          background:
            progress > 10
              ? "linear-gradient(45deg, #8b5cf6, #ec4899, #f59e0b)"
              : "linear-gradient(45deg, #8b5cf6, #6366f1)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 2px 10px rgba(139, 92, 246, 0.3)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          letterSpacing: ["0em", "0.02em", "0em"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {progress > 10 ? "Welcome back" : "Welcome"}
      </motion.div>

      <motion.p
        className="text-gray-300 text-lg max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {progress > 10
          ? "We've missed you! Preparing your personalized experience..."
          : "Let's get started! Initializing your workspace..."}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        className="absolute -bottom-8 left-0 right-0 flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-1 rounded-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          style={{ width: "60%" }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            width: ["50%", "70%", "50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>

    {/* Floating decorative elements */}
    <motion.div
      className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full bg-purple-400 blur-sm"
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: 0.5,
      }}
    />
    <motion.div
      className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-blue-400 blur-sm"
      animate={{
        y: [0, 20, 0],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: 0.8,
      }}
    />
  </div>
);
const TextRevealLoader = () => (
  <div className="text-center">
    <div className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
      <AnimatedText text="gigUp" />
    </div>
    <div className="text-gray-400 max-w-md">
      <AnimatedText text="Creating connections that matter" delay={0.5} />
    </div>
  </div>
);

const ParticleLoader = () => (
  <div className="relative w-full h-64">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-white"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-lg font-medium">
        Preparing your workspace...
      </div>
    </div>
  </div>
);

const GeometricLoader = () => (
  <div className="relative w-64 h-64">
    <motion.div
      className="absolute inset-0 border-4 border-purple-500 rounded-lg"
      animate={{
        rotate: 360,
        borderRadius: ["20%", "50%", "20%"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <motion.div
      className="absolute inset-4 border-4 border-blue-500 rounded-lg"
      animate={{
        rotate: -360,
        borderRadius: ["50%", "20%", "50%"],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="text-white font-medium">Almost there...</p>
    </div>
  </div>
);

const FinalLoader = () => (
  <div className="flex flex-col items-center space-y-6">
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </motion.div>
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
        Ready to go!
      </h3>
      <p className="text-gray-400">Taking you to your dashboard...</p>
    </div>
  </div>
);

const AnimatedText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => (
  <div className="flex overflow-hidden">
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + i * 0.05 }}
      >
        {char}
      </motion.span>
    ))}
  </div>
);

export default Authenticate;
