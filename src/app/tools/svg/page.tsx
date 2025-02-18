"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import {
  Square,
  Circle,
  Triangle,
  Type,
  Pencil,
  Palette,
  Download,
  Move,
  Trash2,
  Undo,
  Redo,
} from "lucide-react";
import { toast } from "sonner";

type Tool = "rect" | "circle" | "ellipse" | "text" | "path" | "select" | "line";
type Action = { type: string; element: any };

export default function SvgEditor() {
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [undoStack, setUndoStack] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<any>(null);
  const isDrawing = useRef(false);
  const currentPath = useRef<string>("");

  useEffect(() => {
    if (canvasRef.current && !drawRef.current) {
      const draw = SVG()
        .addTo(canvasRef.current)
        .size("100%", "100%")
        .viewbox(0, 0, 800, 600);

      drawRef.current = draw;
      draw.rect(800, 600).fill("#ffffff");

      // Update event listeners to use the correct functions
      draw.on("mousedown", (evt: Event) => handleMouseDown(evt as MouseEvent));
      draw.on("mousemove", (evt: Event) => handleMouseMove(evt as MouseEvent));
      draw.on("mouseup", (evt: Event) => handleMouseUp(evt as MouseEvent));
    }

    return () => {
      if (drawRef.current) {
        drawRef.current.off();
        drawRef.current.clear();
      }
    };
  }, []);

  const handleMouseDown = (event: MouseEvent) => {
    if (selectedTool === "path") {
      startDrawing(event);
    } else if (selectedTool !== "select") {
      addShape(selectedTool);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (selectedTool === "path") {
      draw(event);
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (selectedTool === "path") {
      stopDrawing();
    }
  };

  const startDrawing = (event: MouseEvent) => {
    if (selectedTool === "path") {
      isDrawing.current = true;
      const point = drawRef.current?.point(event.clientX, event.clientY);
      currentPath.current = `M ${point?.x} ${point?.y}`;
    }
  };

  const draw = (event: MouseEvent) => {
    if (isDrawing.current && selectedTool === "path") {
      const point = drawRef.current?.point(event.clientX, event.clientY);
      currentPath.current += ` L ${point?.x} ${point?.y}`;
      updatePath();
    }
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      if (currentPath.current) {
        const path = drawRef.current
          ?.path(currentPath.current)
          .fill("none")
          .stroke({ color, width: strokeWidth });

        if (path) {
          addToUndoStack({ type: "add", element: path });
        }
      }
      currentPath.current = "";
    }
  };

  const updatePath = () => {
    if (drawRef.current && currentPath.current) {
      drawRef.current.select(".temp-path").remove();
      drawRef.current
        .path(currentPath.current)
        .addClass("temp-path")
        .fill("none")
        .stroke({ color, width: strokeWidth });
    }
  };

  const addShape = (type: Tool) => {
    if (!drawRef.current) {
      toast.error("Canvas not initialized");
      return;
    }

    let element;
    const center = { x: 400, y: 300 };

    try {
      switch (type) {
        case "rect":
          element = drawRef.current
            .rect(100, 100)
            .move(center.x - 50, center.y - 50)
            .fill(color)
            .stroke({ color, width: strokeWidth });
          break;
        case "circle":
          element = drawRef.current
            .circle(100)
            .move(center.x - 50, center.y - 50)
            .fill(color)
            .stroke({ color, width: strokeWidth });
          break;
        case "ellipse":
          element = drawRef.current
            .ellipse(120, 80)
            .move(center.x - 60, center.y - 40)
            .fill(color)
            .stroke({ color, width: strokeWidth });
          break;
        case "text":
          const text = prompt("Enter text:", "Hello");
          if (text) {
            element = drawRef.current
              .text(text)
              .move(center.x, center.y)
              .font({ size: 24, family: "Arial" })
              .fill(color);
          }
          break;
        case "line":
          element = drawRef.current
            .line(0, 0, 100, 100)
            .move(center.x, center.y)
            .stroke({ color, width: strokeWidth });
          break;
      }

      if (element) {
        element.draggable();
        addToUndoStack({ type: "add", element });
      }
    } catch (error) {
      toast.error("Error creating shape");
      console.error(error);
    }
  };

  const addToUndoStack = (action: Action) => {
    setUndoStack((prev) => [...prev, action]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const action = undoStack[undoStack.length - 1];
    action.element.remove();

    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, action]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const action = redoStack[redoStack.length - 1];
    action.element.addTo(drawRef.current);

    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, action]);
  };

  const downloadSVG = () => {
    if (!drawRef.current) return;

    const svgData = drawRef.current.svg();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drawing.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded successfully");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">SVG Editor</h1>
          <p className="text-muted-foreground mt-1">
            Create and edit SVG graphics
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedTool === "select" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedTool("select")}
                >
                  <Move className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "rect" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedTool("rect")}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "circle" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedTool("circle")}
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "path" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedTool("path")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "text" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedTool("text")}
                >
                  <Type className="h-4 w-4" />
                </Button>

                <div className="h-6 w-px bg-border" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="w-8 h-8">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <HexColorPicker color={color} onChange={setColor} />
                  </PopoverContent>
                </Popover>

                <div className="w-[100px] flex items-center space-x-2">
                  <Slider
                    value={[strokeWidth]}
                    onValueChange={([value]) => setStrokeWidth(value)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  disabled={undoStack.length === 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  disabled={redoStack.length === 0}
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={downloadSVG}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="h-[calc(100vh-16rem)]">
            <div
              ref={canvasRef}
              className="w-full h-full bg-white rounded-lg overflow-hidden"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
