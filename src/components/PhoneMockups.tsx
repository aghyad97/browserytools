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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deviceJson } from "@/lib/device-frames";

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedFrame) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameImg = new Image();
    frameImg.src = selectedFrame.url;
    frameImg.onload = () => {
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (screenshot) {
        const screenshotImg = new Image();
        screenshotImg.src = screenshot;
        screenshotImg.onload = () => {
          const polygon = selectedFrame.screenPolygon;
          const screen = selectedFrame.screenArea ?? findScreenArea(frameImg);

          // Get screen bounds from polygon or screen area
          const screenBounds = polygon ? getPolygonBounds(polygon) : screen;

          if (!screenBounds) {
            ctx.drawImage(frameImg, 0, 0);
            return;
          }

          // Calculate screenshot positioning with proper aspect ratio handling
          const screenshotRatio = screenshotImg.width / screenshotImg.height;
          const screenRatio = screenBounds.w / screenBounds.h;

          let drawWidth, drawHeight, drawX, drawY;

          if (screenshotRatio > screenRatio) {
            // Screenshot is wider - fit to height, center horizontally
            drawHeight = screenBounds.h;
            drawWidth =
              screenshotImg.width * (screenBounds.h / screenshotImg.height);
            drawX = screenBounds.x + (screenBounds.w - drawWidth) / 2;
            drawY = screenBounds.y;
          } else {
            // Screenshot is taller - fit to width, center vertically
            drawWidth = screenBounds.w;
            drawHeight =
              screenshotImg.height * (screenBounds.w / screenshotImg.width);
            drawX = screenBounds.x;
            drawY = screenBounds.y + (screenBounds.h - drawHeight) / 2;
          }

          // Apply clipping mask before drawing screenshot
          ctx.save();

          if (polygon) {
            // If the polygon is an axis-aligned rectangle, auto-detect corner radius from the frame
            const useRounded = isAxisAlignedRectangle(polygon);
            if (useRounded && screenBounds) {
              const autoRadius = detectCornerRadiusFromFrame(
                frameImg,
                screenBounds
              );
              if (autoRadius > 0) {
                applyRoundedRectMask(
                  ctx,
                  screenBounds.x,
                  screenBounds.y,
                  screenBounds.w,
                  screenBounds.h,
                  autoRadius
                );
              } else {
                applyRectMask(
                  ctx,
                  screenBounds.x,
                  screenBounds.y,
                  screenBounds.w,
                  screenBounds.h
                );
              }
            } else {
              // Use polygon mask for precise device shapes
              applyPolygonMask(ctx, polygon, canvas.width, canvas.height);
            }
          } else {
            // When no polygon is available, auto-detect and apply rounded/square rectangle
            const autoRadius = detectCornerRadiusFromFrame(
              frameImg,
              screenBounds
            );
            if (autoRadius > 0) {
              applyRoundedRectMask(
                ctx,
                screenBounds.x,
                screenBounds.y,
                screenBounds.w,
                screenBounds.h,
                autoRadius
              );
            } else {
              applyRectMask(
                ctx,
                screenBounds.x,
                screenBounds.y,
                screenBounds.w,
                screenBounds.h
              );
            }
          }

          // Draw the screenshot within the clipped area
          ctx.drawImage(screenshotImg, drawX, drawY, drawWidth, drawHeight);

          // Restore context to remove clipping
          ctx.restore();

          // Draw frame on top
          ctx.drawImage(frameImg, 0, 0);
        };
      } else {
        ctx.drawImage(frameImg, 0, 0);
      }
    };
  }, [selectedFrame, screenshot]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedGroup?.brand ?? "mockup"}-${
      selectedGroup?.model ?? "device"
    }-${selectedOrientation}.png`;
    a.click();
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device</CardTitle>
              <CardDescription>Select a frame</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={selectedGroup?.key ?? undefined}
                onValueChange={(v) => setSelectedGroupKey(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose device" />
                </SelectTrigger>
                <SelectContent>
                  {enhancedGroups.map((g) => (
                    <SelectItem key={g.key} value={g.key}>
                      {`${g.brand} ${g.model}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <div className="space-y-2">
                <Input
                  className="cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadPng} disabled={!selectedFrame}>
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Upload a screenshot - it will automatically fit the frame with
                rounded corners and precise clipping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto h-[calc(100vh-220px)]">
                <canvas
                  ref={canvasRef}
                  className="mx-auto block max-w-full max-h-full w-auto h-auto"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
