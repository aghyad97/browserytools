"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Copy,
  Trash2,
  Type,
  Palette,
  Move,
  Bold,
  AlignHorizontalSpaceAround,
  ArrowLeftRight,
  ArrowUpDown,
  LightbulbIcon,
  CaseSensitive,
  TypeOutline,
  RotateCw,
} from "lucide-react";
import { FontPicker } from "@/components/ui/font-picker";

interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  rotation: number;
  shadowColor: string;
  shadowSize: number;
  tiltX: number;
  tiltY: number;
  letterSpacing: number;
}

interface TextCustomizerProps {
  textSet: TextSet;
  handleAttributeChange: (id: number, attribute: string, value: any) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (textSet: TextSet) => void;
}

const controls = [
  { id: "text", icon: <CaseSensitive size={20} />, label: "Text" },
  { id: "fontFamily", icon: <TypeOutline size={20} />, label: "Font" },
  { id: "color", icon: <Palette size={20} />, label: "Color" },
  { id: "position", icon: <Move size={20} />, label: "Position" },
  { id: "fontSize", icon: <Type size={20} />, label: "Size" },
  { id: "fontWeight", icon: <Bold size={20} />, label: "Weight" },
  {
    id: "letterSpacing",
    icon: <AlignHorizontalSpaceAround size={20} />,
    label: "Spacing",
  },
  { id: "opacity", icon: <LightbulbIcon size={20} />, label: "Opacity" },
  { id: "rotation", icon: <RotateCw size={20} />, label: "Rotate" },
  { id: "tiltX", icon: <ArrowLeftRight size={20} />, label: "Tilt X" },
  { id: "tiltY", icon: <ArrowUpDown size={20} />, label: "Tilt Y" },
];

