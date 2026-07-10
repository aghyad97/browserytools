"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, Plus, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { canvasToBlob } from "@/lib/image/canvas";
import { downloadUrl } from "@/lib/download";

type Alignment = "left" | "center" | "right";

interface TextBox {
  id: string;
  text: string;
  // Position as a fraction (0-1) of the natural image dimensions so layout is
  // resolution-independent across the preview and the exported PNG.
  x: number;
  y: number;
  fontSize: number; // px, relative to natural image height baseline
  color: string;
  strokeWidth: number;
  align: Alignment;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `box-${idCounter}`;
}

function createTextBox(text: string, x: number, y: number): TextBox {
  return {
    id: nextId(),
    text,
    x,
    y,
    fontSize: 48,
    color: "#ffffff",
    strokeWidth: 4,
    align: "center",
  };
}

interface ImageInfo {
  url: string;
  width: number;
  height: number;
  name: string;
}

// Draw a single text box onto a 2D context. Used by both the live preview and
// the export path so what you see matches what you download.
function drawTextBox(
  ctx: CanvasRenderingContext2D,
  box: TextBox,
  canvasWidth: number,
  canvasHeight: number,
) {
  const lines = box.text.split("\n");
  ctx.font = `bold ${box.fontSize}px Impact, "Anton", "Arial Narrow", sans-serif`;
  ctx.textAlign = box.align;
  ctx.textBaseline = "top";
  ctx.fillStyle = box.color;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = box.strokeWidth;
  ctx.lineJoin = "round";

  const px = box.x * canvasWidth;
  const py = box.y * canvasHeight;
  const lineHeight = box.fontSize * 1.1;

  lines.forEach((line, i) => {
    const ly = py + i * lineHeight;
    if (box.strokeWidth > 0) ctx.strokeText(line, px, ly);
    ctx.fillText(line, px, ly);
  });
}

