"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { playCue } from "@/lib/ui-sound";

interface ThemeSwitcherProps {
  variant?: "outline" | "ghost";
  className?: string;
}

export function ThemeSwitcher({
  variant = "ghost",
  className,
}: ThemeSwitcherProps) {
  const { setTheme } = useTheme();

  const pick = (theme: string) => {
    playCue("toggle");
    // Soft theme flip: a single coordinated crossfade of the whole surface via
    // the View Transitions API. next-themes runs with `disableTransitionOnChange`
    // (it injects `*{transition:none}` during the class swap), so a CSS-transition
    // soft-flip can't fire — the VT crossfade sidesteps that entirely and only
    // runs on an explicit toggle, so initial load is unaffected. flushSync forces
    // next-themes' effect-driven class flip to commit inside the transition so
    // the new-state snapshot captures the new theme. Feature-checked + gated on
    // reduced motion; anything unsupported falls back to an instant setTheme.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof doc.startViewTransition === "function" && !reduced) {
      doc.startViewTransition(() => flushSync(() => setTheme(theme)));
    } else {
      setTheme(theme);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn("h-8 w-8 p-0", className)}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => pick("light")}>
          <Sun className="me-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => pick("dark")}>
          <Moon className="me-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => pick("system")}>
          <Monitor className="me-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
