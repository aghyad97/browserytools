"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UploadIcon, FileType2Icon, RefreshCwIcon, InfoIcon } from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import { downloadBlob } from "@/lib/download";
import { extractDocument, type DocBlock, type ExtractResult } from "@/lib/pdf/layout";
import { buildDocx } from "@/lib/docx/build";

const PDF_ACCEPT = { "application/pdf": [".pdf"] };

/** Tally the four block kinds the layout engine emits, for the structure summary. */
function countBlocks(blocks: DocBlock[]) {
  let headings = 0;
  let paragraphs = 0;
  let lists = 0;
  let tables = 0;
  for (const block of blocks) {
    if (block.type === "heading") headings++;
    else if (block.type === "paragraph") paragraphs++;
    else if (block.type === "list") lists++;
    else if (block.type === "table") tables++;
  }
  return { headings, paragraphs, lists, tables };
}

/** file.name with its extension stripped, for deriving the .docx download name. */
function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

export default function PdfToWord() {
  const t = useTranslations("Tools.PdfToWord");
  const tc = useTranslations("ToolsConfig");

  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [converting, setConverting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reads + analyzes a freshly (re)selected PDF. Called for both the initial
  // drop and the "Change" re-selection path, so file swaps never leave stale
  // derived state (result is cleared synchronously, before the async read).
  const runExtraction = useCallback(
    async (picked: File) => {
      setFile(picked);
      setResult(null);
      setProgress(0);
      setExtracting(true);
      try {
        const bytes = new Uint8Array(await picked.arrayBuffer());
        const res = await extractDocument(bytes, { onProgress: setProgress });
        setResult(res);
      } catch (err) {
        console.error(err);
        toast.error(t("extractFailed"));
      } finally {
        setExtracting(false);
      }
    },
    [t],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const picked = accepted[0];
      if (picked) void runExtraction(picked);
    },
    [runExtraction],
  );

  const convert = useCallback(async () => {
    if (!file || !result || result.blocks.length === 0) return;
    setConverting(true);
    try {
      const blob = await buildDocx(result.blocks, { title: baseName(file.name) });
      downloadBlob(blob, `${baseName(file.name)}.docx`);
      toast.success(t("downloaded"));
    } catch (err) {
      console.error(err);
      toast.error(t("convertFailed"));
    } finally {
      setConverting(false);
    }
  }, [file, result, t]);

  const stats = result ? countBlocks(result.blocks) : null;
  const scannedPages = result?.scannedPages ?? [];
  const scannedPageNumbers = scannedPages.map((p) => p + 1).join(", ");

  return (
    <ToolShell
      slug="pdf-to-word"
      title={tc("tools.pdf-to-word.name")}
      sub={tc("tools.pdf-to-word.description")}
      primaryAction={{
        label: converting ? t("converting") : t("convert"),
        onClick: convert,
        disabled: !result || result.blocks.length === 0 || extracting || converting,
      }}
    >
      <div className="space-y-4">
        <SettingsCard>
          {!file ? (
            <FileDropzone
              onFiles={onDrop}
              accept={PDF_ACCEPT}
              multiple={false}
              inputProps={{ "data-testid": "pdf-to-word-input" }}
              className={({ isDragActive }) => `
                h-48 rounded-lg border-2 border-dashed
                flex flex-col items-center justify-center gap-4 p-8
                cursor-pointer transition-[border-color,background-color] duration-150
                ${
                  isDragActive
                    ? "border-primary bg-primary/10 scale-[0.99]"
                    : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                }
              `}
            >
              <div className="p-4 rounded-full bg-primary/10">
                <UploadIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{t("dropHere")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("supportedFormats")}</p>
              </div>
            </FileDropzone>
          ) : (
            <div
              className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4"
              data-testid="pdf-to-word-file-info"
            >
              <FileType2Icon className="w-8 h-8 text-primary shrink-0" aria-hidden />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" dir="auto">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {formatBytes(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={extracting}
              >
                <RefreshCwIcon className="w-4 h-4 me-1" />
                {t("change")}
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            data-testid="pdf-to-word-change-input"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) void runExtraction(picked);
              // Allow re-selecting the same file twice in a row.
              e.target.value = "";
            }}
          />

          {extracting && (
            <div className="space-y-1 mt-3">
              <Progress value={progress} data-testid="pdf-to-word-progress" />
              <p className="text-xs text-muted-foreground">
                {t("analyzing")} <span dir="ltr">{progress}%</span>
              </p>
            </div>
          )}
        </SettingsCard>

        {stats && result && (
          <StatStrip
            data-testid="pdf-to-word-summary"
            items={[
              { label: t("statPages"), value: result.pageCount },
              { label: t("statHeadings"), value: stats.headings },
              { label: t("statParagraphs"), value: stats.paragraphs },
              { label: t("statLists"), value: stats.lists },
              { label: t("statTables"), value: stats.tables },
            ]}
          />
        )}

        {scannedPages.length > 0 && (
          <div
            className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
            role="note"
            data-testid="pdf-to-word-scanned-notice"
          >
            <InfoIcon className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            <p>
              {t("scannedNotice", { pages: scannedPageNumbers })}{" "}
              <Link href="/tools/image-to-text" className="font-medium underline">
                {t("scannedNoticeLink")}
              </Link>
            </p>
          </div>
        )}

        <SettingsCard title={t("honestyTitle")} data-testid="pdf-to-word-honesty">
          <ul className="list-disc space-y-2 ps-4 text-sm text-muted-foreground">
            <li>{t("honestyDigital")}</li>
            <li>{t("honestyBorderless")}</li>
            <li>{t("honestyMerged")}</li>
            <li>{t("honestyImages")}</li>
            <li>{t("honestyPrivacy")}</li>
          </ul>
        </SettingsCard>
      </div>
    </ToolShell>
  );
}
