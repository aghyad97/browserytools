"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-2 px-4 bg-white/40 backdrop-blur-lg">
      <div className="flex items-center justify-end">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BrowseryTools. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
