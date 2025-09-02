"use client";

import { Button } from "./ui/button";
import { Coffee, Github, Twitter } from "lucide-react";
import { useToolStore } from "@/store/tool-store";

export default function Header() {
  const { currentTool } = useToolStore();

  return (
    <header className="border-b bg-white/40 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Tool Title on the left */}
        <div className="flex items-center">
          {currentTool ? (
            <div>
              <h1 className="text-md font-semibold">{currentTool.name}</h1>
              <p className="text-xs text-muted-foreground">
                {currentTool.description}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold">Web Tools Suite</h1>
              <p className="text-sm text-muted-foreground">
                Collection of browser-based tools
              </p>
            </div>
          )}
        </div>

        {/* Social links on the right */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/aghyad97/browserytools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://twitter.com/aghyadev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://pay.ziina.com/aghyad"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Coffee className="h-4 w-4 mr-2" />
              Buy me a coffee
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
