"use client";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ThemeToggleProps = {
  className?: string;
  theme?: "light" | "dark" | "system";
  resolvedTheme?: "light" | "dark";
  toggleTheme?: () => void;
  useSystemTheme?: () => void;
};

export const ThemeToggle = ({
  className,
  resolvedTheme = "light",
  toggleTheme,
  useSystemTheme,
}: ThemeToggleProps) => {
  // Fallback to useTheme hook if props not provided
  const themeContext = useTheme();
  //   const effectiveTheme = theme ?? themeContext.theme;
  const effectiveResolvedTheme = resolvedTheme ?? themeContext.resolvedTheme;
  const effectiveToggleTheme = toggleTheme ?? themeContext.toggleTheme;
  const effectiveUseSystemTheme = useSystemTheme ?? themeContext.useSystemTheme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full", className)}
        >
          {effectiveResolvedTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => effectiveToggleTheme()}
          className="flex items-center justify-between"
        >
          <span>
            {effectiveResolvedTheme === "dark" ? "Light" : "Dark"} Mode
          </span>
          {effectiveResolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={effectiveUseSystemTheme}
          className="flex items-center justify-between"
        >
          <span>System Preference</span>
          <Monitor className="h-4 w-4" />
        </DropdownMenuItem>
        <div className="px-2 py-1.5 flex items-center justify-between gap-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={effectiveResolvedTheme === "dark"}
            onCheckedChange={effectiveToggleTheme}
            className="data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-300"
          />
          <Moon className="h-4 w-4" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
