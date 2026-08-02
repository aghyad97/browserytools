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
 * `<ToolSeoContent>` IS rendered. It self-suppresses on a locale-prefixed URL
 * whose language it has no prose for — English copy dropped onto a Spanish page
 * is the duplicate-content problem these URLs exist to avoid. The templated
 * fallback now covers every locale in the registry, so nothing is suppressed
 * today: English and Arabic get their hand-authored About/FAQ where one exists,
 * and every locale gets localized templated prose otherwise.
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
