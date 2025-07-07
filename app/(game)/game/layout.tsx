// app/game/layout.tsx
import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}
