"use client";

import { useState } from "react";
import { ChartSettings, ChartDataPoint, ExportOptions } from "@/types/chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, FileImage, FileText, FileJson, File } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ChartExportProps {
  chartRef: React.RefObject<HTMLDivElement>;
  data: ChartDataPoint[];
  settings: ChartSettings;
  chartType: string;
}

export function ChartExport({
  chartRef,
  data,
  settings,
  chartType,
}: ChartExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "png",
    quality: 0.9,
    filename: `${chartType}-chart`,
    includeData: false,
    includeConfig: false,
  });

  const handleFormatChange = (format: "png" | "svg" | "pdf" | "json") => {
    setExportOptions((prev) => ({ ...prev, format }));
  };

  const handleQualityChange = (quality: number[]) => {
    setExportOptions((prev) => ({ ...prev, quality: quality[0] }));
  };

  const handleFilenameChange = (filename: string) => {
    setExportOptions((prev) => ({ ...prev, filename }));
  };

  const handleIncludeDataChange = (include: boolean) => {
    setExportOptions((prev) => ({ ...prev, includeData: include }));
  };

  const handleIncludeConfigChange = (include: boolean) => {
    setExportOptions((prev) => ({ ...prev, includeConfig: include }));
  };

  const exportAsPNG = async () => {
    if (!chartRef.current) {
      toast.error("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `${exportOptions.filename}.png`;
      // always export max quality
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Chart exported as PNG");
    } catch (error) {
      toast.error("Failed to export PNG");
      console.error(error);
    }
  };

  // SVG export removed

  const exportAsPDF = async () => {
    if (!chartRef.current) {
      toast.error("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation:
          settings.width > settings.height ? "landscape" : "portrait",
        unit: "px",
        format: [settings.width, settings.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, settings.width, settings.height);

      if (exportOptions.includeData) {
        pdf.addPage();
        pdf.setFontSize(12);
        pdf.text("Chart Data:", 20, 30);

        let yPosition = 50;
        data.forEach((item, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 30;
          }
          pdf.text(`${index + 1}. ${JSON.stringify(item)}`, 20, yPosition);
          yPosition += 15;
        });
      }

      if (exportOptions.includeConfig) {
        pdf.addPage();
        pdf.setFontSize(12);
        pdf.text("Chart Configuration:", 20, 30);

        let yPosition = 50;
        const configText = JSON.stringify(settings, null, 2);
        const configLines = configText.split("\n");

        configLines.forEach((line) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 30;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 15;
        });
      }

      pdf.save(`${exportOptions.filename}.pdf`);
      toast.success("Chart exported as PDF");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    }
  };

  const exportAsJSON = () => {
    try {
      const exportData = {
        chartType,
        settings,
        data: exportOptions.includeData ? data : undefined,
        exportedAt: new Date().toISOString(),
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `${exportOptions.filename}.json`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
      toast.success("Chart exported as JSON");
    } catch (error) {
      toast.error("Failed to export JSON");
      console.error(error);
    }
  };

  const handleExport = () => {
    switch (exportOptions.format) {
      case "png":
        exportAsPNG();
        break;
      // svg removed
      case "pdf":
        exportAsPDF();
        break;
      case "json":
        exportAsJSON();
        break;
      default:
        toast.error("Unsupported export format");
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "png":
        return <FileImage className="h-4 w-4" />;
      case "svg":
        return <File className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "json":
        return <FileJson className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="export-format">Export Format</Label>
          <Select
            value={exportOptions.format}
            onValueChange={handleFormatChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  PNG Image
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Document
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  JSON Data
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            value={exportOptions.filename}
            onChange={(e) => handleFilenameChange(e.target.value)}
            placeholder="Enter filename"
          />
        </div>
      </div>

      {/* PNG quality slider removed: always export at max quality */}

      {(exportOptions.format === "pdf" || exportOptions.format === "json") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-data">Include Data</Label>
            <Switch
              id="include-data"
              checked={exportOptions.includeData}
              onCheckedChange={handleIncludeDataChange}
            />
          </div>

          {exportOptions.format === "pdf" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="include-config">Include Configuration</Label>
              <Switch
                id="include-config"
                checked={exportOptions.includeConfig}
                onCheckedChange={handleIncludeConfigChange}
              />
            </div>
          )}
        </div>
      )}

      <Button onClick={handleExport} className="w-full" size="lg">
        {getFormatIcon(exportOptions.format)}
        Export as {exportOptions.format.toUpperCase()}
      </Button>
    </div>
  );
}
