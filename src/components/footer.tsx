"use client";

import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="border-t py-2 px-4 bg-white/40 backdrop-blur-lg dark:bg-black/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BrowseryTools. All rights reserved.
        </p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
