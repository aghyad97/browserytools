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

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isToolNew } from "@/lib/tools-config";
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
  /** Localized tool description — shown in a hover tooltip when provided
      (parity with the pre-redesign ToolCard behavior). */
  description?: string;
  /** ISO creation date (YYYY-MM-DD). Inside the isToolNew window the tile shows
      the "NEW" pill (parity with the pre-redesign ToolCard badge). Passed as a
      raw date rather than a precomputed boolean on purpose — see the mount gate
      in the component body. */
  creationDate?: string;
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
  description,
  creationDate,
}: ToolTileProps) {
  const tCommon = useTranslations("Common");

  /* isToolNew() reads the clock, so it can disagree between the build that
     prerendered this page and the browser rendering it — a page built inside a
     tool's 15-day window but visited after it lapses would ship "new" in its
     static HTML and then drop it on hydration (mismatch + a visible flicker).
     Gating on mount keeps the mark out of the server HTML entirely: it is
     decorative, so paying one frame for it is cheaper than being wrong. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showNew = mounted && !!creationDate && isToolNew(creationDate);

  const tile = (
    <Link
      href={href}
      data-slug={slug}
      data-testid={testId}
      className={className ? `${s.tile} ${className}` : s.tile}
      style={{ "--chip-bg": chipBg, "--chip-fg": chipFg, ...style } as React.CSSProperties}
    >
      <span className={s.tileChip}>
        <span className={s.chipIcon}>
          <Icon strokeWidth={1.8} />
        </span>
        <span className={s.chipArrow} aria-hidden>
          ↗
        </span>
      </span>
      <span className={s.tileText}>
        <span className={s.tileName} title={name}>
          {name}
        </span>
        <span className={s.tileCat}>{catLabel}</span>
      </span>
      {showNew && (
        <span className={s.newBadge} data-testid="tool-tile-new">
          {tCommon("new")}
        </span>
      )}
    </Link>
  );

  if (!description) return tile;
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{tile}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
