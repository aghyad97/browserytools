"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
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
import { ToolShell } from "@/components/template/tool-shell";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { downloadBlob } from "@/lib/download";

interface FileEntry {
  name: string;
  size: number;
  type: string;
  path?: string;
  data?: Blob | File;
}

export default function ZipTool() {
  const t = useTranslations("Tools.ZipTools");
  const tc = useTranslations("ToolsConfig");
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
      toast.success(t("filesAddedSuccess"));
    } catch (error) {
      toast.error(t("errorAddingFiles"));
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
      toast.success(t("extractedSuccess"));
    } catch (error) {
      toast.error(t("errorExtracting"));
    } finally {
      setLoading(false);
    }
  }, []);

  const extractAccept = {
    "application/zip": [".zip"],
    "application/x-zip-compressed": [".zip"],
  };

  const createZip = async () => {
    if (files.length === 0) {
      toast.error(t("addFilesToCreate"));
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

      downloadBlob(content, "archive.zip");

      toast.success(t("zipCreatedSuccess"));
    } catch (error) {
      toast.error(t("errorCreatingZip"));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const downloadFile = async (file: FileEntry) => {
    if (!file.data) return;
    downloadBlob(file.data, file.name);
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
    <ToolShell
      slug="zip"
      title={tc("tools.zip.name")}
      sub={tc("tools.zip.description")}
    >
      <div className="space-y-6">
          <Tabs defaultValue="compress" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compress">
                <FileArchive className="w-4 h-4 me-2" />
                {t("createZip")}
              </TabsTrigger>
              <TabsTrigger value="extract">
                <FileOutput className="w-4 h-4 me-2" />
                {t("extractZip")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compress" className="space-y-4">
              <Card className="p-6">
                <FileDropzone
                  onFiles={onDropCompress}
                  multiple
                  className={({ isDragActive }) => `
                    h-32 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-[border-color,background-color] duration-150
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">
                        {t("dropFilesCompress")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("addFilesDesc")}
                      </p>
                    </div>
                  </div>
                </FileDropzone>
              </Card>

              {files.length > 0 && (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("tableFileName")}</TableHead>
                        <TableHead>{t("tableSize")}</TableHead>
                        <TableHead className="w-[100px]">{t("tableActions")}</TableHead>
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
                          <span>{t("creatingZip")}</span>
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
                          <Loader2 className="w-4 h-4 me-2 animate-spin" />
                          {t("creatingZipBtn")}
                        </>
                      ) : (
                        <>
                          <FileArchive className="w-4 h-4 me-2" />
                          {t("createZipBtn")}
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <Card className="p-6">
                <FileDropzone
                  onFiles={onDropExtract}
                  accept={extractAccept}
                  className={({ isDragActive }) => `
                    h-32 rounded-lg border-2 border-dashed
                    flex flex-col items-center justify-center space-y-4 p-8
                    cursor-pointer transition-[border-color,background-color] duration-150
                    ${
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[0.99]"
                        : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <Folder className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">
                        {t("dropFileExtract")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("extractContents")}
                      </p>
                    </div>
                  </div>
                </FileDropzone>
              </Card>

              {loading && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("extractingZip")}</span>
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
                        <TableHead>{t("tableFileName")}</TableHead>
                        <TableHead>{t("tableSize")}</TableHead>
                        <TableHead className="w-[100px]">{t("tableActions")}</TableHead>
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
    </ToolShell>
  );
}
