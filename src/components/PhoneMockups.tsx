"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select as UiSelect,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
  SelectContent as UiSelectContent,
  SelectItem as UiSelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { HexColorPicker } from "react-colorful";
import { deviceJson } from "@/lib/device-frames";
import { ValueSlider } from "@/components/ui/value-slider";
import { ChevronDown } from "lucide-react";

export type MockupItem = {
  filename: string;
  url: string;
  brand: string;
  model: string;
  orientation: "portrait" | "landscape" | "front" | "left" | "right";
  aspectRatio: number | null;
  screenArea?: { x: number; y: number; w: number; h: number };
  screenPolygon?: [number, number][];
};

export type MockupGroup = {
  key: string;
  brand: string;
  model: string;
  items: MockupItem[];
};

interface PhoneMockupsProps {
  groups: MockupGroup[];
}

// 🔄 Enhance groups with device-frames data (screen polygons, display resolution, etc.)
const enhanceGroupsWithDeviceData = (groups: MockupGroup[]): MockupGroup[] => {
  return groups.map((group) => {
    const enhancedItems = group.items.map((item) => {
      // Find matching device data from deviceJson
      const deviceData = deviceJson.find((device) => {
        // Try to match by filename or device_id
        return device.orientations.some((orientation) => {
          const legacyFile = (orientation as any).legacy_file;
          return (
            legacyFile === item.filename ||
            `${device.device_id}-${orientation.name}.png` === item.filename
          );
        });
      });

      if (deviceData) {
        // Find the specific orientation data
        const orientationData = deviceData.orientations.find((orientation) => {
          const legacyFile = (orientation as any).legacy_file;
          return (
            legacyFile === item.filename ||
            `${deviceData.device_id}-${orientation.name}.png` === item.filename
          );
        });

        if (orientationData) {
          return {
            ...item,
            aspectRatio:
              deviceData.display_resolution?.[0] &&
              deviceData.display_resolution?.[1]
                ? deviceData.display_resolution[0] /
                  deviceData.display_resolution[1]
                : item.aspectRatio,
            screenPolygon: orientationData.coords as [number, number][],
          };
        }
      }

      return item;
    });

    return {
      ...group,
      items: enhancedItems,
    };
  });
};

// 🔄 Helper to detect fallback screen area if no polygon
const findScreenArea = (frameImg: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = frameImg.width;
  canvas.height = frameImg.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(frameImg, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let minX = canvas.width,
    maxX = 0,
    minY = canvas.height,
    maxY = 0;
  let found = false;

  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha < 128) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        found = true;
      }
    }
  }

  if (!found) {
    return {
      x: Math.floor(canvas.width * 0.2),
      y: Math.floor(canvas.height * 0.2),
      w: Math.floor(canvas.width * 0.6),
      h: Math.floor(canvas.height * 0.6),
    };
  }

  return {
    x: minX,
    y: minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  };
};

// 🔄 Apply polygon clipping mask with proper bounds checking
const applyPolygonMask = (
  ctx: CanvasRenderingContext2D,
  polygon: [number, number][],
  canvasWidth: number,
  canvasHeight: number
) => {
  if (!polygon || polygon.length < 3) return;

  ctx.beginPath();
  // Ensure coordinates are within canvas bounds
  const clampedPolygon = polygon.map(([x, y]) => [
    Math.max(0, Math.min(canvasWidth, x)),
    Math.max(0, Math.min(canvasHeight, y)),
  ]);

  ctx.moveTo(clampedPolygon[0][0], clampedPolygon[0][1]);
  for (let i = 1; i < clampedPolygon.length; i++) {
    ctx.lineTo(clampedPolygon[i][0], clampedPolygon[i][1]);
  }
  ctx.closePath();
  ctx.clip();
};

// 🆕 Create rounded rectangle clipping mask
const applyRoundedRectMask = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = 20
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
};

