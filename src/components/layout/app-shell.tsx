"use client";

/**
 * App shell chrome — mounts the rail (desktop), the mobile bar (<900px) and the
 * ⌘K command palette, wired to a shared open/close state. This replaces the
 * retired Header + Sidebar. It renders only the fixed/overlay chrome; each
 * route-group layout renders its own content region (offset by the rail via the
 * `.content` classes in app-shell.module.css).
 */

import { Rail } from "./rail";
import { MobileBar } from "./mobile-bar";
import { CommandPalette, useCommandPalette } from "./command-palette";

export function AppShell() {
  const { open, setOpen } = useCommandPalette();
  const openPalette = () => setOpen(true);

  return (
    <>
      <Rail onSearch={openPalette} />
      <MobileBar onSearch={openPalette} />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