export default function MemeGenerator() {
  const t = useTranslations("Tools.MemeGenerator");
  const tCommon = useTranslations("Common");

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [boxes, setBoxes] = useState<TextBox[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const draggingRef = useRef<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) {
        toast.error(t("imageTooLarge"));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setImage({
            url,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            name: file.name,
          });
          // Seed with the classic top + bottom text boxes.
          const top = createTextBox(t("defaultTop"), 0.5, 0.04);
          const bottom = createTextBox(t("defaultBottom"), 0.5, 0.84);
          setBoxes([top, bottom]);
          setSelectedId(top.id);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    },
    [t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    multiple: false,
  });

  // Keep the loaded image element in sync so the render loop can draw it.
  useEffect(() => {
    if (!image) {
      imgElRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgElRef.current = img;
      renderCanvas();
    };
    img.src = image.url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  // Redraw whenever boxes change.
  useLayoutEffect(() => {
    renderCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes, image]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function renderCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgEl = imgElRef.current;
    if (imgEl) ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    for (const box of boxes) {
      drawTextBox(ctx, box, canvas.width, canvas.height);
    }
  }

  function updateBox(id: string, patch: Partial<TextBox>) {
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }

  function addBox() {
    const box = createTextBox(t("newTextDefault"), 0.5, 0.45);
    setBoxes((prev) => [...prev, box]);
    setSelectedId(box.id);
  }

  function removeBox(id: string) {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }

  // Convert a pointer event on the displayed canvas into image-space fractions.
  function pointerToFraction(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!boxes.length) return;
    const frac = pointerToFraction(e);
    if (!frac) return;
    // Pick the nearest text box to start dragging.
    let nearest: TextBox | null = null;
    let nearestDist = Infinity;
    for (const box of boxes) {
      const dist = Math.hypot(box.x - frac.x, box.y - frac.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = box;
      }
    }
    if (nearest) {
      draggingRef.current = nearest.id;
      setSelectedId(nearest.id);
      canvasRef.current?.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const id = draggingRef.current;
    if (!id) return;
    const frac = pointerToFraction(e);
    if (!frac) return;
    updateBox(id, { x: frac.x, y: frac.y });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (draggingRef.current) {
      canvasRef.current?.releasePointerCapture(e.pointerId);
      draggingRef.current = null;
    }
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    renderCanvas();
    try {
      const blob = await canvasToBlob(canvas, "image/png");
      if (!blob) throw new Error("toBlob returned null");
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const base = image.name.split(".").slice(0, -1).join(".") || "meme";
      downloadUrl(url, `${base}_meme.png`);
      toast.success(t("downloaded"));
    } catch (err) {
      console.error(err);
      toast.error(t("exportFailed"));
    }
  }

  const selected = boxes.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* ── Canvas / upload column ──────────────────────────────── */}
          <div className="space-y-4">
            <Card className="p-6 shadow-none">
              {image ? (
                <div className="space-y-3">
                  <canvas
                    ref={canvasRef}
                    data-testid="meme-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="w-full h-auto rounded-lg border border-border touch-none cursor-move bg-muted"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {t("dragHint")}
                  </p>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`
                    h-72 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-all duration-200
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-1">
                      {t("dropImageHere")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("supportedFormats")}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {image && (
              <Button
                onClick={handleDownload}
                className="w-full"
                disabled={!boxes.length}
              >
                <Download className="w-4 h-4 me-2" />
                {t("downloadMeme")}
              </Button>
            )}
          </div>

          {/* ── Controls column ─────────────────────────────────────── */}
          <div className="space-y-4">
            {!image ? (
              <Card className="p-6 flex flex-col items-center justify-center h-72 text-center">
                <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t("uploadToStart")}</p>
              </Card>
            ) : (
              <>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">{t("textBoxes")}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addBox}
                      data-testid="add-text-box"
                    >
                      <Plus className="w-4 h-4 me-1" />
                      {t("addText")}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {boxes.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {t("noTextBoxes")}
                      </p>
                    )}
                    {boxes.map((box, index) => (
                      <div
                        key={box.id}
                        className={`flex items-center gap-2 rounded-md p-2 transition-colors ${
                          box.id === selectedId
                            ? "bg-primary/10 ring-1 ring-primary"
                            : "bg-muted/50"
                        }`}
                        onClick={() => setSelectedId(box.id)}
                      >
                        <Input
                          aria-label={t("textBoxLabel", { n: index + 1 })}
                          data-testid={`text-input-${index}`}
                          value={box.text}
                          onChange={(e) =>
                            updateBox(box.id, { text: e.target.value })
                          }
                          onFocus={() => setSelectedId(box.id)}
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t("removeText")}
                          data-testid={`remove-text-${index}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBox(box.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {selected && (
                  <Card className="p-4 space-y-4">
                    <h3 className="text-sm font-semibold">{t("styleTitle")}</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          {t("fontSize")}
                        </label>
                        <span
                          className="text-sm text-muted-foreground"
                          dir="ltr"
                        >
                          {selected.fontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[selected.fontSize]}
                        onValueChange={([v]) =>
                          updateBox(selected.id, { fontSize: v })
                        }
                        min={12}
                        max={160}
                        step={1}
                        aria-label={t("fontSize")}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">
                          {t("strokeWidth")}
                        </label>
                        <span
                          className="text-sm text-muted-foreground"
                          dir="ltr"
                        >
                          {selected.strokeWidth}px
                        </span>
                      </div>
                      <Slider
                        value={[selected.strokeWidth]}
                        onValueChange={([v]) =>
                          updateBox(selected.id, { strokeWidth: v })
                        }
                        min={0}
                        max={20}
                        step={1}
                        aria-label={t("strokeWidth")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("textColor")}
                        </label>
                        <input
                          type="color"
                          aria-label={t("textColor")}
                          data-testid="text-color"
                          value={selected.color}
                          onChange={(e) =>
                            updateBox(selected.id, { color: e.target.value })
                          }
                          className="h-9 w-full rounded-md border border-input bg-background cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("alignment")}
                        </label>
                        <Select
                          value={selected.align}
                          onValueChange={(v) =>
                            updateBox(selected.id, { align: v as Alignment })
                          }
                        >
                          <SelectTrigger aria-label={t("alignment")}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">{t("alignLeft")}</SelectItem>
                            <SelectItem value="center">
                              {t("alignCenter")}
                            </SelectItem>
                            <SelectItem value="right">
                              {t("alignRight")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setImage(null);
                    setBoxes([]);
                    setSelectedId(null);
                  }}
                >
                  {tCommon("reset")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
