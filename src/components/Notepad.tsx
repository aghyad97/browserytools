"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "browserytools-notepad";

export default function Notepad() {
  const t = useTranslations("Tools.Notepad");
  const tCommon = useTranslations("Common");
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

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notepad-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloadedTxt"));
  };

  const handleClear = () => {
    setText("");
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    toast.success(t("notepadCleared"));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("description")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text}>
              <Copy className="w-4 h-4 me-1.5" /> {tCommon("copy")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!text}>
              <Download className="w-4 h-4 me-1.5" /> {tCommon("download")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={!text}>
              <Trash2 className="w-4 h-4 me-1.5" /> {tCommon("clear")}
            </Button>
          </div>
        </div>

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
    </div>
  );
}