export const TextCustomizer = ({
  textSet,
  handleAttributeChange,
  removeTextSet,
  duplicateTextSet,
}: TextCustomizerProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  return (
    <AccordionItem value={`item-${textSet.id}`}>
      <AccordionTrigger>{textSet.text}</AccordionTrigger>
      <AccordionContent>
        {/* Mobile Controls */}
        <div className="md:hidden">
          <ScrollArea className="w-full">
            <div className="flex w-max gap-1 mb-2 p-1">
              {controls.map((control) => (
                <button
                  key={control.id}
                  onClick={() =>
                    setActiveControl(
                      activeControl === control.id ? null : control.id
                    )
                  }
                  className={`flex flex-col items-center justify-center min-w-[4.2rem] h-[4.2rem] rounded-lg ${
                    activeControl === control.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {control.icon}
                  <span className="text-xs mt-1">{control.label}</span>
                </button>
              ))}
            </div>
            <ScrollArea />
          </ScrollArea>

          <div>
            {activeControl === "text" && (
              <div className="space-y-2">
                <Label htmlFor="text">Text</Label>
                <Input
                  key={`text-${textSet.id}`}
                  id="text"
                  value={textSet.text}
                  onChange={(e) =>
                    handleAttributeChange(textSet.id, "text", e.target.value)
                  }
                  placeholder="Enter text"
                />
              </div>
            )}

            {activeControl === "fontFamily" && (
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <FontPicker
                  value={textSet.fontFamily}
                  onChange={(font) =>
                    handleAttributeChange(textSet.id, "fontFamily", font)
                  }
                  width="100%"
                  height="auto"
                />
              </div>
            )}

            {activeControl === "color" && (
              <div className="space-y-2">
                <Label htmlFor="color">Text Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={textSet.color}
                  onChange={(e) =>
                    handleAttributeChange(textSet.id, "color", e.target.value)
                  }
                  className="h-10 w-full"
                />
              </div>
            )}

            {activeControl === "position" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>X Position: {textSet.left}</Label>
                  <Slider
                    value={[textSet.left]}
                    onValueChange={(value) =>
                      handleAttributeChange(textSet.id, "left", value[0])
                    }
                    min={-200}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position: {textSet.top}</Label>
                  <Slider
                    value={[textSet.top]}
                    onValueChange={(value) =>
                      handleAttributeChange(textSet.id, "top", value[0])
                    }
                    min={-100}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {activeControl === "fontSize" && (
              <div className="space-y-2">
                <Label>Font Size: {textSet.fontSize}px</Label>
                <Slider
                  value={[textSet.fontSize]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "fontSize", value[0])
                  }
                  min={10}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "fontWeight" && (
              <div className="space-y-2">
                <Label>Font Weight: {textSet.fontWeight}</Label>
                <Slider
                  value={[textSet.fontWeight]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "fontWeight", value[0])
                  }
                  min={100}
                  max={900}
                  step={100}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "letterSpacing" && (
              <div className="space-y-2">
                <Label>Letter Spacing: {textSet.letterSpacing}px</Label>
                <Slider
                  value={[textSet.letterSpacing]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "letterSpacing", value[0])
                  }
                  min={-20}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "opacity" && (
              <div className="space-y-2">
                <Label>Opacity: {Math.round(textSet.opacity * 100)}%</Label>
                <Slider
                  value={[textSet.opacity]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "opacity", value[0])
                  }
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "rotation" && (
              <div className="space-y-2">
                <Label>Rotation: {textSet.rotation}°</Label>
                <Slider
                  value={[textSet.rotation]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "rotation", value[0])
                  }
                  min={-360}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "tiltX" && (
              <div className="space-y-2">
                <Label>Horizontal Tilt: {textSet.tiltX}°</Label>
                <Slider
                  value={[textSet.tiltX]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "tiltX", value[0])
                  }
                  min={-45}
                  max={45}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {activeControl === "tiltY" && (
              <div className="space-y-2">
                <Label>Vertical Tilt: {textSet.tiltY}°</Label>
                <Slider
                  value={[textSet.tiltY]}
                  onValueChange={(value) =>
                    handleAttributeChange(textSet.id, "tiltY", value[0])
                  }
                  min={-45}
                  max={45}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text</Label>
            <Input
              key={`text-${textSet.id}`}
              id="text"
              value={textSet.text}
              onChange={(e) =>
                handleAttributeChange(textSet.id, "text", e.target.value)
              }
              placeholder="Enter text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <FontPicker
                value={textSet.fontFamily}
                onChange={(font) =>
                  handleAttributeChange(textSet.id, "fontFamily", font)
                }
                width="100%"
                height="auto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={textSet.color}
                onChange={(e) =>
                  handleAttributeChange(textSet.id, "color", e.target.value)
                }
                className="h-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>X Position: {textSet.left}</Label>
              <Slider
                value={[textSet.left]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "left", value[0])
                }
                min={-200}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Y Position: {textSet.top}</Label>
              <Slider
                value={[textSet.top]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "top", value[0])
                }
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Font Size: {textSet.fontSize}px</Label>
              <Slider
                value={[textSet.fontSize]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "fontSize", value[0])
                }
                min={10}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Font Weight: {textSet.fontWeight}</Label>
              <Slider
                value={[textSet.fontWeight]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "fontWeight", value[0])
                }
                min={100}
                max={900}
                step={100}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Letter Spacing: {textSet.letterSpacing}px</Label>
              <Slider
                value={[textSet.letterSpacing]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "letterSpacing", value[0])
                }
                min={-20}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Opacity: {Math.round(textSet.opacity * 100)}%</Label>
              <Slider
                value={[textSet.opacity]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "opacity", value[0])
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rotation: {textSet.rotation}°</Label>
              <Slider
                value={[textSet.rotation]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "rotation", value[0])
                }
                min={-360}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Horizontal Tilt: {textSet.tiltX}°</Label>
              <Slider
                value={[textSet.tiltX]}
                onValueChange={(value) =>
                  handleAttributeChange(textSet.id, "tiltX", value[0])
                }
                min={-45}
                max={45}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vertical Tilt: {textSet.tiltY}°</Label>
            <Slider
              value={[textSet.tiltY]}
              onValueChange={(value) =>
                handleAttributeChange(textSet.id, "tiltY", value[0])
              }
              min={-45}
              max={45}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-row gap-2 my-4">
          <Button onClick={() => duplicateTextSet(textSet)} variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button
            onClick={() => removeTextSet(textSet.id)}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

TextCustomizer.displayName = "TextCustomizer";
