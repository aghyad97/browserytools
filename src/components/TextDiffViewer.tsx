"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Minimal diff using diff-match-patch algorithm port
// To avoid heavy deps, implement a simple line-based diff for MVP

interface DiffPart {
  type: "equal" | "add" | "remove";
  text: string;
}

function diffLines(a: string, b: string): DiffPart[] {
  const aLines = a.split(/\r?\n/);
  const bLines = b.split(/\r?\n/);
  const max = Math.max(aLines.length, bLines.length);
  const parts: DiffPart[] = [];
  for (let i = 0; i < max; i++) {
    const left = aLines[i];
    const right = bLines[i];
    if (left === undefined && right !== undefined) {
      parts.push({ type: "add", text: right });
    } else if (left !== undefined && right === undefined) {
      parts.push({ type: "remove", text: left });
    } else if (left === right) {
      parts.push({ type: "equal", text: left || "" });
    } else {
      if (left) parts.push({ type: "remove", text: left });
      if (right) parts.push({ type: "add", text: right });
    }
  }
  return parts;
}

export default function TextDiffViewer() {
  const [left, setLeft] = useState<string>("");
  const [right, setRight] = useState<string>("");

  const diff = useMemo(() => diffLines(left, right), [left, right]);

  const copyPatch = async () => {
    const lines: string[] = [];
    diff.forEach((p) => {
      const prefix = p.type === "add" ? "+" : p.type === "remove" ? "-" : " ";
      lines.push(`${prefix}${p.text}`);
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Patch copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Text Diff Viewer</CardTitle>
          <CardDescription>
            Compare two texts side by side and copy a simple patch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="min-h-[260px] font-mono text-sm"
              placeholder="Original text"
            />
            <Textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="min-h-[260px] font-mono text-sm"
              placeholder="Modified text"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={copyPatch}>
              Copy Patch
            </Button>
          </div>
          <div className="border rounded overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-3 border-r bg-muted/30">
                {left.split(/\r?\n/).map((line, i) => (
                  <div
                    key={i}
                    className="font-mono text-sm whitespace-pre-wrap break-words"
                  >
                    {line}
                  </div>
                ))}
              </div>
              <div className="p-3">
                {diff.map((p, i) => (
                  <div
                    key={i}
                    className={`font-mono text-sm whitespace-pre-wrap break-words rounded px-2 py-1 ${
                      p.type === "add"
                        ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200"
                        : p.type === "remove"
                        ? "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200"
                        : ""
                    }`}
                  >
                    {p.type === "add"
                      ? "+ "
                      : p.type === "remove"
                      ? "- "
                      : "  "}
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
