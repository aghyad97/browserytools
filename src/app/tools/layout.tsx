import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { ToolTitle } from "@/components/layout/tool-title";
import NavigationTracker from "@/components/NavigationTracker";
import ToolSeoContent from "@/components/ToolSeoContent";
import s from "@/components/layout/app-shell.module.css";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationTracker />
      <AppShell />
      <div className={s.contentScroll}>
        <TopBar />
        <main className="py-2">
          {/* Per-tool <h1> (the retired Header's title function, spec §6.4). */}
          <ToolTitle />
          {/* The tool itself. Full-viewport tools render at their natural
              height; the SEO content below appears beneath the fold and
              scrolls within this same container. */}
          {children}
          {/* Zone 5 of the five-zone template (spec §3): the programmatic
              on-page SEO content + JSON-LD, for every tool. Rendered exactly
              once here — the single source — so <ToolShell> never duplicates
              it. Sits below the shell's Related tiles, closing out zone 5. */}
          <div className={s.toolSeoZone}>
            <ToolSeoContent />
          </div>
        </main>
      </div>
    </>
  );
}
