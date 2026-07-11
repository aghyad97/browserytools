"use client";

import { useCallback, useState } from "react";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { downloadDataUrl } from "@/lib/download";

export default function SvgPngConverter() {
  const t = useTranslations("Tools.SvgPngConverter");
  const tc = useTranslations("ToolsConfig");
  const [svgText, setSvgText] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error(t("errorSvgOnly"));
      return;
    }
    const text = await file.text();
    setSvgText(text);
  }, []);

  const exportPng = async (mult: number) => {
    if (!svgText) return;
    try {
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;
      await new Promise((res, rej) => {
        img.onload = () => res(null);
        img.onerror = rej;
      });
      const width = img.width * mult;
      const height = img.height * mult;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context error");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      downloadDataUrl(dataUrl, `export-${mult}x.png`);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(t("errorExportFailed"));
    }
  };

  return (
    <ToolShell
      slug="svg-png"
      title={tc("tools.svg-png.name")}
      sub={tc("tools.svg-png.description")}
    >
      <div className="space-y-4">
        <FileDropzone
          onFiles={onDrop}
          accept={{ "image/svg+xml": [".svg"] }}
          multiple={false}
          className={({ isDragActive }) =>
            `h-48 rounded-lg border-2 border-dashed flex items-center justify-center p-6 cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground hover:border-primary"
            }`
          }
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="font-medium">
              {t("dropOrClick")}
            </div>
          </div>
        </FileDropzone>
        <textarea
          value={svgText}
          onChange={(e) => setSvgText(e.target.value)}
          placeholder={t("svgPlaceholder")}
          className="w-full min-h-[200px] border rounded p-3 font-mono text-sm"
          dir="ltr"
        />
        <div className="grid grid-cols-3 gap-3">
          <Button onClick={() => exportPng(1)} disabled={!svgText}>
            {t("export1x")}
          </Button>
          <Button
            onClick={() => exportPng(2)}
            disabled={!svgText}
            variant="secondary"
          >
            {t("export2x")}
          </Button>
          <Button
            onClick={() => exportPng(3)}
            disabled={!svgText}
            variant="secondary"
          >
            {t("export3x")}
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
