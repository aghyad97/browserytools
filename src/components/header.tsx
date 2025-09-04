"use client";

import { Button } from "./ui/button";
import { Hammer, Github, Twitter, Coffee, Menu } from "lucide-react";
import { useToolStore } from "@/store/tool-store";
import Logo from "./logo";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  const pathname = usePathname();
  const { currentTool, setCurrentTool } = useToolStore();

  // Reset tool context when not on tools routes
  useEffect(() => {
    if (!pathname.startsWith("/tools")) {
      setCurrentTool(null);
    }
  }, [pathname, setCurrentTool]);

  const handleRequestTool = () => {
    const issueTitle = encodeURIComponent("Tool Request: [Tool Name]");
    const issueBody = encodeURIComponent(
      `
## Tool Request

**Tool Name:** 
**Description:** 
**Use Case:** 
**Priority:** Low/Medium/High

**Additional Details:**
Please describe what this tool should do and how it would help users.
    `.trim()
    );

    const githubUrl = `https://github.com/aghyad97/browserytools/issues/new?title=${issueTitle}&body=${issueBody}&labels=tool-request`;

    window.open(githubUrl, "_blank");
  };

  return (
    <header className="border-b bg-white/40 dark:bg-black/40 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button and Tool Title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button - only visible on mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="flex items-center"
            aria-label="Go to homepage"
          >
            {currentTool ? (
              <div>
                <h1 className="text-md font-semibold">{currentTool.name}</h1>
              </div>
            ) : (
              <div className="flex flex-row gap-2">
                <Logo />
                <h1 className="text-xl font-semibold">BrowseryTools</h1>
              </div>
            )}
          </Link>
        </div>

        {/* Social links on the right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop social links */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/gh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our GitHub repository"
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Visit our GitHub repository"
              >
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/x"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X (Twitter)"
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeSwitcher />
          </div>

          {/* Request tool button - smaller on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestTool}
            className="hidden sm:flex"
          >
            <Hammer className="h-4 w-4 mr-2" />
            Request a tool
          </Button>

          <Link
            href="/x"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden"
            aria-label="Follow us on X (Twitter)"
          >
            <Button
              className="sm:hidden"
              variant="outline"
              size="icon"
              aria-label="Follow us on X (Twitter)"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </Link>

          {/* Mobile request tool button */}
          <ThemeSwitcher className="sm:hidden" variant="outline" />

          <Link
            href="/gh"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden"
            aria-label="Visit our GitHub repository"
          >
            <Button
              variant="outline"
              size="icon"
              aria-label="Visit our GitHub repository"
            >
              <Github className="h-4 w-4" />
            </Button>
          </Link>

          {/* Coffee button - smaller on mobile */}
          <Link
            href="/coffee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee"
          >
            <Button size="sm" className="hidden sm:flex">
              <Coffee className="h-4 w-4 mr-2" />
              Buy me a coffee
            </Button>
            <Button
              size="icon"
              className="sm:hidden"
              aria-label="Buy me a coffee"
            >
              <Coffee className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
