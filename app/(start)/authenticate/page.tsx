"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ReturningExperience } from "@/components/start/loaders/ReturningLoader";
import { FirstTimLoader } from "@/components/start/loaders/firstTimeLoader";

export default function Authenticate() {
  const router = useRouter();
  const { user: clerkUser, isSignedIn } = useUser();
  const { isLoaded: authLoaded } = useAuth();
  const { user: currentUser } = useCurrentUser();
  const [loadingState, setLoadingState] = useState<{
    progress: number;
    phase: number;
    isReturning: boolean;
  }>({ progress: 0, phase: 0, isReturning: false });
  const animationRefs = useRef<{
    progressInterval?: NodeJS.Timeout;
    timeouts: NodeJS.Timeout[];
  }>({ timeouts: [] });

  // Check if user is returning and initialize state
  useEffect(() => {
    const hasSession = localStorage.getItem("hasSession");
    setLoadingState((prev) => ({
      ...prev,
      isReturning: !!hasSession,
    }));
  }, []);

  // Loader sequence configuration
  const loaderConfig = React.useMemo(() => {
    const baseConfig = {
      durations: loadingState.isReturning
        ? [1500, 2000] // Returning user sequence
        : [1000, 2500, 2000, 1500, 2000], // First-time sequence
      transitionDuration: 0.5,
    };

    return {
      ...baseConfig,
      totalDuration: baseConfig.durations.reduce((sum, dur) => sum + dur, 0),
    };
  }, [loadingState.isReturning]);

  // Progress animation
  const startProgressAnimation = useCallback(() => {
    const increment = (100 / loaderConfig.totalDuration) * 50;

    animationRefs.current.progressInterval = setInterval(() => {
      setLoadingState((prev) => {
        const newProgress = Math.min(prev.progress + increment, 100);
        return { ...prev, progress: newProgress };
      });
    }, 50);
  }, [loaderConfig.totalDuration]);

  // Phase management
  const startPhaseSequence = useCallback(() => {
    let cumulativeDelay = 0;
    animationRefs.current.timeouts = [];

    loaderConfig.durations.forEach((duration, index) => {
      const timeout = setTimeout(() => {
        setLoadingState((prev) => ({
          ...prev,
          phase: index + 1,
        }));
      }, cumulativeDelay);

      cumulativeDelay += duration;
      animationRefs.current.timeouts.push(timeout);
    });
  }, [loaderConfig.durations]);

  // Redirect logic
  const redirectUser = useCallback(() => {
    localStorage.setItem("hasSession", "true");

    if (currentUser?.isBanned) {
      router.push("/banned");
      return;
    }

    if (currentUser?.isAdmin) {
      router.push("/admin/dashboard");
    } else if (!currentUser?.firstname) {
      router.push(`/roles/${clerkUser?.id}`);
    } else {
      router.push("/");
    }
  }, [currentUser, clerkUser?.id, router]);

  // Main effect to manage authentication flow
  useEffect(() => {
    if (!authLoaded || !currentUser) return;

    if (currentUser?.isBanned) {
      redirectUser();
      return;
    }

    startProgressAnimation();
    startPhaseSequence();

    // Set final redirect timeout
    const totalTime = loaderConfig.durations.reduce((a, b) => a + b, 0);
    const timeout = setTimeout(() => redirectUser(), totalTime);
    animationRefs.current.timeouts.push(timeout);

    return () => {
      animationRefs.current.timeouts.forEach(clearTimeout);
      if (animationRefs.current.progressInterval) {
        clearInterval(animationRefs.current.progressInterval);
      }
    };
  }, [
    authLoaded,
    currentUser,
    redirectUser,
    startProgressAnimation,
    startPhaseSequence,
    loaderConfig.durations,
  ]);

  // Early returns for special states
  if (currentUser?.isBanned) return null;

  if (!authLoaded) {
    return <LoadingPlaceholder message="Initializing your experience..." />;
  }

  if (!isSignedIn) {
    return (
      <AuthErrorScreen
        title="Authentication required"
        message="Please sign in to access this content. Redirecting you to login..."
      />
    );
  }

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={loadingState.phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: loaderConfig.transitionDuration }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {loadingState.isReturning ? (
            <ReturningExperience phase={loadingState.phase} />
          ) : (
            <FirstTimLoader
              phase={loadingState.phase}
              progress={loadingState.progress}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ProgressBar progress={loadingState.progress} />
    </div>
  );
}

// Supporting components
function LoadingPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500"
        />
        <p className="text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
}

function AuthErrorScreen({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-400 text-4xl">⚠️</div>
        <h3 className="text-gray-200 text-xl font-medium">{title}</h3>
        <p className="text-gray-400 max-w-md">{message}</p>
      </div>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
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
  );
}
