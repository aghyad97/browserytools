"use client";

import { useDropzone, type Accept } from "react-dropzone";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  maxSizeMB,
  title = "Drop a file, or click to choose",
  subtitle,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFiles(acceptedFiles),
    accept,
    multiple,
    maxSize: maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined,
  });

  return (
    <div
      {...getRootProps()}
      data-testid="file-dropzone"
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
    >
      <input {...getInputProps()} />
      <p className="font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
