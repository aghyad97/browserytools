"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { CopyButton } from "@/components/shared/CopyButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Pipette, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PickedColor {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
}

function toHex(r: number, g: number, b: number): string {
  return (
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function makeColor(r: number, g: number, b: number): PickedColor {
  const { h, s, l } = rgbToHsl(r, g, b);
  return {
    hex: toHex(r, g, b),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    r,
    g,
    b,
  };
}

function getReadableText(r: number, g: number, b: number): string {
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return lum > 0.179 ? "#000000" : "#FFFFFF";
}

// Extract a small dominant-color palette by quantizing pixels into coarse
// RGB buckets and picking the most populated buckets.
function extractPalette(
  data: Uint8ClampedArray,
  count = 6,
): PickedColor[] {
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  // Sample at most ~20k pixels for speed.
  const step = Math.max(4, Math.floor((data.length / 4 / 20000)) * 4);
  for (let i = 0; i < data.length; i += step * 4) {
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent pixels
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const e = buckets.get(key);
    if (e) {
      e.r += r;
      e.g += g;
      e.b += b;
      e.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }
  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((e) =>
      makeColor(
        Math.round(e.r / e.n),
        Math.round(e.g / e.n),
        Math.round(e.b / e.n),
      ),
    );
}

const LOUPE_SIZE = 96; // px
const LOUPE_ZOOM = 8;

export default function ImageColorPicker() {
  const t = useTranslations("Tools.ImageColorPicker");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loupeRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  // Keep the latest translator in a ref so the draw effect can use it for error
  // messages without listing `t` as a dependency (the next-intl translator has a
  // new identity each render, which would otherwise re-run the effect and wipe
  // the user's picked color).
  const tRef = useRef(t);
  tRef.current = t;

  const [hasImage, setHasImage] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number; color: PickedColor } | null>(
    null,
  );
  const [picked, setPicked] = useState<PickedColor | null>(null);
  const [palette, setPalette] = useState<PickedColor[]>([]);
  const [history, setHistory] = useState<PickedColor[]>([]);
  const [src, setSrc] = useState<string | null>(null);

  // Draw the image onto the canvas once both the source and the canvas element
  // are available. The canvas is always mounted, so canvasRef is never null.
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Cap rendered size to keep getImageData fast while preserving aspect.
      const maxW = 900;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctxRef.current = ctx;
      setHasImage(true);
      setHover(null);
      setPicked(null);
      try {
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setPalette(extractPalette(data));
      } catch {
        setPalette([]);
      }
    };
    img.onerror = () => toast.error(tRef.current("loadFailed"));
    img.src = src;
  }, [src]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result as string);
      reader.onerror = () => toast.error(t("loadFailed"));
      reader.readAsDataURL(file);
    },
    [t],
  );

  const IMAGE_ACCEPT = {
    "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"],
  } as const;

  const colorAt = useCallback((x: number, y: number): PickedColor | null => {
    const ctx = ctxRef.current;
    if (!ctx) return null;
    try {
      const { data } = ctx.getImageData(x, y, 1, 1);
      return makeColor(data[0], data[1], data[2]);
    } catch {
      return null;
    }
  }, []);

  const eventToPixel = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    // Fall back to a 1:1 mapping when the displayed size is unavailable.
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
    return { x, y };
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!hasImage) return;
      const px = eventToPixel(e);
      if (!px) return;
      const color = colorAt(px.x, px.y);
      if (!color) return;
      setHover({ x: px.x, y: px.y, color });

      // Render magnified loupe preview.
      const src = canvasRef.current;
      const loupe = loupeRef.current;
      if (!src || !loupe) return;
      const lctx = loupe.getContext("2d");
      if (!lctx) return;
      const region = LOUPE_SIZE / LOUPE_ZOOM;
      lctx.imageSmoothingEnabled = false;
      lctx.clearRect(0, 0, LOUPE_SIZE, LOUPE_SIZE);
      lctx.drawImage(
        src,
        px.x - region / 2,
        px.y - region / 2,
        region,
        region,
        0,
        0,
        LOUPE_SIZE,
        LOUPE_SIZE,
      );
    },
    [hasImage, eventToPixel, colorAt],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!hasImage) return;
      const px = eventToPixel(e);
      if (!px) return;
      const color = colorAt(px.x, px.y);
      if (!color) return;
      setPicked(color);
      setHistory((prev) =>
        [color, ...prev.filter((c) => c.hex !== color.hex)].slice(0, 18),
      );
    },
    [hasImage, eventToPixel, colorAt],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(t("copied", { value: text }));
      } catch {
        toast.error(t("copyFailed"));
      }
    },
    [t],
  );

  useEffect(() => {
    return () => {
      ctxRef.current = null;
    };
  }, []);

  const current = picked ?? hover?.color ?? null;

  return (
    <ToolShell
      slug="image-color-picker"
      title={tc("tools.image-color-picker.name")}
      sub={tc("tools.image-color-picker.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: canvas / dropzone */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              {!src ? (
                <FileDropzone
                  onFiles={onDrop}
                  accept={IMAGE_ACCEPT}
                  multiple={false}
                  inputProps={{ "data-testid": "image-input" }}
                  className={({ isDragActive }) =>
                    `h-72 rounded-lg border-2 border-dashed flex flex-col items-center justify-center space-y-4 p-8 cursor-pointer transition-[border-color,background-color] duration-150 ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }`
                  }
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {t("dropImageHere")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </FileDropzone>
              ) : (
                <div className="space-y-3">
                  <div className="relative inline-block max-w-full">
                    <canvas
                      ref={canvasRef}
                      data-testid="picker-canvas"
                      onMouseMove={handleMove}
                      onMouseLeave={() => setHover(null)}
                      onClick={handleClick}
                      className="max-w-full h-auto rounded-lg border cursor-crosshair"
                    />
                    {hover && (
                      <div
                        className="pointer-events-none absolute z-10 rounded-lg border-2 border-white shadow-lg overflow-hidden"
                        style={{
                          width: LOUPE_SIZE,
                          height: LOUPE_SIZE,
                          insetInlineStart: 8,
                          top: 8,
                        }}
                      >
                        <canvas
                          ref={loupeRef}
                          width={LOUPE_SIZE}
                          height={LOUPE_SIZE}
                        />
                        <div
                          className="absolute bottom-0 inset-x-0 text-center text-[10px] py-0.5"
                          dir="ltr"
                          style={{
                            backgroundColor: hover.color.hex,
                            color: getReadableText(
                              hover.color.r,
                              hover.color.g,
                              hover.color.b,
                            ),
                          }}
                        >
                          {hover.color.hex}
                        </div>
                      </div>
                    )}
                  </div>
                  <FileDropzone
                    onFiles={onDrop}
                    accept={IMAGE_ACCEPT}
                    multiple={false}
                    className={() => "inline-block"}
                  >
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 me-2" />
                        {t("changeImage")}
                      </span>
                    </Button>
                  </FileDropzone>
                </div>
              )}
            </Card>

            {palette.length > 0 && (
              <Card className="p-4 space-y-3 shadow-none">
                <Label>{t("dominantColors")}</Label>
                <div className="grid grid-cols-6 gap-2">
                  {palette.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.hex}
                      onClick={() => copy(c.hex)}
                      className="h-12 rounded-md border text-[9px] flex items-end justify-center pb-0.5 transition-transform hover:scale-105"
                      dir="ltr"
                      style={{
                        backgroundColor: c.hex,
                        color: getReadableText(c.r, c.g, c.b),
                      }}
                    >
                      {c.hex}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right: picked color details + history */}
          <div className="space-y-4">
            <Card className="p-6 space-y-4 shadow-none">
              <div className="flex items-center gap-2">
                <Pipette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{t("pickedColor")}</h2>
              </div>

              {current ? (
                <>
                  <div
                    className="h-24 rounded-lg border"
                    style={{ backgroundColor: current.hex }}
                  />
                  <div className="space-y-2">
                    {(
                      [
                        ["HEX", current.hex],
                        ["RGB", current.rgb],
                        ["HSL", current.hsl],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="w-12 text-sm font-medium text-muted-foreground">
                          {label}
                        </span>
                        <code
                          dir="ltr"
                          data-testid={`value-${label.toLowerCase()}`}
                          className="flex-1 text-sm bg-muted rounded px-2 py-1.5 overflow-auto"
                        >
                          {value}
                        </code>
                        <CopyButton
                          text={value}
                          label={t("copyLabel", { label })}
                          successMessage={t("copied", { value })}
                          errorMessage={t("copyFailed")}
                          size="icon"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("pickHint")}
                </p>
              )}
            </Card>

            {history.length > 0 && (
              <Card className="p-4 space-y-3 shadow-none">
                <div className="flex items-center justify-between">
                  <Label>{t("history")}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setHistory([])}
                  >
                    <Trash2 className="w-4 h-4 me-2" />
                    {tCommon("clear")}
                  </Button>
                </div>
                <div className="grid grid-cols-9 gap-2">
                  {history.map((c, i) => (
                    <button
                      key={`${c.hex}-${i}`}
                      type="button"
                      title={c.hex}
                      onClick={() => setPicked(c)}
                      className="aspect-square rounded-md border transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>
      </div>
    </ToolShell>
  );
}
