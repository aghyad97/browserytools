"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";

function sanitizeName(s: string): string {
  return s.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[0-9]/, "_$&");
}
function ucFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function jsonToTs(json: unknown, name: string, optionalNulls: boolean): string {
  const interfaces: string[] = [];
  const seen = new Set<string>();

  function getType(value: unknown, fieldName: string, parentName: string): string {
    if (value === null) return optionalNulls ? "null" : "unknown";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      return `${getType(value[0], fieldName, parentName)}[]`;
    }
    if (typeof value === "object") {
      const childName = ucFirst(sanitizeName(fieldName || parentName + "Item"));
      buildInterface(value as Record<string, unknown>, childName);
      return childName;
    }
    return "unknown";
  }

  function buildInterface(obj: Record<string, unknown>, ifName: string): void {
    if (seen.has(ifName)) return;
    seen.add(ifName);
    const lines = [`interface ${ifName} {`];
    for (const [key, val] of Object.entries(obj)) {
      const fieldType = getType(val, key, ifName);
      const optional = optionalNulls && val === null ? "?" : "";
      lines.push(`  ${sanitizeName(key)}${optional}: ${fieldType};`);
    }
    lines.push("}");
    interfaces.push(lines.join("\n"));
  }

  const rootName = sanitizeName(name) || "Root";
  if (Array.isArray(json)) {
    buildInterface((json[0] ?? {}) as Record<string, unknown>, rootName + "Item");
  } else if (typeof json === "object" && json !== null) {
    buildInterface(json as Record<string, unknown>, rootName);
  }
  return interfaces.reverse().join("\n\n");
}

const SAMPLE = JSON.stringify({
  id: 1, name: "Alice", email: "alice@example.com", active: true, score: 98.5,
  address: { street: "123 Main St", city: "Springfield", zip: "12345" },
  tags: ["admin", "user"],
}, null, 2);

export default function JsonToTs() {
  const t = useTranslations("Tools.JsonToTs");
  const tc = useTranslations("ToolsConfig");
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("");
  const [optionalNulls, setOptionalNulls] = useState(false);
  const [error, setError] = useState("");

  let output = "";
  if (input.trim()) {
    try {
      output = jsonToTs(JSON.parse(input), rootName || "Root", optionalNulls);
      if (error) setError("");
    } catch {
      if (!error) setError(t("errorInvalidJson"));
    }
  }

  return (
    <ToolShell
      slug="json-to-ts"
      title={tc("tools.json-to-ts.name")}
      sub={tc("tools.json-to-ts.description")}
    >
      <div className="space-y-4">
      <SettingsCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OptionRow label={t("rootName")} htmlFor="jsonToTs-rootName">
            <Input id="jsonToTs-rootName" value={rootName} onChange={(e) => setRootName(e.target.value)} placeholder={t("rootNamePlaceholder")} />
          </OptionRow>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={optionalNulls} onChange={(e) => setOptionalNulls(e.target.checked)} className="rounded" />
              {t("optionalFields")}
            </label>
          </div>
        </div>
        <OptionRow label={t("inputLabel")} htmlFor="jsonToTs-input">
          <Textarea id="jsonToTs-input" dir="auto" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("inputPlaceholder")} className="min-h-[220px] font-mono text-sm resize-y" />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </OptionRow>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>{t("loadSample")}</Button>
          <Button variant="outline" size="sm" onClick={() => { setInput(""); setRootName(""); }}>{t("clearAll")}</Button>
        </div>
      </SettingsCard>

      {output && (
        <OutputPanel
          text={output}
          title={
            <span className="inline-flex items-center gap-2">
              {t("outputLabel")}
              <Badge variant="secondary">TypeScript</Badge>
            </span>
          }
          copyLabel={t("copyOutput")}
          copySuccessMessage={t("copied")}
        >
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{output}</pre>
        </OutputPanel>
      )}
      </div>
    </ToolShell>
  );
}
