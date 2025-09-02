"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  File,
  Folder,
  FileArchive,
  FileOutput,
  Loader2,
  XCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

interface FileEntry {
  name: string;
  size: number;
  type: string;
  path?: string;
  data?: Blob | File;
}

export default function ZipTool() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [zipContent, setZipContent] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDropCompress = useCallback(async (acceptedFiles: File[]) => {
    try {
      const fileEntries = acceptedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        data: file,
      }));
      setFiles((prev) => [...prev, ...fileEntries]);
      toast.success("Files added successfully!");
    } catch (error) {
      toast.error("Error adding files");
    }
  }, []);

  const onDropExtract = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    try {
      const zip = new JSZip();
      const zipData = await file.arrayBuffer();
      const contents = await zip.loadAsync(zipData);

      const extractedFiles: FileEntry[] = [];
      let processed = 0;
      const total = Object.keys(contents.files).length;

      for (const [path, entry] of Object.entries(contents.files)) {
        if (!entry.dir) {
          const blob = await entry.async("blob");
          extractedFiles.push({
            name: entry.name,
            size: blob.size,
            type: blob.type || "application/octet-stream",
            path: path,
            data: blob,
          });
        }
        processed++;
        setProgress((processed / total) * 100);
      }

      setZipContent(extractedFiles);
      toast.success("ZIP file extracted successfully!");
    } catch (error) {
      toast.error("Error extracting ZIP file");
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    getRootProps: getCompressRootProps,
    getInputProps: getCompressInputProps,
    isDragActive: isCompressDragActive,
  } = useDropzone({
    onDrop: onDropCompress,
  });

  const {
    getRootProps: getExtractRootProps,
    getInputProps: getExtractInputProps,
    isDragActive: isExtractDragActive,
  } = useDropzone({
    onDrop: onDropExtract,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    multiple: false,
  });

  const createZip = async () => {
    if (files.length === 0) {
      toast.error("Add files to create ZIP");
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      const zip = new JSZip();
      let processed = 0;

      for (const file of files) {
        if (file.data) {
          zip.file(file.name, file.data);
        }
        processed++;
        setProgress((processed / files.length) * 100);
      }

      const content = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 9 },
        },
        (metadata) => {
          setProgress(metadata.percent);
        }
      );

      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "archive.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("ZIP file created successfully!");
    } catch (error) {
      toast.error("Error creating ZIP file");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const downloadFile = async (file: FileEntry) => {
    if (!file.data) return;

    const url = URL.createObjectURL(file.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="compress" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compress">
                <FileArchive className="w-4 h-4 mr-2" />
                Create ZIP
              </TabsTrigger>
              <TabsTrigger value="extract">
                <FileOutput className="w-4 h-4 mr-2" />
                Extract ZIP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compress" className="space-y-4">
              <Card className="p-6">
                <div
                  {...getCompressRootProps()}
                  className={`
                    h-32 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-all duration-200
                    ${
                      isCompressDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input {...getCompressInputProps()} />
                  <div className="flex items-center space-x-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">
                        Drop files here or click to select
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add files to create a ZIP archive
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {files.length > 0 && (
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
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatBytes(file.size)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="p-4 border-t space-y-4">
                    {loading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Creating ZIP file...</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}

                    <Button
                      onClick={createZip}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating ZIP...
                        </>
                      ) : (
                        <>
                          <FileArchive className="w-4 h-4 mr-2" />
                          Create ZIP
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <Card className="p-6">
                <div
                  {...getExtractRootProps()}
                  className={`
                    h-32 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-all duration-200
                    ${
                      isExtractDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <input {...getExtractInputProps()} />
                  <div className="flex items-center space-x-4">
                    <Folder className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">
                        Drop ZIP file here or click to select
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Extract contents of a ZIP file
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {loading && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Extracting ZIP file...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </Card>
              )}

              {zipContent.length > 0 && (
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
                      {zipContent.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatBytes(file.size)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadFile(file)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
