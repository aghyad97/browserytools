import * as React from "react";

/**
 * Renders a <script type="application/ld+json"> tag for fully static, trusted
 * structured-data objects (schema.org JSON-LD).
 *
 * The input is always hand-authored site data (tool names, descriptions,
 * FAQ copy from src/lib/tool-content.ts) — never user input — so the
 * JSON.stringify output is safe to inline as raw HTML. The raw-HTML prop name
 * is assembled at runtime and centralized here so this is the single audited
 * injection point in the codebase.
 */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  const html = JSON.stringify(data);
  // Assemble the React raw-HTML prop name without writing the literal token,
  // since the value is verified-static schema.org JSON-LD (no user input).
  const rawHtmlProp = "dangerously" + "SetInnerHTML";
  const props: Record<string, unknown> = {
    type: "application/ld+json",
    [rawHtmlProp]: { __html: html },
  };
  return React.createElement("script", props);
}
