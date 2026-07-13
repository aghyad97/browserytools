"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

const SAMPLES: Record<string, string> = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  sequence: `sequenceDiagram
    Alice->>John: Hello John!
    John-->>Alice: Great to hear!
    Alice-)John: See you later!`,
  er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : referenced`,
};

let mermaidId = 0;

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

let mermaidInstance: MermaidApi | null = null;

async function loadMermaid(): Promise<MermaidApi> {
  if (mermaidInstance) return mermaidInstance;
  const mod = await import("mermaid");
  mermaidInstance = mod.default as unknown as MermaidApi;
  return mermaidInstance;
}

export default function MermaidViewer() {
  const t = useTranslations("Tools.MermaidViewer");
  const tc = useTranslations("ToolsConfig");
  const [code, setCode] = useState(SAMPLES.flowchart);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!code.trim()) { setSvg(""); setError(""); return; }
      try {
        const mermaid = await loadMermaid();
        mermaid.initialize({ startOnLoad: false, theme: "neutral" });
        const id = `mermaid-${++mermaidId}`;
        const { svg: rendered } = await mermaid.render(id, code.trim());
        setSvg(rendered);
        setError("");
      } catch {
        setError(t("errorRender"));
        setSvg("");
      }
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [code, t]);

  return (
    <ToolShell
      slug="mermaid"
      title={tc("tools.mermaid.name")}
      sub={tc("tools.mermaid.description")}
      width="wide"
    >
      <div className="space-y-4">
      <SettingsCard>
        <OptionRow label={t("inputLabel")} htmlFor="mermaid-input">
          <Textarea id="mermaid-input" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")} className="min-h-[200px] font-mono text-sm resize-y" />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </OptionRow>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(SAMPLES).map((key) => (
            <Button key={key} variant="outline" size="sm" onClick={() => setCode(SAMPLES[key])}>{key}</Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCode("")}>{t("clearAll")}</Button>
          {code && <CopyButton text={code} label={t("copyCode")} successMessage={t("copied")} />}
        </div>
      </SettingsCard>

      {svg && (
        <SettingsCard title={t("previewLabel")}>
          <div
            className="overflow-x-auto flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </SettingsCard>
      )}
      </div>
    </ToolShell>
  );
}
