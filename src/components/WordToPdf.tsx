"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { UploadIcon, FileTypeIcon, RefreshCwIcon, Loader2Icon } from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import { docxToHtml, type DocxParseResult } from "@/lib/docx/parse";

const DOCX_ACCEPT = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

/** Body class the print CSS keys off (src/app/globals.css) to hide the site
 * chrome (rail, top bar, crumb, related tiles, SEO content) around the
 * preview for the duration of window.print(). Same pattern as
 * BingoCardGenerator's "bt-print-cards-only". */
const PRINT_CLASS = "bt-print-word-doc";

export default function WordToPdf() {
  const t = useTranslations("Tools.WordToPdf");
  const tc = useTranslations("ToolsConfig");

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<DocxParseResult | null>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reads + converts a freshly (re)selected .docx. Used for both the initial
  // drop and the "Change" re-selection path, so file swaps never leave stale
  // derived state (result/sanitizedHtml are cleared synchronously, before the
  // async parse — same guard PdfToWord uses for extraction).
  const runParse = useCallback(
    async (picked: File) => {
      setFile(picked);
      setResult(null);
      setSanitizedHtml("");
      setParsing(true);
      try {
        const parsed = await docxToHtml(picked);
        setResult(parsed);
        // mammoth's output is derived from an untrusted uploaded file, so it
        // is never injected raw — sanitize before it ever reaches the DOM.
        setSanitizedHtml(DOMPurify.sanitize(parsed.html));
      } catch (err) {
        console.error(err);
        toast.error(t("parseFailed"));
      } finally {
        setParsing(false);
      }
    },
    [t],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const picked = accepted[0];
      if (picked) void runParse(picked);
    },
    [runParse],
  );

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined" || !sanitizedHtml) return;
    const { body } = document;
    body.classList.add(PRINT_CLASS);
    const cleanup = () => {
      body.classList.remove(PRINT_CLASS);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }, [sanitizedHtml]);

  // Belt-and-suspenders: never leave the print class stuck on the body if the
  // component unmounts mid-print (e.g. the user navigates away).
  useEffect(() => {
    return () => {
      document.body.classList.remove(PRINT_CLASS);
    };
  }, []);

  const messages = result?.messages ?? [];

  return (
    <ToolShell
      slug="word-to-pdf"
      title={tc("tools.word-to-pdf.name")}
      sub={tc("tools.word-to-pdf.description")}
      primaryAction={{
        label: t("print"),
        onClick: handlePrint,
        disabled: !sanitizedHtml || parsing,
      }}
    >
      <div className="space-y-4">
        <SettingsCard className="print:hidden">
          {!file ? (
            <FileDropzone
              onFiles={onDrop}
              accept={DOCX_ACCEPT}
              multiple={false}
              inputProps={{ "data-testid": "word-to-pdf-input" }}
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
              data-testid="word-to-pdf-file-info"
            >
              <FileTypeIcon className="w-8 h-8 text-primary shrink-0" aria-hidden />
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
                disabled={parsing}
              >
                <RefreshCwIcon className="w-4 h-4 me-1" />
                {t("change")}
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            data-testid="word-to-pdf-change-input"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) void runParse(picked);
              // Allow re-selecting the same file twice in a row.
              e.target.value = "";
            }}
          />

          {parsing && (
            <div
              className="flex items-center gap-2 mt-3 text-sm text-muted-foreground"
              data-testid="word-to-pdf-parsing"
            >
              <Loader2Icon className="w-4 h-4 animate-spin" aria-hidden />
              {t("parsing")}
            </div>
          )}
        </SettingsCard>

        {messages.length > 0 && (
          <SettingsCard
            title={t("warningsTitle")}
            className="print:hidden"
            data-testid="word-to-pdf-warnings"
          >
            <p className="text-sm text-muted-foreground mb-2">{t("warningsIntro")}</p>
            <ul className="list-disc space-y-1 ps-4 text-sm text-muted-foreground">
              {messages.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          </SettingsCard>
        )}

        {sanitizedHtml && (
          <SettingsCard title={t("previewTitle")} data-testid="word-to-pdf-preview-card">
            <div
              className="prose dark:prose-invert max-w-none prose-img:max-w-full"
              data-testid="word-to-pdf-preview"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized above via DOMPurify before this ever reaches state.
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </SettingsCard>
        )}

        <SettingsCard
          title={t("honestyTitle")}
          className="print:hidden"
          data-testid="word-to-pdf-honesty"
        >
          <ul className="list-disc space-y-2 ps-4 text-sm text-muted-foreground">
            <li>{t("honestyNormalized")}</li>
            <li>{t("honestyComplex")}</li>
            <li>{t("honestyImages")}</li>
            <li>{t("honestyPrint")}</li>
            <li>{t("honestyPrivacy")}</li>
          </ul>
        </SettingsCard>
      </div>
    </ToolShell>
  );
}
