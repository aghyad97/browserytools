"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Upload, ArrowRightLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/github-dark.css";

type ConversionMode = "jsonToCsv" | "csvToJson";
// Register the languages
hljs.registerLanguage("json", json);

export default function JsonCsvConverter() {
  const outputRef = useRef<HTMLPreElement>(null);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("jsonToCsv");

  const convertJsonToCsv = (jsonString: string) => {
    try {
      const json = JSON.parse(jsonString);
      if (!Array.isArray(json)) {
        throw new Error("Input must be an array of objects");
      }

      // Get headers from all objects
      const headers = Array.from(
        new Set(json.flatMap((obj) => Object.keys(obj)))
      );

      // Create CSV rows
      const csvRows = [
        headers.join(","), // Header row
        ...json.map((obj) =>
          headers
            .map((header) => {
              const value = obj[header];
              // Handle special cases (null, undefined, objects, etc.)
              if (value === null || value === undefined) return "";
              if (typeof value === "object") return JSON.stringify(value);
              return String(value).replace(/,/g, ";").replace(/\n/g, " ");
            })
            .join(",")
        ),
      ];

      return csvRows.join("\n");
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  };

  const convertCsvToJson = (csvString: string) => {
    try {
      const rows = csvString.split("\n").filter((row) => row.trim());
      const headers = rows[0].split(",").map((header) => header.trim());

      const jsonArray = rows.slice(1).map((row) => {
        const values = row.split(",").map((value) => value.trim());
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || "";
        });
        return obj;
      });

      return JSON.stringify(jsonArray, null, 2);
    } catch (error) {
      throw new Error("Invalid CSV format");
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("Please enter some input");
      return;
    }

    try {
      const result =
        mode === "jsonToCsv"
          ? convertJsonToCsv(input)
          : convertCsvToJson(input);
      setOutput(result);
      toast.success("Conversion successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion failed");
    }
  };

  const handleDownload = () => {
    if (!output) {
      toast.error("No output to download");
      return;
    }

    const blob = new Blob([output], {
      type: mode === "jsonToCsv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "jsonToCsv" ? "converted.csv" : "converted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      toast.success("File loaded successfully");
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    if (!newInput.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "jsonToCsv") {
        const parsedJson = JSON.parse(newInput);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setInput(formattedJson);
        const result = convertJsonToCsv(formattedJson);
        setOutput(result);
      } else {
        const result = convertCsvToJson(newInput);
        setOutput(result);
      }
    } catch (error) {
      setOutput("Invalid format");
    }
  };

  useEffect(() => {
    if (outputRef.current && output) {
      if (mode === "csvToJson") {
        hljs.highlightElement(outputRef.current);
      }
    }
  }, [output, mode]);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">JSON ↔ CSV Converter</h1>
          <p className="text-muted-foreground mt-1">
            Convert between JSON and CSV formats
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as ConversionMode)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jsonToCsv">JSON to CSV</SelectItem>
                <SelectItem value="csvToJson">CSV to JSON</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept={mode === "jsonToCsv" ? ".json" : ".csv"}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {mode === "jsonToCsv" ? "JSON" : "CSV"}
                  </span>
                </Button>
              </label>
              <Button onClick={handleConvert}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <Textarea
                placeholder={`Enter your ${
                  mode === "jsonToCsv" ? "JSON" : "CSV"
                } here...`}
                className="min-h-[400px] font-mono"
                value={input}
                onChange={handleInputChange}
              />
            </Card>

            <Card className="p-4">
              <div className="relative">
                {mode === "csvToJson" ? (
                  <pre
                    ref={outputRef}
                    className="language-json min-h-[400px] font-mono p-4 overflow-auto"
                  >
                    <code>{output}</code>
                  </pre>
                ) : (
                  <Textarea
                    placeholder="Output will appear here..."
                    className="min-h-[400px] font-mono"
                    value={output}
                    readOnly
                  />
                )}
                {output && (
                  <Button
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
