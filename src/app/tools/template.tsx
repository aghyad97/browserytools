import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
import s from "@/components/layout/app-shell.module.css";

/**
 * Zone 5 of the five-zone tool template (spec §3): the per-tool SEO prose and
 * JSON-LD, rendered once for every tool.
 *
 * This is a template, not part of the layout, on purpose. The block is a server
 * component that identifies its page from the `x-pathname` request header. A
 * layout is reused across soft navigations (only the page segment re-renders),
 * so it would keep showing the previous tool's About/FAQ after an in-app click.
 * A template gets a fresh instance, and therefore a fresh server render, on
 * every navigation.
 */
export default function ToolsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className={s.toolSeoZone}>
        <ToolSeoContent />
      </div>
    </>
  );
}
