"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Copy, Download, RefreshCw, FileIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Format = "csv" | "tsv" | "json" | "xml" | "yaml";

const FORMAT_LABELS: Record<Format, string> = {
  csv: "CSV",
  tsv: "TSV",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
};

const FORMAT_EXTENSIONS: Record<Format, string> = {
  csv: "csv",
  tsv: "tsv",
  json: "json",
  xml: "xml",
  yaml: "yaml",
};

const SAMPLES: Record<Format, string> = {
  csv: `name,age,email,city
Alice,30,alice@example.com,New York
Bob,25,bob@example.com,London
Carol,35,carol@example.com,Tokyo`,
  tsv: `name\tage\temail\tcity
Alice\t30\talice@example.com\tNew York
Bob\t25\tbob@example.com\tLondon
Carol\t35\tcarol@example.com\tTokyo`,
  json: `[
  {"name":"Alice","age":30,"email":"alice@example.com","city":"New York"},
  {"name":"Bob","age":25,"email":"bob@example.com","city":"London"},
  {"name":"Carol","age":35,"email":"carol@example.com","city":"Tokyo"}
]`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <row>
    <name>Alice</name>
    <age>30</age>
    <email>alice@example.com</email>
    <city>New York</city>
  </row>
  <row>
    <name>Bob</name>
    <age>25</age>
    <email>bob@example.com</email>
    <city>London</city>
  </row>
  <row>
    <name>Carol</name>
    <age>35</age>
    <email>carol@example.com</email>
    <city>Tokyo</city>
  </row>
</root>`,
  yaml: `- name: Alice
  age: 30
  email: alice@example.com
  city: New York
- name: Bob
  age: 25
  email: bob@example.com
  city: London
- name: Carol
  age: 35
  email: carol@example.com
  city: Tokyo`,
};

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseCSV(text: string, delimiter = ","): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
  const headers = splitDelimited(lines[0], delimiter);
  return lines.slice(1).map((line) => {
    const values = splitDelimited(line, delimiter);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? "").trim(); });
    return row;
  });
}

function splitDelimited(line: string, delimiter: string): string[] {
  const results: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      results.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  results.push(current);
  return results;
}

function parseJSON(text: string): Record<string, string>[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects.");
  return parsed.map((item, i) => {
    if (typeof item !== "object" || item === null || Array.isArray(item))
      throw new Error(`Item at index ${i} is not an object.`);
    const row: Record<string, string> = {};
    for (const [k, v] of Object.entries(item)) {
      row[k] = v === null || v === undefined ? "" : String(v);
    }
    return row;
  });
}

function parseXML(text: string): Record<string, string>[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error("Invalid XML: " + parseError.textContent?.slice(0, 100));
  const root = doc.documentElement;
  const rows: Record<string, string>[] = [];
  for (const child of Array.from(root.children)) {
    const row: Record<string, string> = {};
    for (const el of Array.from(child.children)) {
      row[el.tagName] = el.textContent ?? "";
    }
    if (Object.keys(row).length > 0) rows.push(row);
  }
  if (rows.length === 0) throw new Error("No data rows found in XML. Ensure each child of root contains data elements.");
  return rows;
}

function parseYAML(text: string): Record<string, string>[] {
  // Minimal YAML list-of-maps parser (no external dep)
  const rows: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "  ");
    if (/^\s*#/.test(line) || line.trim() === "") continue;
    const listMatch = line.match(/^-\s+([\w\s-]+):\s*(.*)/);
    if (listMatch) {
      if (current) rows.push(current);
      current = {};
      current[listMatch[1].trim()] = listMatch[2].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const newItemMatch = line.match(/^-\s*$/);
    if (newItemMatch) {
      if (current) rows.push(current);
      current = {};
      continue;
    }
    const kvMatch = line.match(/^\s+([\w\s-]+):\s*(.*)/);
    if (kvMatch && current) {
      current[kvMatch[1].trim()] = kvMatch[2].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const topKvMatch = line.match(/^([\w\s-]+):\s*(.*)/);
    if (topKvMatch && !line.startsWith(" ")) {
      if (current) rows.push(current);
      current = {};
      current[topKvMatch[1].trim()] = topKvMatch[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  if (current && Object.keys(current).length > 0) rows.push(current);
  if (rows.length === 0) throw new Error("No data found. Ensure YAML is a list of key-value maps.");
  return rows;
}

function toData(text: string, fmt: Format): Record<string, string>[] {
  switch (fmt) {
    case "csv": return parseCSV(text, ",");
    case "tsv": return parseCSV(text, "\t");
    case "json": return parseJSON(text);
    case "xml": return parseXML(text);
    case "yaml": return parseYAML(text);
  }
}

// ─── Serializers ──────────────────────────────────────────────────────────────

function csvEscape(val: string, delimiter = ","): string {
  if (val.includes(delimiter) || val.includes('"') || val.includes("\n")) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

function toCSV(rows: Record<string, string>[], delimiter = ","): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map((h) => csvEscape(h, delimiter)).join(delimiter),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h] ?? "", delimiter)).join(delimiter)),
  ];
  return lines.join("\n");
}

function toJSON(rows: Record<string, string>[]): string {
  return JSON.stringify(rows, null, 2);
}

function toXML(rows: Record<string, string>[]): string {
  if (rows.length === 0) return '<?xml version="1.0" encoding="UTF-8"?>\n<root/>';
  const xmlTag = (tag: string, content: string) =>
    `    <${tag}>${content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${tag}>`;
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', "<root>"];
  for (const row of rows) {
    lines.push("  <row>");
    for (const [k, v] of Object.entries(row)) lines.push(xmlTag(k, v));
    lines.push("  </row>");
  }
  lines.push("</root>");
  return lines.join("\n");
}

function toYAML(rows: Record<string, string>[]): string {
  const needsQuote = (v: string) => /[:#\[\]{}&*!,|>'"%@`]/.test(v) || v.includes("\n") || v === "";
  const q = (v: string) => needsQuote(v) ? `"${v.replace(/"/g, '\\"')}"` : v;
  return rows.map((row) => {
    const entries = Object.entries(row);
    return entries.map(([ k, v], i) => `${i === 0 ? "- " : "  "}${k}: ${q(v)}`).join("\n");
  }).join("\n");
}

