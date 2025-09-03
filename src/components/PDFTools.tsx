"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  File,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  RotateCw,
  FilePlus,
  SplitSquareHorizontal,
  FileOutput,
  Info,
  Lock,
  Unlock,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { PDFPreview } from "@/components/pdf-preview";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker for thumbnails
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PDFFile {
  name: string;
  size: number;
  data: Uint8Array;
  pageCount?: number;
}

export default function PDFTools() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  const [splitInfo, setSplitInfo] = useState<{
    file: PDFFile;
    pageRanges: string;
  } | null>(null);
  const [pdfInfo, setPdfInfo] = useState<{ [key: string]: number }>({});
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [thumbnailLoading, setThumbnailLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const generateThumbnail = async (pdfData: Uint8Array, filename: string) => {
    try {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: true }));

      // Check if PDF.js worker is available
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        console.warn("PDF.js worker not initialized");
        return;
      }

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);

      const scale = 0.3; // Small scale for thumbnail
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Could not get canvas context");
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const thumbnailUrl = canvas.toDataURL("image/png");
      setThumbnails((prev) => ({ ...prev, [filename]: thumbnailUrl }));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      // Don't show error to user for thumbnails, just log it
    } finally {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);

          // Get page count for each PDF
          try {
            const pdf = await PDFDocument.load(data);
            const pageCount = pdf.getPageCount();
            setPdfInfo((prev) => ({ ...prev, [file.name]: pageCount }));

            // Generate thumbnail
            generateThumbnail(data, file.name);

            return {
              name: file.name,
              size: file.size,
              data,
              pageCount,
            };
          } catch (error) {
            toast.error(`Error reading ${file.name}: Invalid PDF file`);
            return null;
          }
        })
      );

      const validFiles = newFiles.filter((file) => file !== null) as PDFFile[];
      setFiles((prev) => [...prev, ...validFiles]);

      if (validFiles.length > 0) {
        toast.success(`Successfully added ${validFiles.length} PDF(s)!`);
      }
    } catch (error) {
      toast.error("Error loading PDFs");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newFiles[index], newFiles[newIndex]] = [
      newFiles[newIndex],
      newFiles[index],
    ];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles(files.filter((_, i) => i !== index));
    setPdfInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[fileToRemove.name];
      return newInfo;
    });
    setThumbnails((prev) => {
      const newThumbnails = { ...prev };
      delete newThumbnails[fileToRemove.name];
      return newThumbnails;
    });
    setThumbnailLoading((prev) => {
      const newLoading = { ...prev };
      delete newLoading[fileToRemove.name];
      return newLoading;
    });
    toast.success(`Removed ${fileToRemove.name}`);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Add at least 2 PDFs to merge");
      return;
    }

    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const pdf = await PDFDocument.load(file.data);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      downloadPdf(mergedPdfFile, "merged.pdf");
      toast.success("PDFs merged successfully!");
    } catch (error) {
      toast.error("Error merging PDFs");
    } finally {
      setLoading(false);
    }
  };

  const splitPDF = async () => {
    if (!splitInfo) return;

    setLoading(true);
    try {
      const pdf = await PDFDocument.load(splitInfo.file.data);
      const totalPages = pdf.getPageCount();

      // Parse and validate page ranges
      const ranges = splitInfo.pageRanges.split(",").map((range) => {
        const trimmed = range.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          if (isNaN(start) || isNaN(end)) {
            throw new Error(`Invalid range: ${trimmed}`);
          }
          return { start: start - 1, end: end - 1 };
        } else {
          const page = Number(trimmed);
          if (isNaN(page)) {
            throw new Error(`Invalid page number: ${trimmed}`);
          }
          return { start: page - 1, end: page - 1 };
        }
      });

      // Validate all ranges
      for (const range of ranges) {
        if (
          range.start < 0 ||
          range.end >= totalPages ||
          range.start > range.end
        ) {
          throw new Error(
            `Invalid range: pages ${range.start + 1}-${
              range.end + 1
            }. PDF has ${totalPages} pages.`
          );
        }
      }

      let splitCount = 0;
      for (const [index, range] of ranges.entries()) {
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(
          pdf,
          Array.from(
            { length: range.end - range.start + 1 },
            (_, i) => range.start + i
          )
        );
        pages.forEach((page) => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();
        const filename =
          ranges.length === 1
            ? `${splitInfo.file.name.replace(".pdf", "")}_split.pdf`
            : `${splitInfo.file.name.replace(".pdf", "")}_part_${
                index + 1
              }.pdf`;
        downloadPdf(newPdfBytes, filename);
        splitCount++;
      }

      setSplitInfo(null);
      toast.success(`PDF split successfully! Created ${splitCount} file(s).`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error splitting PDF. Check page ranges."
      );
    } finally {
      setLoading(false);
    }
  };

  const compressPDF = async (file: PDFFile) => {
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);

      // Remove metadata to reduce file size
      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("");
      pdf.setCreator("");
      // Remove creation and modification dates
      // pdf.setCreationDate(undefined);
      // pdf.setModificationDate(undefined);

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const originalSize = file.data.length;
      const compressedSize = compressedBytes.length;
      const compressionRatio = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(1);

      if (compressedSize < originalSize) {
        downloadPdf(
          compressedBytes,
          `${file.name.replace(".pdf", "")}_compressed.pdf`
        );
        toast.success(
          `Compressed successfully! ${formatBytes(
            originalSize
          )} → ${formatBytes(compressedSize)} (${compressionRatio}% reduction)`
        );
      } else {
        toast.info("Could not compress further - file is already optimized");
      }
    } catch (error) {
      toast.error("Error compressing PDF");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const rotatePDF = async (file: PDFFile, degrees: number) => {
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation();
        page.setRotation({
          type: "degrees",
          angle: currentRotation.angle + degrees,
        } as any);
      });

      const rotatedBytes = await pdf.save();
      downloadPdf(
        rotatedBytes,
        `${file.name.replace(".pdf", "")}_rotated_${degrees}deg.pdf`
      );
      toast.success(`PDF rotated ${degrees}° successfully!`);
    } catch (error) {
      toast.error("Error rotating PDF");
    } finally {
      setLoading(false);
    }
  };

  const addPasswordProtection = async (file: PDFFile, password: string) => {
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);

      // Note: pdf-lib doesn't support password protection directly
      // This is a placeholder for future implementation
      toast.info("Password protection feature coming soon!");
    } catch (error) {
      toast.error("Error adding password protection");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const tools = [
    {
      name: "Merge PDFs",
      icon: FilePlus,
      description: "Combine multiple PDF files into one",
      action: mergePDFs,
      disabled: files.length < 2,
    },
    {
      name: "Split PDF",
      icon: SplitSquareHorizontal,
      description: "Extract pages from a PDF file",
      action: () => {
        if (files.length > 0) {
          setSplitInfo({ file: files[0], pageRanges: "" });
        }
      },
      disabled: files.length === 0,
    },
    {
      name: "Compress PDF",
      icon: FileOutput,
      description: "Reduce PDF file size",
      action: () => compressPDF(files[0]),
      disabled: files.length === 0,
    },
    {
      name: "Rotate PDF",
      icon: RotateCw,
      description: "Rotate all pages 90° clockwise",
      action: () => rotatePDF(files[0], 90),
      disabled: files.length === 0,
    },
    {
      name: "Rotate PDF (CCW)",
      icon: RotateCcw,
      description: "Rotate all pages 90° counter-clockwise",
      action: () => rotatePDF(files[0], -90),
      disabled: files.length === 0,
    },
    {
      name: "Add Password",
      icon: Lock,
      description: "Add password protection (Coming Soon)",
      action: () => addPasswordProtection(files[0], ""),
      disabled: files.length === 0,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    Drop PDFs here or click to select
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Support for multiple files • Up to 50MB each
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {files.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <Card
                    key={tool.name}
                    className={`p-6 transition-colors ${
                      tool.disabled
                        ? "opacity-50"
                        : "hover:bg-muted cursor-pointer"
                    }`}
                    onClick={() => !tool.disabled && !loading && tool.action()}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file, index) => (
                      <TableRow key={file.name + index}>
                        <TableCell>
                          <div
                            className="w-16 h-20 border rounded-md overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => setPreviewFile(file)}
                          >
                            {thumbnailLoading[file.name] ? (
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : thumbnails[file.name] ? (
                              <img
                                src={thumbnails[file.name]}
                                alt={`${file.name} preview`}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <File className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatBytes(file.size)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {file.pageCount ||
                              pdfInfo[file.name] ||
                              "Loading..."}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFile(index, "up")}
                              disabled={index === 0}
                            >
                              <MoveUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveFile(index, "down")}
                              disabled={index === files.length - 1}
                            >
                              <MoveDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewFile(file)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}

          {previewFile && (
            <Card>
              <PDFPreview
                pdfData={previewFile.data}
                onClose={() => setPreviewFile(null)}
              />
            </Card>
          )}
        </div>
      </div>

      <Sheet open={!!splitInfo} onOpenChange={() => setSplitInfo(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Split PDF</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            {splitInfo?.file && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selected File</label>
                <div className="flex items-center space-x-2 p-2 rounded-md bg-muted">
                  <File className="w-4 h-4" />
                  <span className="text-sm">{splitInfo.file.name}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Page Ranges</label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    toast.info(
                      "Examples: 1-3,5,7-9 or 1,3,5 for individual pages"
                    )
                  }
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <Input
                placeholder="e.g., 1-3,5,7-9"
                value={splitInfo?.pageRanges ?? ""}
                onChange={(e) =>
                  splitInfo &&
                  setSplitInfo({ ...splitInfo, pageRanges: e.target.value })
                }
              />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Separate ranges with commas. Single pages or ranges are
                  supported.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      splitInfo &&
                      setSplitInfo({ ...splitInfo, pageRanges: "1" })
                    }
                  >
                    First page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      splitInfo &&
                      setSplitInfo({
                        ...splitInfo,
                        pageRanges: `1-${pdfInfo[splitInfo.file.name] || "N"}`,
                      })
                    }
                  >
                    All pages
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      splitInfo &&
                      setSplitInfo({ ...splitInfo, pageRanges: "1-3" })
                    }
                  >
                    First 3 pages
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={splitPDF}
              disabled={!splitInfo?.pageRanges || loading}
            >
              {loading ? "Splitting..." : "Split PDF"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
