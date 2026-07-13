"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";

type Align = "left" | "center" | "right";
interface Col { header: string; align: Align }

const SAMPLE_COLS: Col[] = [{ header: "Name", align: "left" }, { header: "Role", align: "left" }, { header: "Score", align: "right" }];
const SAMPLE_ROWS = [["Alice", "Engineer", "98"], ["Bob", "Designer", "87"], ["Carol", "Manager", "92"]];

function buildMarkdown(cols: Col[], rows: string[][]): string {
  const widths = cols.map((c, i) => Math.max(c.header.length, 3, ...rows.map((r) => (r[i] ?? "").length)));
  const pad = (s: string, w: number) => s.padEnd(w, " ");
  const header = "| " + cols.map((c, i) => pad(c.header, widths[i])).join(" | ") + " |";
  const sep = "| " + cols.map((c, i) => {
    const w = widths[i];
    if (c.align === "center") return ":" + "-".repeat(w - 2) + ":";
    if (c.align === "right") return "-".repeat(w - 1) + ":";
    return "-".repeat(w);
  }).join(" | ") + " |";
  const body = rows.map((row) => "| " + cols.map((_, i) => pad(row[i] ?? "", widths[i])).join(" | ") + " |");
  return [header, sep, ...body].join("\n");
}

export default function MarkdownTableGenerator() {
  const t = useTranslations("Tools.MarkdownTableGenerator");
  const tc = useTranslations("ToolsConfig");
  const [cols, setCols] = useState<Col[]>([{ header: "Column 1", align: "left" }, { header: "Column 2", align: "left" }]);
  const [rows, setRows] = useState<string[][]>([["", ""], ["", ""]]);

  const addCol = () => { setCols(c => [...c, { header: `Column ${c.length + 1}`, align: "left" }]); setRows(r => r.map(row => [...row, ""])); };
  const removeCol = () => { if (cols.length <= 1) return; setCols(c => c.slice(0, -1)); setRows(r => r.map(row => row.slice(0, -1))); };
  const addRow = () => setRows(r => [...r, Array(cols.length).fill("")]);
  const removeRow = () => { if (rows.length > 1) setRows(r => r.slice(0, -1)); };

  const AlignBtn = ({ col, align, label }: { col: number; align: Align; label: string }) => (
    <button onClick={() => setCols(c => c.map((col2, j) => j === col ? { ...col2, align } : col2))}
      className={`px-1.5 py-0.5 text-xs rounded border transition-colors ${cols[col].align === align ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
      {label}
    </button>
  );

  const markdown = buildMarkdown(cols, rows);

  return (
    <ToolShell
      slug="markdown-table"
      title={tc("tools.markdown-table.name")}
      sub={tc("tools.markdown-table.description")}
      controls={
        <Button variant="outline" size="sm" onClick={() => { setCols(SAMPLE_COLS); setRows(SAMPLE_ROWS); }}>{t("loadSample")}</Button>
      }
    >
      <div className="space-y-4">
      <SettingsCard>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={addCol}>{t("addColumn")}</Button>
          <Button variant="outline" size="sm" onClick={removeCol} disabled={cols.length <= 1}>{t("removeColumn")}</Button>
          <Button variant="outline" size="sm" onClick={addRow}>{t("addRow")}</Button>
          <Button variant="outline" size="sm" onClick={removeRow} disabled={rows.length <= 1}>{t("removeRow")}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="border-collapse w-full text-sm">
            <thead>
              <tr>
                {cols.map((col, i) => (
                  <th key={i} className="border p-2 bg-muted min-w-[120px]">
                    <Input value={col.header} onChange={(e) => setCols(c => c.map((col2, j) => j === i ? { ...col2, header: e.target.value } : col2))} className="h-7 text-xs font-semibold" placeholder={t("headerPlaceholder")} />
                    <div className="flex gap-1 mt-1 justify-center">
                      <AlignBtn col={i} align="left" label="←" />
                      <AlignBtn col={i} align="center" label="↔" />
                      <AlignBtn col={i} align="right" label="→" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {cols.map((_, ci) => (
                    <td key={ci} className="border p-1">
                      <Input value={row[ci] ?? ""} onChange={(e) => setRows(rows2 => rows2.map((r, rj) => rj === ri ? r.map((cell, cj) => cj === ci ? e.target.value : cell) : r))} className="h-7 text-xs" placeholder={t("cellPlaceholder")} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <OutputPanel
        text={markdown}
        title={t("markdownOutput")}
        copyLabel={t("copyMarkdown")}
        copySuccessMessage={t("copied")}
      />
      </div>
    </ToolShell>
  );
}
