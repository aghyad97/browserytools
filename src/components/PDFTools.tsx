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
} from "lucide-react";
import { toast } from "sonner";
import { PDFPreview } from "@/components/pdf-preview";

interface PDFFile {
  name: string;
  size: number;
  data: Uint8Array;
}

export default function PDFTools() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  const [splitInfo, setSplitInfo] = useState<{
    file: PDFFile;
    pageRanges: string;
  } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            name: file.name,
            size: file.size,
            data: new Uint8Array(arrayBuffer),
          };
        })
      );
      setFiles((prev) => [...prev, ...newFiles]);
      toast.success("PDFs added successfully!");
    } catch (error) {
      toast.error("Error loading PDFs");
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
    setFiles(files.filter((_, i) => i !== index));
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

      const ranges = splitInfo.pageRanges.split(",").map((range) => {
        const [start, end] = range.trim().split("-").map(Number);
        return end
          ? { start: start - 1, end: end - 1 }
          : { start: start - 1, end: start - 1 };
      });

      const validRanges = ranges.every(
        ({ start, end }) => start >= 0 && end < totalPages && start <= end
      );

      if (!validRanges) {
        throw new Error("Invalid page ranges");
      }

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
        downloadPdf(newPdfBytes, `split-${index + 1}.pdf`);
      }

      setSplitInfo(null);
      toast.success("PDF split successfully!");
    } catch (error) {
      toast.error("Error splitting PDF. Check page ranges.");
    } finally {
      setLoading(false);
    }
  };

  const compressPDF = async (file: PDFFile) => {
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);

      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("");
      pdf.setCreator("");

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      if (compressedBytes.length < file.data.length) {
        downloadPdf(
          compressedBytes,
          `${file.name.replace(".pdf", "")}_compressed.pdf`
        );
        toast.success(
          `Compressed from ${formatBytes(file.data.length)} to ${formatBytes(
            compressedBytes.length
          )}`
        );
      } else {
        toast.info("Could not compress further");
      }
    } catch (error) {
      toast.error("Error compressing PDF");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      action: () => setSplitInfo({ file: files[0], pageRanges: "" }),
      disabled: files.length === 0,
    },
    {
      name: "Compress PDF",
      icon: FileOutput,
      description: "Reduce PDF file size",
      action: () => compressPDF(files[0]),
      disabled: files.length === 0,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">PDF Tools</h1>
          <p className="text-muted-foreground mt-1">
            Powerful PDF manipulation tools that run in your browser
          </p>
        </div>
      </div>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <Card
                    key={tool.name}
                    className={`p-6 transition-colors ${
                      tool.disabled
                        ? "opacity-50"
                        : "hover:bg-muted cursor-pointer"
                    }`}
                    onClick={() => !tool.disabled && tool.action()}
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
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file, index) => (
                      <TableRow key={file.name + index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatBytes(file.size)}</TableCell>
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
                  onClick={() => toast.info("Examples: 1-3,5,7-9")}
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
              <p className="text-sm text-muted-foreground">
                Separate ranges with commas. Single pages or ranges are
                supported.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={splitPDF}
              disabled={!splitInfo?.pageRanges}
            >
              Split PDF
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
