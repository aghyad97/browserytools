import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import NavigationTracker from "@/components/NavigationTracker";
import ToolSeoContent from "@/components/ToolSeoContent";
import s from "@/components/layout/app-shell.module.css";

/**
 * Shell for the locale-prefixed tool routes.
 *
 * Mirrors `src/app/tools/layout.tsx` with two deliberate omissions:
 *
 *  - `<ToolTitle>` derives its slug from `pathname.split("/")[2]`, which is the
 *    locale on these URLs. It renders nothing for every catalogued tool anyway
 *    (they all own their <h1> via ToolShell), so including it would only risk a
 *    wrong heading.
 * `<ToolSeoContent>` IS rendered, but it self-suppresses on a locale-prefixed
 * URL whose language the SEO registry has no prose for. The registry is en/ar
 * only, so today that means Arabic gets its full authored About/FAQ block and
 * the other locales get none — rather than a block of English prose dropped
 * onto a Spanish page, which is the duplicate-content problem these URLs exist
 * to avoid. Adding a language to the registry lights it up here automatically.
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
          <div className={s.toolSeoZone}>
            <ToolSeoContent />
          </div>
        </main>
      </div>
    </>
  );
}
