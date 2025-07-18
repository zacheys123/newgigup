// app/admin/games/components/ResetTopicsButton.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { resetTopics } from "../actions/resetTopics";

export function ResetTopicsButton() {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(() => {
      resetTopics();
    });
  };

  return (
    <Button variant="destructive" onClick={handleReset} disabled={isPending}>
      {isPending ? "Resetting..." : "Reset Topics"}
    </Button>
  );
}
