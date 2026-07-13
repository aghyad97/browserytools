"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ShieldCheck, MapPin, Camera, Clock, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";
import { formatBytes } from "@/lib/format";

interface ExifEntry {
  label: string;
  value: string;
}

interface ExifGroups {
  camera: ExifEntry[];
  settings: ExifEntry[];
  datetime: ExifEntry[];
  gps: ExifEntry[];
}

// ── EXIF parsing (same approach as ExifViewer) ────────────────────────────────
function readUint16(view: DataView, offset: number, le: boolean): number {
  return view.getUint16(offset, le);
}
function readUint32(view: DataView, offset: number, le: boolean): number {
  return view.getUint32(offset, le);
}
function readRational(view: DataView, offset: number, le: boolean): number {
  const num = readUint32(view, offset, le);
  const den = readUint32(view, offset + 4, le);
  return den !== 0 ? num / den : 0;
}
function readSignedRational(view: DataView, offset: number, le: boolean): number {
  const num = view.getInt32(offset, le);
  const den = view.getInt32(offset + 4, le);
  return den !== 0 ? num / den : 0;
}
function readAscii(view: DataView, offset: number, count: number): string {
  let str = "";
  for (let i = 0; i < count - 1; i++) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str.trim();
}

function readValue(view: DataView, type: number, count: number, valueOrOffset: number, le: boolean): string {
  const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8];
  const sz = typeSize[type] ?? 1;
  const total = sz * count;
  const offset = total <= 4 ? -1 : valueOrOffset;
  const getU8 = (o: number) => (total <= 4 ? (valueOrOffset >> (8 * o)) & 0xff : view.getUint8(offset + o));

  if (type === 2) {
    if (total <= 4) {
      let s = "";
      for (let i = 0; i < count; i++) { const c = getU8(i); if (c === 0) break; s += String.fromCharCode(c); }
      return s.trim();
    }
    return readAscii(view, offset, count);
  }
  if (type === 3) {
    if (total <= 4) return String(le ? (valueOrOffset & 0xffff) : ((valueOrOffset >> 16) & 0xffff));
    const vals: number[] = [];
    for (let i = 0; i < Math.min(count, 4); i++) vals.push(view.getUint16(offset + i * 2, le));
    return vals.join(", ");
  }
  if (type === 4) {
    if (total <= 4) return String(valueOrOffset);
    return String(readUint32(view, offset, le));
  }
  if (type === 5) {
    if (count === 1) return readRational(view, offset, le).toFixed(4);
    const vals: string[] = [];
    for (let i = 0; i < Math.min(count, 3); i++) vals.push(readRational(view, offset + i * 8, le).toFixed(4));
    return vals.join(", ");
  }
  if (type === 10) {
    return readSignedRational(view, offset, le).toFixed(4);
  }
  if (type === 9) {
    if (total <= 4) return String(view.getInt32(0, le));
    return String(view.getInt32(offset, le));
  }
  return "[binary]";
}

const ORIENTATION_MAP: Record<number, string> = {
  1: "Normal", 2: "Mirrored", 3: "Rotated 180°", 6: "Rotated 90° CW", 8: "Rotated 90° CCW",
};

