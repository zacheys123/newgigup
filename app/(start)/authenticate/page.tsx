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

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const progressInterval = useRef<number | undefined>(undefined);

  // Check if this is the first visit
  useEffect(() => {
    const visitedBefore = localStorage.getItem("hasVisitedBefore");
    if (visitedBefore) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const loaders = [
    {
      component: <InitialWaveLoader progress={progress} />,
      duration: 1000,
    },
    {
      component: <TextRevealLoader />,
      duration: 2500,
    },
    {
      component: <ParticleLoader />,
      duration: 2000,
    },
    {
      component: <GeometricLoader />,
      duration: 1500,
    },
    {
      component: <FinalLoader />,
      duration: 2000,
    },
  ];

  const welcomeLoader = {
    component: <WelcomeBackLoader />,
    duration: 3000,
  };

  const startProgress = (totalDuration: number) => {
    const increment = (100 / totalDuration) * 50;
    progressInterval.current = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 100));
    }, 50);
  };

  const LoadingSequence = useCallback(() => {
    const loaderToUse = isFirstVisit ? loaders : [welcomeLoader];
    const totalDuration = loaderToUse.reduce(
      (sum, loader) => sum + loader.duration,
      0
    );

    startProgress(totalDuration);

    loaderToUse.forEach((loader, index) => {
      const timeout = setTimeout(
        () => {
          setActiveLoader(index + 1);

          if (index === loaderToUse.length - 1) {
            if (progressInterval.current !== undefined) {
              clearInterval(progressInterval.current);
              progressInterval.current = undefined;
            }
            if (myuser?.user?.isAdmin) {
              router.push(`/admin/dashboard`);
            } else {
              if (isLoaded && !myuser?.user?.isAdmin) {
                if (!myuser?.user?.firstname) {
                  router.push(`/roles/${user?.id}`);
                } else {
                  window.location.reload();
                  router.push("/");
                }
              }
            }
          }
        },
        loaderToUse.slice(0, index + 1).reduce((sum, l) => sum + l.duration, 0)
      );

      timeoutRefs.current.push(timeout);
    });
  }, [myuser, isLoaded, isFirstVisit]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      if (progressInterval.current !== undefined) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (myuser?.user?.isBanned) {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      if (progressInterval.current !== undefined) {
        clearInterval(progressInterval.current);
      }
      router.push("/banned");
      return;
    }

    LoadingSequence();
  }, [myuser]);

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
          {isFirstVisit
            ? loaders[activeLoader]?.component || <FinalLoader />
            : welcomeLoader.component}
        </motion.div>
      </AnimatePresence>

      {/* Global progress bar at bottom */}
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

// New WelcomeBackLoader component
const WelcomeBackLoader = () => (
  <div className="flex flex-col items-center justify-center space-y-8">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-xl"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white border-opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white border-opacity-20"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <div className="z-10 text-white text-4xl">👋</div>
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
        Welcome Back!
      </h2>
      <p className="text-gray-300 max-w-md">
        {`We're preparing your personalized experience...`}
      </p>
    </motion.div>

    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, delay: 0.5 }}
      className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
    />
  </div>
);

// Loader Components
const InitialWaveLoader = ({ progress }: { progress: number }) => (
  <div className="relative w-64 h-64 flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-opacity-20 border-white"
        style={{
          width: `${40 + i * 30}px`,
          height: `${40 + i * 30}px`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
    <div className="text-white text-xl font-medium z-10">
      Welcome {progress > 10 ? "back" : ""}
    </div>
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
