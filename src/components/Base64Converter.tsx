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
import {
  ArrowRightLeft,
  Upload,
  Download,
  Copy,
  FileText,
  Image,
} from "lucide-react";

type ConversionMode = "encode" | "decode";

export default function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("encode");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const handleTextConversion = () => {
    if (!input.trim()) {
      toast.error("Please enter some input");
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = btoa(input);
        setOutput(encoded);
      } else {
        const decoded = atob(input);
        setOutput(decoded);
      }
      toast.success("Conversion successful");
    } catch (error) {
      toast.error(
        mode === "decode" ? "Invalid Base64 string" : "Conversion failed"
      );
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      if (mode === "encode") {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        setInput(base64);
        setFileInfo({ name: file.name, type: file.type });
      } else {
        const text = await file.text();
        setInput(text);
      }
      toast.success("File loaded successfully");
    } catch (error) {
      toast.error("Error processing file");
    }
  };

  const handleDownload = () => {
    if (!output) {
      toast.error("No output to download");
      return;
    }

    try {
      let blob: Blob;
      if (mode === "decode" && fileInfo) {
        // Convert base64 back to original file type
        const byteCharacters = atob(output);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: fileInfo.type });
      } else {
        // Download as text file
        blob = new Blob([output], { type: "text/plain" });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo
        ? `decoded_${fileInfo.name}`
        : `${mode === "encode" ? "encoded" : "decoded"}_text.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error("Error downloading file");
    }
  };

  const copyToClipboard = async () => {
    if (!output) {
      toast.error("No output to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    if (!newInput.trim()) {
      setOutput("");
      return;
    }

    try {
      const result = mode === "encode" ? btoa(newInput) : atob(newInput);
      setOutput(result);
    } catch (error) {
      // Don't show error toast for real-time conversion
      setOutput("Invalid input for conversion");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-3xl font-bold">Base64 Converter</h1>
          <p className="text-muted-foreground mt-1">
            Encode or decode Base64 strings and files
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
                <SelectItem value="encode">Encode to Base64</SelectItem>
                <SelectItem value="decode">Decode from Base64</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </span>
                </Button>
              </label>
              <Button onClick={handleTextConversion}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Convert
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <Textarea
                placeholder={`Enter text to ${mode}...`}
                className="min-h-[400px] font-mono"
                value={input}
                onChange={handleInputChange}
              />
              {fileInfo && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  {fileInfo.name}
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="relative">
                <Textarea
                  placeholder="Output will appear here..."
                  className="min-h-[400px] font-mono"
                  value={output}
                  readOnly
                />
                {output && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button size="icon" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
