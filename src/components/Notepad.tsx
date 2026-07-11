"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { downloadBlob } from "@/lib/download";

const STORAGE_KEY = "browserytools-notepad";

export default function Notepad() {
  const t = useTranslations("Tools.Notepad");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");
  const [text, setText] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setText(saved);
    } catch {}
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, text);
        setLastSaved(new Date());
      } catch {}
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split("\n").length : 0;

  const handleDownload = () => {
    if (!text) return;
    downloadBlob(new Blob([text], { type: "text/plain" }), `notepad-${Date.now()}.txt`);
    toast.success(t("downloadedTxt"));
  };

  const handleClear = () => {
    setText("");
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    toast.success(t("notepadCleared"));
  };

  return (
    <ToolShell
      slug="notepad"
      title={tc("tools.notepad.name")}
      sub={tc("tools.notepad.description")}
      controls={
        <>
          <CopyButton
            text={text}
            successMessage={t("copiedToClipboard")}
            errorMessage={t("failedToCopy")}
            disabled={!text}
          />
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!text}>
            <Download className="w-4 h-4 me-1.5" /> {tCommon("download")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!text}>
            <Trash2 className="w-4 h-4 me-1.5" /> {tCommon("clear")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("placeholder")}
              className="min-h-[65vh] resize-none font-mono text-sm border-0 focus-visible:ring-0 p-0"
              aria-label="Notepad"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="flex gap-4">
            <span>{wordCount} {t("words")}</span>
            <span>{charCount} {t("characters")}</span>
            <span>{lineCount} {t("lines")}</span>
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && (
              <Badge variant="outline" className="text-xs font-normal">
                {t("saved")} {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs font-normal">
              {t("autoSavesLocally")}
            </Badge>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
