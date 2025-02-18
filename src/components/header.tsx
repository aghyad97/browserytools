import Link from "next/link";
import { Button } from "./ui/button";
import { Coffee, Github, Twitter } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-end h-16">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/browserytools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://www.buymeacoffee.com/yourusername"
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
