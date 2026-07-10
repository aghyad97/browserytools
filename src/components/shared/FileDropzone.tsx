"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  /** When provided, replaces the default title/subtitle content entirely. */
  children?: ReactNode;
  /**
   * Root zone styling. A string is merged onto the default classes; a function
   * receives the drag state and its return value is used verbatim (full control,
   * for call sites that must keep their existing markup byte-identical).
   */
  className?: string | ((state: { isDragActive: boolean }) => string);
  /** Spread onto the hidden file input after getInputProps() (e.g. data-testid). */
  inputProps?: InputHTMLAttributes<HTMLInputElement> & {
    [key: `data-${string}`]: string;
  };
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  maxSizeMB,
  title = "Drop a file, or click to choose",
  subtitle,
  children,
  className,
  inputProps,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFiles(acceptedFiles),
    accept,
    multiple,
    maxSize: maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined,
  });

  const defaultClassName = `cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
  }`;

  const rootClassName =
    typeof className === "function"
      ? className({ isDragActive })
      : className
        ? cn(defaultClassName, className)
        : defaultClassName;

  return (
    <div {...getRootProps()} data-testid="file-dropzone" className={rootClassName}>
      <input {...getInputProps()} {...inputProps} />
      {children !== undefined ? (
        children
      ) : (
        <>
          <p className="font-medium">{title}</p>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </>
      )}
    </div>
  );
}
