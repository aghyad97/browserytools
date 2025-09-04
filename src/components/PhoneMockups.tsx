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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type MockupItem = {
  filename: string;
  url: string;
  brand: string;
  model: string;
  orientation: "portrait" | "landscape" | "front" | "left" | "right";
  aspectRatio: number | null;
};

export type MockupGroup = {
  key: string;
  brand: string;
  model: string;
  items: MockupItem[];
};

export default function PhoneMockups({ groups }: { groups: MockupGroup[] }) {
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(
    groups[0]?.key ?? null
  );
  const selectedGroup = useMemo(
    () => groups.find((g) => g.key === selectedGroupKey) ?? groups[0],
    [groups, selectedGroupKey]
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
  const [zoom, setZoom] = useState<number>(100);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
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
        const scr = new Image();
        scr.src = screenshot;
        scr.onload = () => {
          // Cover fit based on canvas aspect ratio
          const targetW = canvas.width;
          const targetH = canvas.height;
          const imgAR = scr.width / scr.height;
          const targetAR = targetW / targetH;
          let drawW: number, drawH: number;
          if (imgAR > targetAR) {
            drawH = targetH * (zoom / 100);
            drawW = drawH * imgAR;
          } else {
            drawW = targetW * (zoom / 100);
            drawH = drawW / imgAR;
          }

          const dx = (targetW - drawW) / 2 + xOffset;
          const dy = (targetH - drawH) / 2 + yOffset;
          ctx.drawImage(scr, dx, dy, drawW, drawH);

          // Draw frame on top
          ctx.drawImage(frameImg, 0, 0);
        };
      } else {
        // Only frame when no screenshot yet
        ctx.drawImage(frameImg, 0, 0);
      }
    };
  }, [selectedFrame, screenshot, zoom, xOffset, yOffset]);

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
                  {groups.map((g) => (
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
                <Input type="file" accept="image/*" onChange={handleUpload} />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Zoom ({Math.round(zoom)}%)</label>
                <Slider
                  value={[zoom]}
                  min={25}
                  max={300}
                  step={1}
                  onValueChange={([v]) => setZoom(v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">X Offset</label>
                  <Slider
                    value={[xOffset]}
                    min={-1000}
                    max={1000}
                    step={1}
                    onValueChange={([v]) => setXOffset(v)}
                  />
                </div>
                <div>
                  <label className="text-sm">Y Offset</label>
                  <Slider
                    value={[yOffset]}
                    min={-1000}
                    max={1000}
                    step={1}
                    onValueChange={([v]) => setYOffset(v)}
                  />
                </div>
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
                Upload a screenshot and adjust zoom/offset to fit the frame.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto h-[calc(100vh-220px)]">
                <canvas
                  ref={canvasRef}
                  className="mx-auto block max-w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
