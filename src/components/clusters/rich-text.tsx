import * as React from "react";
import Link from "next/link";

/**
 * Minimal inline markup for the hub-page prose in `cluster-content.ts`.
 *
 * Two forms only:
 *   [label](/tools/slug)  → an internal <Link>
 *   `code`                → an inline <code>
 *
 * No HTML is parsed and no raw-HTML prop is used anywhere in this file. The
 * input is static, hand-authored site copy; keeping the grammar this small is
 * what makes that safe to say.
 */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

export function renderRichText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  INLINE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const [, linkLabel, linkHref, code] = match;
    if (code !== undefined) {
      nodes.push(
        <code
          key={`c${key++}`}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {code}
        </code>,
      );
    } else {
      nodes.push(
        <Link
          key={`l${key++}`}
          href={linkHref}
          className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {linkLabel}
        </Link>,
      );
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

/** A prose paragraph with inline links and code spans resolved. */
export function RichParagraph({ text, className }: { text: string; className?: string }) {
  return <p className={className}>{renderRichText(text)}</p>;
}
