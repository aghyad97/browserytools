"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Download,
  RotateCcw,
  ArrowUpAZ,
  ArrowDownAZ,
  Shuffle,
  FlipVertical,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

type SortMode =
  | "az"
  | "za"
  | "length-asc"
  | "length-desc"
  | "numeric"
  | "shuffle"
  | "reverse"
  | null;

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [activeMode, setActiveMode] = useState<SortMode>(null);

  const processLines = useCallback(
    (lines: string[], mode: SortMode): string[] => {
      let result = [...lines];

      if (trimWhitespace) {
        result = result.map((l) => l.trim());
      }

      if (removeEmptyLines) {
        result = result.filter((l) => l.length > 0);
      }

      if (removeDuplicates) {
        const seen = new Set<string>();
        result = result.filter((l) => {
          const key = caseInsensitive ? l.toLowerCase() : l;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      switch (mode) {
        case "az":
          result.sort((a, b) => {
            const ka = caseInsensitive ? a.toLowerCase() : a;
            const kb = caseInsensitive ? b.toLowerCase() : b;
            return ka.localeCompare(kb);
          });
          break;
        case "za":
          result.sort((a, b) => {
            const ka = caseInsensitive ? a.toLowerCase() : a;
            const kb = caseInsensitive ? b.toLowerCase() : b;
            return kb.localeCompare(ka);
          });
          break;
        case "length-asc":
          result.sort((a, b) => a.length - b.length);
          break;
        case "length-desc":
          result.sort((a, b) => b.length - a.length);
          break;
        case "numeric":
          result.sort((a, b) => {
            const na = parseFloat(a);
            const nb = parseFloat(b);
            if (isNaN(na) && isNaN(nb)) return 0;
            if (isNaN(na)) return 1;
            if (isNaN(nb)) return -1;
            return na - nb;
          });
          break;
        case "shuffle":
          for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
          }
          break;
        case "reverse":
          result.reverse();
          break;
        default:
          break;
      }

      return result;
    },
    [trimWhitespace, removeEmptyLines, removeDuplicates, caseInsensitive]
  );

  const output = useMemo(() => {
    if (!input.trim() && !activeMode) return "";
    const lines = input.split("\n");
    const processed = processLines(lines, activeMode);
    return processed.join("\n");
  }, [input, activeMode, processLines]);

  const inputLines = useMemo(
    () => input.split("\n").filter((l) => l.trim().length > 0).length,
    [input]
  );

  const outputLines = useMemo(
    () => output.split("\n").filter((l) => l.trim().length > 0).length,
    [output]
  );

  const handleSort = (mode: SortMode) => {
    if (!input.trim()) {
      toast.error("Please enter some text first");
      return;
    }
    setActiveMode(mode);
  };

  const handleCopy = () => {
    if (!output) {
      toast.error("Nothing to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const handleDownload = () => {
    if (!output) {
      toast.error("Nothing to download");
      return;
    }
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sorted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded sorted-text.txt");
  };

  const handleClear = () => {
    setInput("");
    setActiveMode(null);
  };

  const sortButtons: { label: string; mode: SortMode; icon: React.ReactNode }[] = [
    { label: "Sort A → Z", mode: "az", icon: <ArrowUpAZ className="w-4 h-4" /> },
    { label: "Sort Z → A", mode: "za", icon: <ArrowDownAZ className="w-4 h-4" /> },
    { label: "Length ↑", mode: "length-asc", icon: <Hash className="w-4 h-4" /> },
    { label: "Length ↓", mode: "length-desc", icon: <Hash className="w-4 h-4" /> },
    { label: "Numeric", mode: "numeric", icon: <Hash className="w-4 h-4" /> },
    { label: "Shuffle", mode: "shuffle", icon: <Shuffle className="w-4 h-4" /> },
    { label: "Reverse", mode: "reverse", icon: <FlipVertical className="w-4 h-4" /> },
  ];

  const ToggleOption = ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Sort Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sort Options</CardTitle>
          <CardDescription>
            Choose a sort method to apply to the input text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {sortButtons.map(({ label, mode, icon }) => (
              <Button
                key={mode}
                variant={activeMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort(mode)}
                className="flex items-center gap-2"
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Options
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <ToggleOption
                id="remove-duplicates"
                label="Remove Duplicates"
                checked={removeDuplicates}
                onChange={setRemoveDuplicates}
              />
              <ToggleOption
                id="trim-whitespace"
                label="Trim Whitespace"
                checked={trimWhitespace}
                onChange={setTrimWhitespace}
              />
              <ToggleOption
                id="remove-empty"
                label="Remove Empty Lines"
                checked={removeEmptyLines}
                onChange={setRemoveEmptyLines}
              />
              <ToggleOption
                id="case-insensitive"
                label="Case Insensitive Sort"
                checked={caseInsensitive}
                onChange={setCaseInsensitive}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter one item per line</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter text here, one item per line..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[320px] resize-none font-mono text-sm"
              rows={14}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-3">
                <Badge variant="secondary">{inputLines} lines</Badge>
                <Badge variant="secondary">{input.length} chars</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              {activeMode ? `Sorted / processed result` : "Result will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Output will appear here after sorting..."
              value={output}
              readOnly
              className="min-h-[320px] resize-none font-mono text-sm bg-muted"
              rows={14}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-3">
                <Badge variant="secondary">{outputLines} lines</Badge>
                <Badge variant="secondary">{output.length} chars</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
