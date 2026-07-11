"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

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
  const t = useTranslations("Tools.TextDiffViewer");
  const tc = useTranslations("ToolsConfig");

  const [left, setLeft] = useState<string>("");
  const [right, setRight] = useState<string>("");

  const diff = useMemo(() => diffLines(left, right), [left, right]);

  const patchText = useMemo(
    () =>
      diff
        .map((p) => {
          const prefix = p.type === "add" ? "+" : p.type === "remove" ? "-" : " ";
          return `${prefix}${p.text}`;
        })
        .join("\n"),
    [diff],
  );

  return (
    <ToolShell
      slug="text-diff"
      title={tc("tools.text-diff.name")}
      sub={tc("tools.text-diff.description")}
      controls={
        <CopyButton
          text={patchText}
          label={t("copyPatch")}
          successMessage={t("patchCopied")}
          errorMessage={t("copyFailed")}
        />
      }
    >
      <Card className="shadow-none">
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="min-h-[260px] font-mono text-sm"
              placeholder={t("originalPlaceholder")}
            />
            <Textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="min-h-[260px] font-mono text-sm"
              placeholder={t("modifiedPlaceholder")}
            />
          </div>
          <div className="border rounded overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-3 border-r rtl:border-r-0 rtl:border-l bg-muted/30">
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
    </ToolShell>
  );
}
