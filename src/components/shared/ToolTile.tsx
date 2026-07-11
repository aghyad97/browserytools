"use client";

/**
 * Shared tool tile — icon chip (category tokens) + name + category label +
 * hover arrow, linking to a tool route. Extracted from the landing grid and
 * ToolShell's Related section, which carried byte-identical markup/CSS
 * independently (spec §3: ToolShell's related tiles "reuse the landing tile
 * visual").
 *
 * This component owns only the tile's own visuals. Entrance animation (the
 * landing's first-paint stagger) is deliberately NOT built in — it stays
 * owned by the call site via `className`/`style`, since ToolShell's related
 * grid never animates while the landing's does.
 */

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import s from "./ToolTile.module.css";

export interface ToolTileProps {
  /** Route to the tool. */
  href: string;
  /** Tool slug — rendered as data-slug for e2e/analytics hooks. */
  slug: string;
  /** Icon component for the chip mark. */
  icon: LucideIcon;
  /** Localized tool name (shown as text and as the truncation title). */
  name: string;
  /** Localized short category label. */
  catLabel: string;
  /** Category chip background token (e.g. var(--bt-cat-image-bg)). */
  chipBg?: string;
  /** Category chip foreground token (e.g. var(--bt-cat-image-fg)). */
  chipFg?: string;
  /** Extra class(es) merged onto the root, after the tile's own class. */
  className?: string;
  /** Extra inline style merged after the chip vars (e.g. an entrance delay). */
  style?: React.CSSProperties;
  /** data-testid for the root link, when a call site needs to query it. */
  testId?: string;
}

export function ToolTile({
  href,
  slug,
  icon: Icon,
  name,
  catLabel,
  chipBg,
  chipFg,
  className,
  style,
  testId,
}: ToolTileProps) {
  return (
    <Link
      href={href}
      data-slug={slug}
      data-testid={testId}
      className={className ? `${s.tile} ${className}` : s.tile}
      style={{ "--chip-bg": chipBg, "--chip-fg": chipFg, ...style } as React.CSSProperties}
    >
      <span className={s.tileChip}>
        <Icon strokeWidth={1.8} />
      </span>
      <span className={s.tileText}>
        <span className={s.tileName} title={name}>
          {name}
        </span>
        <span className={s.tileCat}>{catLabel}</span>
      </span>
      <span className={s.tileArrow} aria-hidden>
        ↗
      </span>
    </Link>
  );
}
