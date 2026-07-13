"use client";

/**
 * Shared result surface (R3 §F3 M1) — replaces the ~60 hand-rolled panels that
 * pair a mono result block with a CopyButton (and often a download). A header
 * row carries an optional title + the copy/download actions; the body is a
 * scrollable mono block of `text` by default, or arbitrary `children` when a
 * tool renders structured/highlighted output instead of raw text.
 *
 * `text` is ALWAYS the copy/download payload, even when `children` overrides
 * the visual body — so a syntax-highlighted panel still copies the raw string.
 * CopyButton is passed `disabled={!text}` (empty state), and the download
 * button (rendered only when `filename` is given) routes through lib/download.
 * The download is silent by default (unlike copy, which always toasts); pass
 * `downloadSuccessMessage` to opt a call site back into a toast — e.g. a tool
 * that had its own "Downloaded as .ext" toast before adopting this molecule.
 *
 * All colours via var(--bt-*) tokens; logical properties throughout (RTL for
 * free); both themes; no single-edge borders.
 */

import type { ReactNode } from "react";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/download";
import { CopyButton } from "./CopyButton";
import s from "./OutputPanel.module.css";

export interface OutputPanelProps {
  /** The result string — copy/download payload and default mono body. */
  text: string;
  /** Optional mono uppercase caption in the header row. */
  title?: ReactNode;
  /** When set, a download button writes `text` to this filename via lib/download. */
  filename?: string;
  /** MIME type for the download blob (default text/plain). */
  mime?: string;
  /** Overrides the default mono block as the visual body (copy still uses `text`). */
  children?: ReactNode;
  /** Extra class(es) merged onto the root after the panel's own class. */
  className?: string;
  /** data-testid for the root, when a call site needs to query it. */
  "data-testid"?: string;
  /** Overrides the CopyButton's aria-label (default: translated "Copy"). */
  copyLabel?: string;
  /** Overrides the CopyButton's success toast (default: translated "Copied"). */
  copySuccessMessage?: string;
  /** Overrides the CopyButton's error toast (default: translated "Copy failed"). */
  copyErrorMessage?: string;
  /** When set, fires `toast.success(message)` after the download click (no toast by default). */
  downloadSuccessMessage?: string;
}

export function OutputPanel({
  text,
  title,
  filename,
  mime,
  children,
  className,
  "data-testid": dataTestId,
  copyLabel,
  copySuccessMessage,
  copyErrorMessage,
  downloadSuccessMessage,
}: OutputPanelProps) {
  const t = useTranslations("Common");
  const empty = !text;

  return (
    <div className={className ? `${s.panel} ${className}` : s.panel} data-testid={dataTestId}>
      <div className={s.header}>
        {title != null && <span className={s.title}>{title}</span>}
        <div className={s.actions}>
          <CopyButton
            text={text}
            disabled={empty}
            label={copyLabel}
            successMessage={copySuccessMessage}
            errorMessage={copyErrorMessage}
          />
          {filename && (
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("download")}
              disabled={empty}
              onClick={() => {
                downloadText(text, filename, mime);
                if (downloadSuccessMessage) toast.success(downloadSuccessMessage);
              }}
            >
              <DownloadIcon className="h-4 w-4" />
              {t("download")}
            </Button>
          )}
        </div>
      </div>
      <div className={s.body}>
        {children ?? <pre className={s.pre}>{text}</pre>}
      </div>
    </div>
  );
}