function fromData(rows: Record<string, string>[], fmt: Format): string {
  switch (fmt) {
    case "csv": return toCSV(rows, ",");
    case "tsv": return toCSV(rows, "\t");
    case "json": return toJSON(rows);
    case "xml": return toXML(rows);
    case "yaml": return toYAML(rows);
  }
}

// ─── Auto-detect format ───────────────────────────────────────────────────────

function detectFormat(text: string): Format | null {
  const t = text.trim();
  if (t.startsWith("[") || t.startsWith("{")) return "json";
  if (t.startsWith("<?xml") || t.startsWith("<")) return "xml";
  if (/^-\s/.test(t) || /^\w[\w\s]+:\s/.test(t)) return "yaml";
  if (t.includes("\t") && t.split("\n")[0].includes("\t")) return "tsv";
  if (t.includes(",") && t.split("\n")[0].includes(",")) return "csv";
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FileConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fromFmt, setFromFmt] = useState<Format>("csv");
  const [toFmt, setToFmt] = useState<Format>("json");
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const convert = useCallback(() => {
    if (!input.trim()) { toast.error("Paste some data first."); return; }
    setError(null);
    try {
      const rows = toData(input, fromFmt);
      const result = fromData(rows, toFmt);
      setOutput(result);
      setRowCount(rows.length);
      toast.success(`Converted ${rows.length} row${rows.length !== 1 ? "s" : ""} to ${FORMAT_LABELS[toFmt]}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setOutput("");
      setRowCount(null);
    }
  }, [input, fromFmt, toFmt]);

  const handleAutoDetect = () => {
    const detected = detectFormat(input.trim());
    if (detected) {
      setFromFmt(detected);
      toast.success(`Detected format: ${FORMAT_LABELS[detected]}`);
    } else {
      toast.error("Could not auto-detect format. Please select manually.");
    }
  };

  const loadSample = () => {
    setInput(SAMPLES[fromFmt]);
    setOutput("");
    setError(null);
    setRowCount(null);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${FORMAT_EXTENSIONS[toFmt]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as .${FORMAT_EXTENSIONS[toFmt]}`);
  };

  const swap = () => {
    setFromFmt(toFmt);
    setToFmt(fromFmt);
    setInput(output);
    setOutput("");
    setError(null);
    setRowCount(null);
  };

  const formats: Format[] = ["csv", "tsv", "json", "xml", "yaml"];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">File Converter</h1>
            <p className="text-sm text-muted-foreground">
              Convert between CSV, TSV, JSON, XML, and YAML — all in your browser
            </p>
          </div>
        </div>

        {/* Format selectors */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">From</Label>
                <Select value={fromFmt} onValueChange={(v) => setFromFmt(v as Format)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((f) => (
                      <SelectItem key={f} value={f}>{FORMAT_LABELS[f]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">To</Label>
                <Select value={toFmt} onValueChange={(v) => setToFmt(v as Format)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((f) => (
                      <SelectItem key={f} value={f}>{FORMAT_LABELS[f]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <Button variant="outline" size="sm" onClick={handleAutoDetect}>
                  Auto-detect
                </Button>
                <Button variant="outline" size="sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={swap} disabled={!output}>
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Swap
                </Button>
                <Button onClick={convert} size="sm">
                  Convert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Input
                  <Badge variant="secondary">{FORMAT_LABELS[fromFmt]}</Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => { setInput(""); setOutput(""); setError(null); setRowCount(null); }}
                >
                  Clear
                </Button>
              </div>
              <CardDescription className="text-xs">
                Paste your {FORMAT_LABELS[fromFmt]} data here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste ${FORMAT_LABELS[fromFmt]} data here...`}
                className="font-mono text-xs resize-none h-96"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Output
                  <Badge variant="secondary">{FORMAT_LABELS[toFmt]}</Badge>
                  {rowCount !== null && (
                    <Badge variant="outline" className="text-xs">
                      {rowCount} row{rowCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!output}>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadOutput} disabled={!output}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">
                Converted {FORMAT_LABELS[toFmt]} output
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <Textarea
                value={output}
                readOnly
                placeholder="Output will appear here after conversion..."
                className="font-mono text-xs resize-none h-96 bg-muted/30"
              />
            </CardContent>
          </Card>
        </div>

        {/* Supported formats info */}
        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
              {(
                [
                  { fmt: "csv", desc: "Comma-separated values" },
                  { fmt: "tsv", desc: "Tab-separated values" },
                  { fmt: "json", desc: "Array of objects" },
                  { fmt: "xml", desc: "Root with row children" },
                  { fmt: "yaml", desc: "List of key-value maps" },
                ] as { fmt: Format; desc: string }[]
              ).map(({ fmt, desc }) => (
                <div key={fmt} className="space-y-0.5">
                  <div className="font-semibold text-foreground">{FORMAT_LABELS[fmt]}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
