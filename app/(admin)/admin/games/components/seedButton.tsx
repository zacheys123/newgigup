// app/admin/games/components/SeedTopicsButton.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { seedTopicsToDb } from "../actions/seedTopic";

export function SeedTopicsButton() {
  const [isPending, startTransition] = useTransition();

  const handleSeed = () => {
    if (confirm("Seed topics from topics.ts to your DB?")) {
      startTransition(() => {
        seedTopicsToDb();
      });
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isPending}>
      {isPending ? "Seeding..." : "Seed Topics"}
    </Button>
  );
}