// 🆕 Calculate bounds from polygon
const getPolygonBounds = (polygon: [number, number][]) => {
  if (!polygon || polygon.length === 0) return null;

  const xs = polygon.map((p) => p[0]);
  const ys = polygon.map((p) => p[1]);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
};

// 🆕 Detect if a polygon is an axis-aligned rectangle matching its bounds
const isAxisAlignedRectangle = (polygon: [number, number][]) => {
  if (!polygon || polygon.length !== 4) return false;
  const b = getPolygonBounds(polygon);
  if (!b) return false;
  const corners = new Set([
    `${b.x},${b.y}`,
    `${b.x + b.w},${b.y}`,
    `${b.x + b.w},${b.y + b.h}`,
    `${b.x},${b.y + b.h}`,
  ]);
  let matches = 0;
  for (const [x, y] of polygon) {
    if (corners.has(`${x},${y}`)) matches++;
  }
  return matches === 4;
};

// 🆕 Simple rectangular clipping mask
const applyRectMask = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.closePath();
  ctx.clip();
};

// 🆕 Auto-detect corner radius from the frame image around the screen area
const detectCornerRadiusFromFrame = (
  frameImg: HTMLImageElement,
  screen: { x: number; y: number; w: number; h: number },
  maxPct = 0.12
): number => {
  const c = document.createElement("canvas");
  c.width = frameImg.width;
  c.height = frameImg.height;
  const ctx = c.getContext("2d");
  if (!ctx) return 0;
  ctx.drawImage(frameImg, 0, 0);

  const getAlpha = (x: number, y: number) => {
    const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    return d[3];
  };

  const maxR = Math.floor(Math.min(screen.w, screen.h) * maxPct);
  for (let r = maxR; r >= 2; r -= 2) {
    const px = screen.x + r / Math.SQRT2;
    const py = screen.y + r / Math.SQRT2;
    if (getAlpha(px, py) > 200) return r;
  }
  return 0;
};

