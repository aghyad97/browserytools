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
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  pdfData: Uint8Array;
  onClose?: () => void;
}

export function PDFPreview({ pdfData }: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        renderPage(1, pdfDoc);
      } catch (error) {
        console.error("Error loading PDF:", error);
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

  const changePage = (delta: number) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  const rotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
    renderPage(currentPage);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => rotate(-90)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => rotate(90)}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((prev) => (prev === 1.5 ? 2 : 1.5))}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative border rounded-lg overflow-auto max-h-[600px]">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
    </Card>
  );
}