function parseExif(buffer: ArrayBuffer): ExifGroups {
  const groups: ExifGroups = { camera: [], settings: [], datetime: [], gps: [] };
  const bytes = new Uint8Array(buffer);

  let exifStart = -1;
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 0xFF && bytes[i + 1] === 0xE1) { exifStart = i + 4; break; }
  }
  if (exifStart < 0) return groups;

  const exifHeader = String.fromCharCode(bytes[exifStart], bytes[exifStart + 1], bytes[exifStart + 2], bytes[exifStart + 3]);
  if (exifHeader !== "Exif") return groups;

  const tiffBase = exifStart + 6;
  const view = new DataView(buffer, tiffBase);
  const byteOrder = view.getUint16(0, false);
  const le = byteOrder === 0x4949;
  const ifd0Offset = readUint32(view, 4, le);

  function parseIFD(offset: number) {
    try {
      const count = readUint16(view, offset, le);
      for (let i = 0; i < count; i++) {
        const entryOffset = offset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;
        const tag = readUint16(view, entryOffset, le);
        const type = readUint16(view, entryOffset + 2, le);
        const cnt = readUint32(view, entryOffset + 4, le);
        const valOff = readUint32(view, entryOffset + 8, le);
        const raw = readValue(view, type, cnt, valOff, le);

        switch (tag) {
          case 0x010F: groups.camera.push({ label: "Make", value: raw }); break;
          case 0x0110: groups.camera.push({ label: "Model", value: raw }); break;
          case 0x0112: groups.camera.push({ label: "Orientation", value: ORIENTATION_MAP[parseInt(raw)] ?? raw }); break;
          case 0x0131: groups.camera.push({ label: "Software", value: raw }); break;
          case 0x013B: groups.camera.push({ label: "Artist", value: raw }); break;
          case 0x0132: groups.datetime.push({ label: "Date Modified", value: raw }); break;
          case 0x8769: {
            const subOffset = valOff;
            const subCount = readUint16(view, subOffset, le);
            for (let j = 0; j < subCount; j++) {
              const sEntry = subOffset + 2 + j * 12;
              if (sEntry + 12 > view.byteLength) break;
              const sTag = readUint16(view, sEntry, le);
              const sType = readUint16(view, sEntry + 2, le);
              const sCnt = readUint32(view, sEntry + 4, le);
              const sValOff = readUint32(view, sEntry + 8, le);
              const sRaw = readValue(view, sType, sCnt, sValOff, le);
              switch (sTag) {
                case 0x829A: {
                  const v = parseFloat(sRaw);
                  groups.settings.push({ label: "Exposure Time", value: v < 1 && v > 0 ? `1/${Math.round(1 / v)}s` : `${v}s` });
                  break;
                }
                case 0x829D: groups.settings.push({ label: "F-Number (Aperture)", value: `f/${parseFloat(sRaw).toFixed(1)}` }); break;
                case 0x8827: groups.settings.push({ label: "ISO Speed", value: sRaw }); break;
                case 0x9003: groups.datetime.push({ label: "Date Taken", value: sRaw }); break;
                case 0x9004: groups.datetime.push({ label: "Date Digitized", value: sRaw }); break;
                case 0x920A: groups.settings.push({ label: "Focal Length", value: `${parseFloat(sRaw).toFixed(1)} mm` }); break;
              }
            }
            break;
          }
          case 0x8825: {
            const gpsOffset = valOff;
            const gpsCount = readUint16(view, gpsOffset, le);
            for (let j = 0; j < gpsCount; j++) {
              const gEntry = gpsOffset + 2 + j * 12;
              if (gEntry + 12 > view.byteLength) break;
              const gTag = readUint16(view, gEntry, le);
              const gType = readUint16(view, gEntry + 2, le);
              const gCnt = readUint32(view, gEntry + 4, le);
              const gValOff = readUint32(view, gEntry + 8, le);
              const gRaw = readValue(view, gType, gCnt, gValOff, le);
              switch (gTag) {
                case 0x0001: groups.gps.push({ label: "GPS Latitude Ref", value: gRaw }); break;
                case 0x0002: {
                  const nums = gRaw.split(", ").map(Number);
                  if (nums.length >= 3) groups.gps.push({ label: "GPS Latitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
                  break;
                }
                case 0x0003: groups.gps.push({ label: "GPS Longitude Ref", value: gRaw }); break;
                case 0x0004: {
                  const nums = gRaw.split(", ").map(Number);
                  if (nums.length >= 3) groups.gps.push({ label: "GPS Longitude", value: `${nums[0]}° ${nums[1]}' ${nums[2].toFixed(4)}"` });
                  break;
                }
                case 0x0006: groups.gps.push({ label: "GPS Altitude", value: `${parseFloat(gRaw).toFixed(1)} m` }); break;
              }
            }
            break;
          }
        }
      }
    } catch {
      // malformed IFD — ignore
    }
  }

  parseIFD(ifd0Offset);
  return groups;
}

function countEntries(g: ExifGroups): number {
  return g.camera.length + g.settings.length + g.datetime.length + g.gps.length;
}

interface ProcessedImage {
  id: string;
  name: string;
  originalSize: number;
  cleanedSize: number;
  width: number;
  height: number;
  hadMetadata: boolean;
  hadGps: boolean;
  groups: ExifGroups;
  previewSrc: string;
  cleanedUrl: string;
}

export default function ExifRemover() {
  const t = useTranslations("Tools.ExifRemover");
  const tc = useTranslations("ToolsConfig");
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const processFile = useCallback((file: File): Promise<ProcessedImage | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        let groups: ExifGroups = { camera: [], settings: [], datetime: [], gps: [] };
        try {
          if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) {
            groups = parseExif(arrayBuffer);
          }
        } catch {
          // ignore parse errors — proceed to strip anyway
        }

        const objUrl = URL.createObjectURL(file);
        urlsRef.current.push(objUrl);

        const img = new Image();
        img.onload = async () => {
          // Re-encode through canvas: this drops ALL metadata.
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);

          // Preserve original format where possible; PNG has no quality arg.
          const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const blob = await canvasToBlob(canvas, outType, outType === "image/jpeg" ? 0.92 : undefined);
          if (!blob) {
            resolve(null);
            return;
          }
          const cleanedUrl = URL.createObjectURL(blob);
          urlsRef.current.push(cleanedUrl);

          resolve({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            originalSize: file.size,
            cleanedSize: blob.size,
            width: canvas.width,
            height: canvas.height,
            hadMetadata: countEntries(groups) > 0,
            hadGps: groups.gps.length > 0,
            groups,
            previewSrc: objUrl,
            cleanedUrl,
          });
        };
        img.onerror = () => resolve(null);
        img.src = objUrl;
      };
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    const imageFiles = list.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error(t("uploadError"));
      return;
    }

    setProcessing(true);
    try {
      const results = await Promise.all(imageFiles.map((f) => processFile(f)));
      const valid = results.filter((r): r is ProcessedImage => r !== null);
      if (valid.length === 0) {
        toast.error(t("processError"));
        return;
      }
      setImages((prev) => [...prev, ...valid]);
      toast.success(t("cleanedToast", { count: valid.length }));
    } finally {
      setProcessing(false);
    }
  }, [processFile, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const downloadImage = useCallback((img: ProcessedImage) => {
    const ext = img.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
    const base = img.name.replace(/\.[^.]+$/, "");
    downloadUrl(img.cleanedUrl, `${base}_clean.${ext}`);
    toast.success(t("downloadedToast"));
  }, [t]);

  const downloadAll = useCallback(() => {
    images.forEach((img) => {
      const ext = img.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
      const base = img.name.replace(/\.[^.]+$/, "");
      downloadUrl(img.cleanedUrl, `${base}_clean.${ext}`);
    });
    toast.success(t("downloadedToast"));
  }, [images, t]);

  const reset = useCallback(() => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];
    setImages([]);
  }, []);

  return (
    <ToolShell
      slug="exif-remover"
      title={tc("tools.exif-remover.name")}
      sub={tc("tools.exif-remover.description")}
    >
      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{t("privacyNote")}</p>
          </CardContent>
        </Card>

        <Card
          className="border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="pt-10 pb-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{t("dropPhoto")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("batchHint")}</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              data-testid="exif-file-input"
              onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
            />
          </CardContent>
        </Card>

        {processing && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-muted-foreground animate-pulse">{t("processing")}</p>
            </CardContent>
          </Card>
        )}

        {images.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Badge variant="outline">{t("imagesCount", { count: images.length })}</Badge>
            <div className="flex gap-2">
              {images.length > 1 && (
                <Button size="sm" onClick={downloadAll}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadAll")}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={reset}>
                {t("clearAll")}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {images.map((img) => (
            <Card key={img.id} data-testid="exif-result">
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-medium break-all" dir="ltr">{img.name}</span>
                  {img.hadGps ? (
                    <Badge variant="destructive" className="gap-1">
                      <MapPin className="w-3 h-3" /> {t("gpsBadge")}
                    </Badge>
                  ) : img.hadMetadata ? (
                    // content value: amber = "metadata present" warning status; no semantic warning token in this monochrome design system
                    <Badge className="gap-1 bg-amber-500 text-white">
                      <AlertTriangle className="w-3 h-3" /> {t("metadataBadge")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t("noMetadataBadge")}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("beforeLabel")}</h3>
                      <span className="text-xs text-muted-foreground" dir="ltr">{formatBytes(img.originalSize)}</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.previewSrc} alt={t("beforeLabel")} className="w-full max-h-48 object-contain rounded-md border" />
                    {img.hadMetadata ? (
                      <div className="rounded-lg border overflow-hidden text-sm" data-testid="detected-metadata">
                        {img.groups.gps.length > 0 && (
                          <MetaRow icon={<MapPin className="w-3.5 h-3.5" />} label={t("gpsSection")} value={img.groups.gps.map((e) => e.value).join("  ")} highlight />
                        )}
                        {img.groups.camera.length > 0 && (
                          <MetaRow icon={<Camera className="w-3.5 h-3.5" />} label={t("cameraSection")} value={img.groups.camera.map((e) => e.value).join(", ")} />
                        )}
                        {img.groups.datetime.length > 0 && (
                          <MetaRow icon={<Clock className="w-3.5 h-3.5" />} label={t("datetimeSection")} value={img.groups.datetime.map((e) => e.value).join(", ")} />
                        )}
                        {img.groups.settings.length > 0 && (
                          <MetaRow label={t("settingsSection")} value={img.groups.settings.map((e) => e.value).join(", ")} />
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">{t("noMetadataDetected")}</p>
                    )}
                  </div>

                  {/* After */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("afterLabel")}</h3>
                      <span className="text-xs text-muted-foreground" dir="ltr">{formatBytes(img.cleanedSize)}</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.cleanedUrl} alt={t("afterLabel")} className="w-full max-h-48 object-contain rounded-md border" />
                    {/* content value: green = "cleaned/success" status callout; no semantic success token in this monochrome design system */}
                    <div className="rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2 text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {t("cleanedDescription")}
                    </div>
                    <Button className="w-full" size="sm" onClick={() => downloadImage(img)} data-testid="download-clean">
                      <Download className="w-4 h-4 me-2" />
                      {t("downloadClean")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

function MetaRow({ icon, label, value, highlight }: { icon?: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-start gap-3 px-3 py-2 ${highlight ? "bg-destructive/10" : "bg-muted/20"}`}>
      <span className="flex items-center gap-1.5 font-medium text-muted-foreground min-w-[88px] shrink-0">
        {icon} {label}
      </span>
      <span className="break-all" dir="ltr">{value}</span>
    </div>
  );
}