export default function PhoneMockups({ groups }: PhoneMockupsProps) {
  // Enhance groups with device-frames data
  const enhancedGroups = useMemo(
    () => enhanceGroupsWithDeviceData(groups),
    [groups]
  );

  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(
    enhancedGroups[0]?.key ?? null
  );
  const selectedGroup = useMemo(
    () =>
      enhancedGroups.find((g) => g.key === selectedGroupKey) ??
      enhancedGroups[0],
    [selectedGroupKey, enhancedGroups]
  );

  const [selectedOrientation, setSelectedOrientation] =
    useState<MockupItem["orientation"]>("portrait");
  const selectedFrame = useMemo(() => {
    const list = selectedGroup?.items ?? [];
    return (
      list.find((i) => i.orientation === selectedOrientation) || list[0] || null
    );
  }, [selectedGroup, selectedOrientation]);

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Appearance controls
  const [frameless, setFrameless] = useState<boolean>(false);
  const [framelessRotation, setFramelessRotation] = useState<number>(0);
  const [roundedRadius, setRoundedRadius] = useState<number>(24);
  const [useShadow, setUseShadow] = useState<boolean>(true);
  const [shadowStrength, setShadowStrength] = useState<number>(24);
  const [shadowColor, setShadowColor] = useState<string>("#000000");
  const [shadowOpacity, setShadowOpacity] = useState<number>(35);
  const [useBackground, setUseBackground] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>("#0b0b0e");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [outputAspect, setOutputAspect] = useState<
    "Default" | "1:1" | "16:9" | "9:16" | "3:4"
  >("Default");
  const [outputPadding, setOutputPadding] = useState<number>(0);
  // Removed single-format state; actions now choose format directly from menu

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackgroundImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper: draw background image with cover semantics
    const drawCover = (
      targetCtx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      tw: number,
      th: number
    ) => {
      const ir = img.width / img.height;
      const tr = tw / th;
      let dw = tw,
        dh = th,
        dx = 0,
        dy = 0;
      if (ir > tr) {
        // image is wider -> fit height
        dh = th;
        dw = img.width * (th / img.height);
        dx = (tw - dw) / 2;
      } else {
        // image is taller -> fit width
        dw = tw;
        dh = img.height * (tw / img.width);
        dy = (th - dh) / 2;
      }
      targetCtx.drawImage(img, dx, dy, dw, dh);
    };

    // Helper: rgba from hex + % opacity
    const hexToRgba = (hex: string, alphaPct: number): string => {
      const h = hex.replace("#", "");
      const normalized =
        h.length === 3
          ? h
              .split("")
              .map((c) => c + c)
              .join("")
          : h;
      const bigint = parseInt(normalized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      const a = Math.max(0, Math.min(100, alphaPct)) / 100;
      return `rgba(${r},${g},${b},${a})`;
    };

    // 1) Build content canvas (no bg, no shadow)
    const buildContent = (onReady: (content: HTMLCanvasElement) => void) => {
      if (frameless) {
        if (!screenshot) {
          const zero = document.createElement("canvas");
          zero.width = 1;
          zero.height = 1;
          onReady(zero);
          return;
        }
        const img = new Image();
        img.src = screenshot;
        img.onload = () => {
          const srcW = img.width;
          const srcH = img.height;
          const angle = ((framelessRotation % 360) + 360) % 360; // 0..359
          const rad = (angle * Math.PI) / 180;
          const absCos = Math.abs(Math.cos(rad));
          const absSin = Math.abs(Math.sin(rad));
          const outW = Math.round(srcW * absCos + srcH * absSin);
          const outH = Math.round(srcW * absSin + srcH * absCos);

          const c = document.createElement("canvas");
          c.width = outW;
          c.height = outH;
          const cctx = c.getContext("2d");
          if (!cctx) return;
          cctx.save();
          applyRoundedRectMask(
            cctx,
            0,
            0,
            c.width,
            c.height,
            Math.max(0, roundedRadius)
          );
          cctx.translate(outW / 2, outH / 2);
          cctx.rotate(rad);
          cctx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);
          cctx.restore();
          onReady(c);
        };
        return;
      }

      // framed mode
      if (!selectedFrame) {
        const zero = document.createElement("canvas");
        zero.width = 1;
        zero.height = 1;
        onReady(zero);
        return;
      }
      const frameImg = new Image();
      frameImg.src = selectedFrame.url;
      frameImg.onload = () => {
        const c = document.createElement("canvas");
        c.width = frameImg.width;
        c.height = frameImg.height;
        const cctx = c.getContext("2d");
        if (!cctx) return;
        cctx.clearRect(0, 0, c.width, c.height);

        if (screenshot) {
          const shot = new Image();
          shot.src = screenshot;
          shot.onload = () => {
            const polygon = selectedFrame.screenPolygon;
            const screen = selectedFrame.screenArea ?? findScreenArea(frameImg);
            const screenBounds = polygon ? getPolygonBounds(polygon) : screen;
            if (screenBounds) {
              const sRatio = shot.width / shot.height;
              const screenRatio = screenBounds.w / screenBounds.h;
              let dw, dh, dx, dy;
              if (sRatio > screenRatio) {
                dh = screenBounds.h;
                dw = shot.width * (screenBounds.h / shot.height);
                dx = screenBounds.x + (screenBounds.w - dw) / 2;
                dy = screenBounds.y;
              } else {
                dw = screenBounds.w;
                dh = shot.height * (screenBounds.w / shot.width);
                dx = screenBounds.x;
                dy = screenBounds.y + (screenBounds.h - dh) / 2;
              }

              cctx.save();
              if (polygon) {
                const useRounded = isAxisAlignedRectangle(polygon);
                if (useRounded) {
                  const autoR = detectCornerRadiusFromFrame(
                    frameImg,
                    screenBounds
                  );
                  if (autoR > 0) {
                    applyRoundedRectMask(
                      cctx,
                      screenBounds.x,
                      screenBounds.y,
                      screenBounds.w,
                      screenBounds.h,
                      autoR
                    );
                  } else {
                    applyRectMask(
                      cctx,
                      screenBounds.x,
                      screenBounds.y,
                      screenBounds.w,
                      screenBounds.h
                    );
                  }
                } else {
                  applyPolygonMask(cctx, polygon, c.width, c.height);
                }
              } else {
                const autoR = detectCornerRadiusFromFrame(
                  frameImg,
                  screenBounds
                );
                if (autoR > 0) {
                  applyRoundedRectMask(
                    cctx,
                    screenBounds.x,
                    screenBounds.y,
                    screenBounds.w,
                    screenBounds.h,
                    autoR
                  );
                } else {
                  applyRectMask(
                    cctx,
                    screenBounds.x,
                    screenBounds.y,
                    screenBounds.w,
                    screenBounds.h
                  );
                }
              }
              cctx.drawImage(shot, dx, dy, dw, dh);
              cctx.restore();
            }
            // Draw frame on top (opaque where device is)
            cctx.drawImage(frameImg, 0, 0);
            onReady(c);
          };
        } else {
          // Only frame
          cctx.drawImage(frameImg, 0, 0);
          onReady(c);
        }
      };
    };

    // 2) Compose final output with bg, aspect, shadow, padding
    buildContent((content) => {
      const pad = Math.floor(outputPadding);
      const reqW = Math.max(1, content.width + pad * 2);
      const reqH = Math.max(1, content.height + pad * 2);

      let finalW = reqW;
      let finalH = reqH;
      const arMap: Record<string, number> = {
        "1:1": 1,
        "16:9": 16 / 9,
        "9:16": 9 / 16,
        "3:4": 3 / 4,
      };
      if (outputAspect !== "Default") {
        const ar = arMap[outputAspect];
        finalH = reqH;
        finalW = Math.round(ar * finalH);
        if (finalW < reqW) {
          finalW = reqW;
          finalH = Math.round(finalW / ar);
        }
      }

      canvas.width = finalW;
      canvas.height = finalH;
      ctx.clearRect(0, 0, finalW, finalH);

      const drawCenteredContent = () => {
        ctx.save();
        if (useShadow) {
          ctx.shadowColor = hexToRgba(shadowColor, shadowOpacity);
          ctx.shadowBlur = shadowStrength;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = Math.round(shadowStrength / 2);
        }
        const dx = Math.round((finalW - content.width) / 2);
        const dy = Math.round((finalH - content.height) / 2);
        ctx.drawImage(content, dx, dy);
        ctx.restore();
      };

      if (useBackground && backgroundImage) {
        const bg = new Image();
        bg.src = backgroundImage;
        bg.onload = () => {
          drawCover(ctx, bg, finalW, finalH);
          drawCenteredContent();
        };
        return;
      }

      if (useBackground && !backgroundImage) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, finalW, finalH);
      }

      drawCenteredContent();
    });
  }, [
    selectedFrame,
    screenshot,
    frameless,
    framelessRotation,
    roundedRadius,
    useShadow,
    shadowStrength,
    shadowColor,
    shadowOpacity,
    useBackground,
    backgroundColor,
    backgroundImage,
    outputAspect,
    outputPadding,
  ]);

  const downloadImage = (format: "png" | "webp" | "jpeg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mimeType: string;
    let extension: string;
    let quality: number | undefined;

    switch (format) {
      case "webp":
        mimeType = "image/webp";
        extension = "webp";
        quality = 0.9;
        break;
      case "jpeg":
        mimeType = "image/jpeg";
        extension = "jpg";
        quality = 0.9;
        break;
      default:
        mimeType = "image/png";
        extension = "png";
        quality = undefined;
    }

    const url = canvas.toDataURL(mimeType, quality);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedGroup?.brand ?? "mockup"}-${
      selectedGroup?.model ?? "device"
    }-${selectedOrientation}.${extension}`;
    a.click();
  };

  const copyImageToClipboard = async (format: "png" | "webp" | "jpeg") => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { mimeType, quality } = (() => {
        switch (format) {
          case "webp":
            return { mimeType: "image/webp", quality: 0.9 } as const;
          case "jpeg":
            return { mimeType: "image/jpeg", quality: 0.9 } as const;
          default:
            return { mimeType: "image/png", quality: undefined } as const;
        }
      })();

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), mimeType, quality)
      );
      if (!blob) throw new Error("Failed to create image blob");

      if (!("clipboard" in navigator) || !("write" in navigator.clipboard)) {
        throw new Error("Clipboard API not available in this browser");
      }

      const item = new (window as any).ClipboardItem({ [mimeType]: blob });
      await navigator.clipboard.write([item]);
      // Optionally, you can add a toast here to confirm copy
    } catch (err) {
      // Fallback: try copying PNG data URL to clipboard as text
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        await navigator.clipboard.writeText(dataUrl);
        // Optionally, you can add a toast here to inform about data URL copy
      } catch (_) {
        alert(
          "Could not copy image to clipboard. Please try downloading instead."
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-4 h-screen lg:h-[calc(100vh-2rem)]">
        <div className="w-full lg:w-1/3 overflow-y-auto space-y-4 pr-4 scrollbar-hide">
          <Card>
            <CardHeader>
              <CardTitle>Device</CardTitle>
              <CardDescription>Select a frame</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedGroup
                      ? `${selectedGroup.brand} ${selectedGroup.model}`
                      : "Choose device"}
                    <span className="text-xs text-muted-foreground">
                      Search
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[320px]">
                  <Command>
                    <CommandInput placeholder="Search devices..." />
                    <CommandList>
                      <CommandEmpty>No device found.</CommandEmpty>
                      <CommandGroup heading="Devices">
                        {enhancedGroups.map((g) => (
                          <CommandItem
                            key={g.key}
                            value={`${g.brand} ${g.model}`}
                            onSelect={() => {
                              setSelectedGroupKey(g.key);
                            }}
                          >
                            {g.brand} {g.model}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Tabs
                value={selectedOrientation}
                onValueChange={(v) =>
                  setSelectedOrientation(v as MockupItem["orientation"])
                }
              >
                <TabsList>
                  {(
                    ["portrait", "landscape", "front", "left", "right"] as const
                  )
                    .filter((o) =>
                      selectedGroup?.items.some((i) => i.orientation === o)
                    )
                    .map((o) => (
                      <TabsTrigger key={o} value={o}>
                        {o}
                      </TabsTrigger>
                    ))}
                </TabsList>
                {(
                  ["portrait", "landscape", "front", "left", "right"] as const
                ).map((o) => (
                  <TabsContent key={o} value={o} />
                ))}
              </Tabs>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="frameless-toggle">Frameless</Label>
                    <div className="text-xs text-muted-foreground">
                      Hide device frame and use rounded screenshot
                    </div>
                  </div>
                  <Switch
                    id="frameless-toggle"
                    checked={frameless}
                    onCheckedChange={setFrameless}
                  />
                </div>
                {frameless && (
                  <div className="space-y-2">
                    <Label>Rotate</Label>
                    <UiSelect
                      value={String(framelessRotation)}
                      onValueChange={(v) =>
                        setFramelessRotation(parseInt(v, 10) || 0)
                      }
                    >
                      <UiSelectTrigger>
                        <UiSelectValue />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectItem value="0">0°</UiSelectItem>
                        <UiSelectItem value="90">90°</UiSelectItem>
                        <UiSelectItem value="180">180°</UiSelectItem>
                        <UiSelectItem value="270">270°</UiSelectItem>
                      </UiSelectContent>
                    </UiSelect>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
              <CardDescription>
                Select the screenshot to place in the mockup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                className="cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Background, shadow, frameless</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {frameless && (
                <ValueSlider
                  label="Rounded corners"
                  value={roundedRadius}
                  onChange={setRoundedRadius}
                  min={0}
                  max={256}
                  step={1}
                  suffix="px"
                />
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="shadow-toggle">Shadow</Label>
                  <div className="text-xs text-muted-foreground">
                    Add soft drop shadow
                  </div>
                </div>
                <Switch
                  id="shadow-toggle"
                  checked={useShadow}
                  onCheckedChange={setUseShadow}
                />
              </div>

              <ValueSlider
                label="Shadow strength"
                value={shadowStrength}
                onChange={setShadowStrength}
                min={0}
                max={128}
                step={1}
                disabled={!useShadow}
                suffix="px"
              />

              {useShadow && (
                <>
                  <div className="space-y-2">
                    <Label>Shadow color</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <span
                            className="mr-2 inline-block h-4 w-4 rounded"
                            style={{ backgroundColor: shadowColor }}
                          />
                          {shadowColor}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={shadowColor}
                          onChange={setShadowColor}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <ValueSlider
                    label="Shadow opacity"
                    value={shadowOpacity}
                    onChange={setShadowOpacity}
                    min={0}
                    max={100}
                    step={1}
                    suffix="%"
                  />
                </>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="background-toggle">Background</Label>
                  <div className="text-xs text-muted-foreground">
                    Fill preview area
                  </div>
                </div>
                <Switch
                  id="background-toggle"
                  checked={useBackground}
                  onCheckedChange={setUseBackground}
                />
              </div>

              <div className="space-y-2">
                <Label>Background color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={!useBackground}
                    >
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded"
                        style={{ backgroundColor }}
                      />
                      {backgroundColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <HexColorPicker
                      color={backgroundColor}
                      onChange={setBackgroundColor}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-image">Background image</Label>
                <Input
                  id="background-image"
                  className="cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  disabled={!useBackground}
                />
              </div>

              <ValueSlider
                label="Content padding"
                value={outputPadding}
                onChange={setOutputPadding}
                min={-400}
                max={400}
                step={1}
                suffix="px"
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-2/3 lg:sticky lg:top-4 lg:h-fit">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Upload a screenshot - it will automatically fit the frame
                    with rounded corners and precise clipping.
                  </CardDescription>
                </div>
                <div className="min-w-[160px]">
                  <UiSelect
                    value={outputAspect}
                    onValueChange={(v) => setOutputAspect(v as any)}
                  >
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Default" />
                    </UiSelectTrigger>
                    <UiSelectContent>
                      <UiSelectItem value="Default">Default</UiSelectItem>
                      <UiSelectItem value="1:1">1:1</UiSelectItem>
                      <UiSelectItem value="16:9">16:9</UiSelectItem>
                      <UiSelectItem value="9:16">9:16</UiSelectItem>
                      <UiSelectItem value="3:4">3:4</UiSelectItem>
                    </UiSelectContent>
                  </UiSelect>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <div className="rounded-xl ring-1 ring-border bg-background/40 p-2">
                  <canvas
                    ref={canvasRef}
                    className="block"
                    style={{
                      maxHeight: "calc(70vh - 40px)",
                      maxWidth: "100%",
                      height: "auto",
                      width: "auto",
                    }}
                  />
                </div>
                <div className="absolute bottom-3 right-3 flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="default">
                        Download
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Save image
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => downloadImage("png")}
                          >
                            PNG
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => downloadImage("jpeg")}
                          >
                            JPEG
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => downloadImage("webp")}
                          >
                            WebP
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Copy to clipboard
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => copyImageToClipboard("png")}
                          >
                            PNG
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => copyImageToClipboard("jpeg")}
                          >
                            JPEG
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => copyImageToClipboard("webp")}
                          >
                            WebP
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
