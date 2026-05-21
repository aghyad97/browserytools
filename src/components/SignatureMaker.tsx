"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Trash2, Undo2, PenLine } from "lucide-react";
import { toast } from "sonner";

// A single freehand stroke is a list of points captured between pointerdown and pointerup.
interface Point {
  x: number;
  y: number;
}
type Stroke = {
  points: Point[];
  color: string;
  width: number;
};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 220;

// Handwriting-style fonts. We rely on web-safe cursive/serif families plus the
// generic `cursive` fallback so a signature look is available without bundling fonts.
const TYPE_FONTS = [
  { value: "'Brush Script MT', cursive", label: "Brush Script" },
  { value: "'Segoe Script', 'Bradley Hand', cursive", label: "Segoe Script" },
  { value: "'Snell Roundhand', 'Apple Chancery', cursive", label: "Snell Roundhand" },
  { value: "'Lucida Handwriting', cursive", label: "Lucida Handwriting" },
  { value: "Georgia, 'Times New Roman', serif", label: "Elegant Serif" },
  { value: "cursive", label: "Cursive" },
];

// Promise wrapper around canvas.toBlob.
function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

// Trigger a browser download for an object URL.
function downloadUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function SignatureMaker() {
  const t = useTranslations("Tools.SignatureMaker");
  const tCommon = useTranslations("Common");

  // ── Draw mode ────────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#1d4ed8");
  const [penWidth, setPenWidth] = useState(3);

  // ── Type mode ────────────────────────────────────────────────────────────
  const [typedName, setTypedName] = useState("");
  const [typeFont, setTypeFont] = useState(TYPE_FONTS[0].value);
  const [typeColor, setTypeColor] = useState("#1d4ed8");
  const [typeSize, setTypeSize] = useState(64);

  // Draw all committed strokes (plus an optional in-progress one) onto the canvas
  // over a transparent background, with smooth quadratic-curve interpolation.
  const renderStrokes = useCallback(
    (extra?: Stroke | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const all = extra ? [...strokes, extra] : strokes;
      for (const stroke of all) {
        const pts = stroke.points;
        if (pts.length === 0) continue;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        if (pts.length === 1) {
          // A single tap renders as a dot.
          ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
        } else {
          for (let i = 1; i < pts.length - 1; i++) {
            const midX = (pts[i].x + pts[i + 1].x) / 2;
            const midY = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);
        }
        ctx.stroke();
      }
    },
    [strokes],
  );

  useEffect(() => {
    renderStrokes();
  }, [renderStrokes]);

  // Translate a pointer event into canvas coordinate space, accounting for the
  // CSS-vs-backing-store size difference.
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      points: [getPoint(e)],
      color: penColor,
      width: penWidth,
    };
    currentStroke.current = stroke;
    setIsDrawing(true);
    renderStrokes(stroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke.current) return;
    e.preventDefault();
    currentStroke.current.points.push(getPoint(e));
    renderStrokes(currentStroke.current);
  };

  const handlePointerUp = () => {
    if (!currentStroke.current) return;
    setStrokes((prev) => [...prev, currentStroke.current!]);
    currentStroke.current = null;
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    currentStroke.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Export the drawn signature as a transparent PNG.
  const handleExportDraw = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) {
      toast.error(t("nothingToExport"));
      return;
    }
    const blob = await canvasToBlob(canvas);
    if (!blob) {
      toast.error(t("exportFailed"));
      return;
    }
    const url = URL.createObjectURL(blob);
    downloadUrl(url, "signature.png");
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  // Export the drawn signature as an SVG (one <polyline> per stroke).
  const handleExportSvg = () => {
    if (strokes.length === 0) {
      toast.error(t("nothingToExport"));
      return;
    }
    const polylines = strokes
      .map((s) => {
        const pts = s.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join("\n  ");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">\n  ${polylines}\n</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, "signature.svg");
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  // Render the typed name to an offscreen canvas with a transparent background
  // and export it as a PNG.
  const handleExportType = async () => {
    if (!typedName.trim()) {
      toast.error(t("enterName"));
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error(t("exportFailed"));
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = typeColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${typeSize}px ${typeFont}`;
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

    const blob = await canvasToBlob(canvas);
    if (!blob) {
      toast.error(t("exportFailed"));
      return;
    }
    const url = URL.createObjectURL(blob);
    downloadUrl(url, "signature.png");
    URL.revokeObjectURL(url);
    toast.success(t("downloaded"));
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="w-6 h-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">{t("drawTab")}</TabsTrigger>
            <TabsTrigger value="type">{t("typeTab")}</TabsTrigger>
          </TabsList>

          {/* ── Draw mode ──────────────────────────────────────────────── */}
          <TabsContent value="draw" className="space-y-4">
            <Card className="p-4 space-y-4">
              <div
                className="rounded-lg border-2 border-dashed border-muted-foreground/40"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  data-testid="signature-canvas"
                  className="w-full h-auto touch-none cursor-crosshair"
                  style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("penColor")}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={t("penColor")}
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                      className="h-9 w-12 rounded border border-input bg-background p-1"
                    />
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {penColor}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">{t("thickness")}</label>
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {penWidth}px
                    </span>
                  </div>
                  <Slider
                    value={[penWidth]}
                    onValueChange={([v]) => setPenWidth(v)}
                    min={1}
                    max={12}
                    step={1}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                >
                  <Undo2 className="w-4 h-4 me-2" />
                  {t("undo")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={strokes.length === 0}
                >
                  <Trash2 className="w-4 h-4 me-2" />
                  {tCommon("clear")}
                </Button>
                <Button onClick={handleExportDraw} className="ms-auto">
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPng")}
                </Button>
                <Button variant="secondary" onClick={handleExportSvg}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadSvg")}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ── Type mode ──────────────────────────────────────────────── */}
          <TabsContent value="type" className="space-y-4">
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="typed-name">
                  {t("yourName")}
                </label>
                <Input
                  id="typed-name"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                />
              </div>

              <div
                className="rounded-lg border-2 border-dashed border-muted-foreground/40 flex items-center justify-center min-h-[140px] p-4"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                <span
                  data-testid="signature-preview"
                  style={{
                    fontFamily: typeFont,
                    color: typeColor,
                    fontSize: `${typeSize}px`,
                    lineHeight: 1,
                  }}
                >
                  {typedName || t("namePlaceholder")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("font")}</label>
                  <Select value={typeFont} onValueChange={setTypeFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_FONTS.map((f) => (
                        <SelectItem
                          key={f.value}
                          value={f.value}
                          style={{ fontFamily: f.value }}
                        >
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("textColor")}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={t("textColor")}
                      value={typeColor}
                      onChange={(e) => setTypeColor(e.target.value)}
                      className="h-9 w-12 rounded border border-input bg-background p-1"
                    />
                    <span className="text-sm text-muted-foreground" dir="ltr">
                      {typeColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">{t("fontSize")}</label>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {typeSize}px
                  </span>
                </div>
                <Slider
                  value={[typeSize]}
                  onValueChange={([v]) => setTypeSize(v)}
                  min={24}
                  max={120}
                  step={2}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleExportType}>
                  <Download className="w-4 h-4 me-2" />
                  {t("downloadPng")}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          {t("privacyNote")}
        </p>
      </div>
    </div>
  );
}
