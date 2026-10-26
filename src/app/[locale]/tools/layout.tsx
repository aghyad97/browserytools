import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import NavigationTracker from "@/components/NavigationTracker";
import { ToolReceipt } from "@/components/support/tool-receipt";
import s from "@/components/layout/app-shell.module.css";

/**
 * Shell for the locale-prefixed tool routes.
 *
 * Mirrors `src/app/tools/layout.tsx` with one deliberate omission:
 *
 *  - `<ToolTitle>` derives its slug from `pathname.split("/")[2]`, which is the
 *    locale on these URLs. It renders nothing for every catalogued tool anyway
 *    (they all own their <h1> via ToolShell), so including it would only risk a
 *    wrong heading.
 *
 * The per-tool SEO block (`<ToolSeoContent slug>`) is rendered by each tool's
 * page module, not here. `[locale]/tools/[slug]/page.tsx` re-exports those same
 * modules, so the block appears on these URLs too, in the locale the middleware
 * resolved. It self-suppresses for a locale it has no prose for (English copy on
 * a Spanish page is the duplicate-content problem these URLs exist to avoid);
 * the templated fallback covers every registered locale, so nothing is
 * suppressed today.
 *
 * The tool component itself is fully translated through next-intl, so the
 * page's primary content is genuinely localized in every locale.
 */
export default function LocaleToolsLayout({
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
          {children}
          {/* Earned support ask — listens to the download pathway, renders
              nothing until a tool actually delivers something. */}
          <ToolReceipt />
        </main>
      </div>
    </>
  );
}
