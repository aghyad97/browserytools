"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  RotateCcw,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PDFPreviewProps {
  pdfData: Uint8Array;
  onClose?: () => void;
}

export function PDFPreview({ pdfData, onClose }: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        await renderPage(1, pdfDoc);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setError("Failed to load PDF. Please check if the file is valid.");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfData]);

  const renderPage = async (pageNumber: number, pdfDoc = pdf) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) return;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  };

  const changePage = async (delta: number) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      await renderPage(newPage);
    }
  };

  const rotate = async (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
    await renderPage(currentPage);
  };

  // Re-render when scale changes
  useEffect(() => {
    if (pdf && !loading) {
      renderPage(currentPage);
    }
  }, [scale, rotation]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            {loading ? "Loading..." : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(1)}
            disabled={currentPage >= totalPages || loading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotate(-90)}
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotate(90)}
            disabled={loading}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((prev) => (prev === 1.5 ? 2 : 1.5))}
            disabled={loading}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative border rounded-lg overflow-auto max-h-[600px] min-h-[400px] flex items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading PDF...
            </span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-8 h-8 text-destructive">⚠️</div>
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}
        {!loading && !error && <canvas ref={canvasRef} className="mx-auto" />}
      </div>
    </Card>
  );
}
