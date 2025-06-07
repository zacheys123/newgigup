"use client";
import { useEffect, useState } from "react";
import { useCurrentUser } from "./useCurrentUser";
import useSWR from "swr";

type ThemePreference = "light" | "dark" | "system";

export const useTheme = () => {
  const { user } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage or default to system
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as ThemePreference) || "system";
    }
    return "system";
  });

  // Resolved theme (accounts for system preference)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // SWR for server synchronization
  const { data, mutate } = useSWR<{ theme: ThemePreference }>(
    user?._id ? "/api/user/theme" : null,
    (url) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Update resolved theme based on preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateResolvedTheme = () => {
      if (theme === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
        setResolvedTheme(systemDark.matches ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // Listen for system preference changes
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
      }
    };
    systemDark.addEventListener("change", handler);
    return () => systemDark.removeEventListener("change", handler);
  }, [theme]);

  // Initialize theme from server if logged in
  useEffect(() => {
    setIsMounted(true);
    if (data?.theme) {
      setTheme(data.theme);
      localStorage.setItem("theme", data.theme);
    }
  }, [data?.theme]);

  // Apply theme to DOM
  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme, isMounted]);

  // Optimistic theme update
  const updateTheme = async (newTheme: ThemePreference) => {
    const previousTheme = theme;

    // Immediate UI update
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    try {
      // Sync with server if logged in
      if (user?._id) {
        await fetch("/api/user/theme", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme, id: user?.user?._id }),
        });
        mutate({ theme: newTheme }, false);
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
      // Rollback on error
      setTheme(previousTheme);
      localStorage.setItem("theme", previousTheme);
    }
  };

  // Toggle between light/dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    updateTheme(newTheme);
  };

  const useSystemTheme = () => {
    updateTheme("system");
  };
  return {
    isMounted,
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme: updateTheme,
    useSystemTheme,
  };
};
