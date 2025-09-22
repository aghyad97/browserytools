"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { useDropzone } from "react-dropzone";
import { Upload, Download, Plus, Trash2, Copy, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { removeBackground } from "@imgly/background-removal";
import { TextCustomizer } from "./TextCustomizer";

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

export default function TextBehindImage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [textSets, setTextSets] = useState<TextSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 1, height: 1 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      await setupImage(imageUrl);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setupImage(imageUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const setupImage = async (imageUrl: string) => {
    try {
      setLoading(true);

      // Calculate aspect ratio from the original image
      const img = new (window as any).Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        console.log(
          "Image dimensions:",
          img.width,
          "x",
          img.height,
          "aspect ratio:",
          aspectRatio
        );
        setImageAspectRatio(aspectRatio);
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = imageUrl;

      const imageBlob = await removeBackground(imageUrl, {
        device: "gpu",
      });
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error("Failed to remove background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFont = (fontFamily: string) => {
    if (typeof window !== "undefined" && fontFamily !== "Inter") {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        /\s+/g,
        "+"
      )}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  };

  const addNewTextSet = useCallback(() => {
    setTextSets((prev) => {
      const newId = Math.max(...prev.map((set) => set.id), 0) + 1;
      return [
        ...prev,
        {
          id: newId,
          text: "Edit me",
          fontFamily: "Inter",
          top: 0,
          left: 0,
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 700,
          opacity: 1,
          shadowColor: "rgba(0, 0, 0, 0.8)",
          shadowSize: 4,
          rotation: 0,
          tiltX: 0,
          tiltY: 0,
          letterSpacing: 0,
        },
      ];
    });
  }, []);

  const handleAttributeChange = useCallback(
    (id: number, attribute: string, value: any) => {
      setTextSets((prev) =>
        prev.map((set) => {
          if (set.id === id) {
            if (attribute === "fontFamily") {
              loadFont(value);
            }
            return { ...set, [attribute]: value };
          }
          return set;
        })
      );
    },
    []
  );

  const duplicateTextSet = useCallback((textSet: TextSet) => {
    setTextSets((prev) => {
      const newId = Math.max(...prev.map((set) => set.id), 0) + 1;
      return [...prev, { ...textSet, id: newId }];
    });
  }, []);

  const removeTextSet = useCallback((id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  }, []);

  // Helper function to wrap text in canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const saveCompositeImage = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // Use preview container dimensions to match what user sees
      const previewWidth = Math.min(600, bgImg.width);
      const previewHeight = previewWidth / imageAspectRatio;

      canvas.width = previewWidth;
      canvas.height = previewHeight;

      // Draw the background image scaled to preview dimensions
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Render text first (between original image and background removal)
      textSets.forEach((textSet) => {
        ctx.save();

        // Use same font size as preview (no scaling needed since canvas matches preview)
        const scaledFontSize = textSet.fontSize;

        // Set up text properties
        ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calculate text position using same percentage-based positioning as preview
        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        // Move to position first
        ctx.translate(x, y);

        // Apply 3D transforms
        const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
        const tiltYRad = (-textSet.tiltY * Math.PI) / 180;

        // Use a simpler transform that maintains the visual tilt
        ctx.transform(
          Math.cos(tiltYRad), // Horizontal scaling
          Math.sin(0), // Vertical skewing
          -Math.sin(0), // Horizontal skewing
          Math.cos(tiltXRad), // Vertical scaling
          0, // Horizontal translation
          0 // Vertical translation
        );

        // Apply rotation last
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        // Calculate max width for text wrapping (80% of canvas width, same as preview)
        const maxWidth = canvas.width * 0.8;

        if (textSet.letterSpacing === 0) {
          // Use text wrapping for standard text rendering
          const lines = wrapText(ctx, textSet.text, maxWidth);
          const lineHeight = scaledFontSize * 1.2; // Line height multiplier
          const totalHeight = lines.length * lineHeight;
          const startY = -(totalHeight / 2) + lineHeight / 2;

          lines.forEach((line, index) => {
            ctx.fillText(line, 0, startY + index * lineHeight);
          });
        } else {
          // Manual letter spacing implementation with wrapping
          const lines = wrapText(ctx, textSet.text, maxWidth);
          const lineHeight = scaledFontSize * 1.2;
          const totalHeight = lines.length * lineHeight;
          const startY = -(totalHeight / 2) + lineHeight / 2;

          lines.forEach((line, lineIndex) => {
            const chars = line.split("");
            let currentX = 0;
            // Calculate total width to center properly
            const totalWidth = chars.reduce((width, char, i) => {
              const charWidth = ctx.measureText(char).width;
              return (
                width +
                charWidth +
                (i < chars.length - 1 ? textSet.letterSpacing : 0)
              );
            }, 0);

            // Start position (centered)
            currentX = -totalWidth / 2;

            // Draw each character with spacing
            chars.forEach((char, i) => {
              const charWidth = ctx.measureText(char).width;
              ctx.fillText(
                char,
                currentX + charWidth / 2,
                startY + lineIndex * lineHeight
              );
              currentX += charWidth + textSet.letterSpacing;
            });
          });
        }
        ctx.restore();
      });

      // Add the removed background image on top
      if (removedBgImageUrl) {
        const removedBgImg = new (window as any).Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          triggerDownload();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        triggerDownload();
      }
    };
    bgImg.src = selectedImage || "";

    function triggerDownload() {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "text-behind-image.png";
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded successfully!");
    }
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // Use preview container dimensions to match what user sees
      const previewWidth = Math.min(600, bgImg.width);
      const previewHeight = previewWidth / imageAspectRatio;

      canvas.width = previewWidth;
      canvas.height = previewHeight;

      // Draw the background image scaled to preview dimensions
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Render text first (between original image and background removal)
      textSets.forEach((textSet) => {
        ctx.save();

        // Use same font size as preview (no scaling needed since canvas matches preview)
        const scaledFontSize = textSet.fontSize;

        // Set up text properties
        ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calculate text position using same percentage-based positioning as preview
        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        // Move to position first
        ctx.translate(x, y);

        // Apply 3D transforms
        const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
        const tiltYRad = (-textSet.tiltY * Math.PI) / 180;

        // Use a simpler transform that maintains the visual tilt
        ctx.transform(
          Math.cos(tiltYRad), // Horizontal scaling
          Math.sin(0), // Vertical skewing
          -Math.sin(0), // Horizontal skewing
          Math.cos(tiltXRad), // Vertical scaling
          0, // Horizontal translation
          0 // Vertical translation
        );

        // Apply rotation last
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        // Calculate max width for text wrapping (80% of canvas width, same as preview)
        const maxWidth = canvas.width * 0.8;

        if (textSet.letterSpacing === 0) {
          // Use text wrapping for standard text rendering
          const lines = wrapText(ctx, textSet.text, maxWidth);
          const lineHeight = scaledFontSize * 1.2; // Line height multiplier
          const totalHeight = lines.length * lineHeight;
          const startY = -(totalHeight / 2) + lineHeight / 2;

          lines.forEach((line, index) => {
            ctx.fillText(line, 0, startY + index * lineHeight);
          });
        } else {
          // Manual letter spacing implementation with wrapping
          const lines = wrapText(ctx, textSet.text, maxWidth);
          const lineHeight = scaledFontSize * 1.2;
          const totalHeight = lines.length * lineHeight;
          const startY = -(totalHeight / 2) + lineHeight / 2;

          lines.forEach((line, lineIndex) => {
            const chars = line.split("");
            let currentX = 0;
            // Calculate total width to center properly
            const totalWidth = chars.reduce((width, char, i) => {
              const charWidth = ctx.measureText(char).width;
              return (
                width +
                charWidth +
                (i < chars.length - 1 ? textSet.letterSpacing : 0)
              );
            }, 0);

            // Start position (centered)
            currentX = -totalWidth / 2;

            // Draw each character with spacing
            chars.forEach((char, i) => {
              const charWidth = ctx.measureText(char).width;
              ctx.fillText(
                char,
                currentX + charWidth / 2,
                startY + lineIndex * lineHeight
              );
              currentX += charWidth + textSet.letterSpacing;
            });
          });
        }
        ctx.restore();
      });

      // Add the removed background image on top
      if (removedBgImageUrl) {
        const removedBgImg = new (window as any).Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          triggerCopy();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        triggerCopy();
      }
    };
    bgImg.src = selectedImage || "";

    function triggerCopy() {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            toast.success("Image copied to clipboard!");
          } catch (error) {
            toast.error("Failed to copy to clipboard");
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {!selectedImage ? (
            <Card className="p-6">
              <div
                {...getRootProps()}
                className={`
                  h-48 rounded-lg border-2 border-dashed
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
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png, .gif, .webp"
                />
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      Drop an image here or click to select
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an image to add text behind it
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
              {/* Image Preview */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Your image with text overlay
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div
                    data-preview-container
                    className="border border-border rounded-lg relative overflow-hidden bg-muted/20 mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      aspectRatio: imageAspectRatio,
                      maxHeight: "70vh",
                      minHeight: "300px",
                    }}
                  >
                    {isImageSetupDone ? (
                      <Image
                        src={selectedImage}
                        alt="Uploaded"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <RotateCw className="w-4 h-4 animate-spin" />
                            <span>Processing image...</span>
                          </div>
                        ) : (
                          <span>Loading, please wait</span>
                        )}
                      </div>
                    )}
                    {isImageSetupDone &&
                      textSets.map((textSet) => {
                        // Use percentage positioning to match the aspect ratio
                        const x = `${textSet.left + 50}%`;
                        const y = `${50 - textSet.top}%`;

                        return (
                          <div
                            key={textSet.id}
                            style={{
                              position: "absolute",
                              top: y,
                              left: x,
                              transform: `
                              translate(-50%, -50%) 
                              rotate(${textSet.rotation}deg)
                              perspective(1000px)
                              rotateX(${textSet.tiltX}deg)
                              rotateY(${textSet.tiltY}deg)
                            `,
                              color: textSet.color,
                              textAlign: "center",
                              fontSize: `${textSet.fontSize}px`,
                              fontWeight: textSet.fontWeight,
                              fontFamily: textSet.fontFamily,
                              opacity: textSet.opacity,
                              letterSpacing: `${textSet.letterSpacing}px`,
                              transformStyle: "preserve-3d",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              maxWidth: "80%",
                              overflowWrap: "break-word",
                            }}
                          >
                            {textSet.text}
                          </div>
                        );
                      })}
                    {removedBgImageUrl && (
                      <Image
                        src={removedBgImageUrl}
                        alt="Removed bg"
                        fill
                        className="absolute top-0 left-0 w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {selectedImage && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={saveCompositeImage} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setRemovedBgImageUrl(null);
                          setIsImageSetupDone(false);
                          setTextSets([]);
                        }}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Text Controls */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Text Controls</CardTitle>
                  <CardDescription>
                    Add and customize text overlays
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4">
                    <Button onClick={addNewTextSet} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Text
                    </Button>

                    {textSets.length > 0 && (
                      <ScrollArea className="flex-1">
                        <Accordion type="single" collapsible className="w-full">
                          {textSets.map((textSet) => (
                            <TextCustomizer
                              key={textSet.id}
                              textSet={textSet}
                              handleAttributeChange={handleAttributeChange}
                              removeTextSet={removeTextSet}
                              duplicateTextSet={duplicateTextSet}
                            />
                          ))}
                        </Accordion>
                      </ScrollArea>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
