"use client";

import { Button } from "./ui/button";
import { Coffee, Github, Twitter } from "lucide-react";
import { useToolStore } from "@/store/tool-store";
import Logo from "./logo";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { currentTool, setCurrentTool } = useToolStore();

  // Reset tool context when not on tools routes
  useEffect(() => {
    if (!pathname.startsWith("/tools")) {
      setCurrentTool(null);
    }
  }, [pathname, setCurrentTool]);

  return (
    <header className="border-b bg-white/40   dark:bg-gray-900/40 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Tool Title on the left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center"></Link>
          {currentTool ? (
            <div>
              <h1 className="text-md font-semibold">{currentTool.name}</h1>
              <p className="text-xs text-muted-foreground">
                {currentTool.description}
              </p>
            </div>
          ) : (
            <div className="flex flex-row gap-2">
              <Logo />
              <h1 className="text-xl font-semibold">BrowseryTools</h1>
            </div>
          )}
        </div>

        {/* Social links on the right */}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/aghyad97/browserytools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
          <Link
            href="https://twitter.com/aghyadev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
          </Link>
          <Link
            href="https://pay.ziina.com/aghyad"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Coffee className="h-4 w-4 mr-2" />
              Buy me a coffee
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
