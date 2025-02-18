"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex items-center justify-end">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BrowseryTools. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
