"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

export default function MermaidViewer() {
  const t = useTranslations("Tools.MermaidViewer");
  const [code, setCode] = useState(SAMPLES.flowchart);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      if (!code.trim()) { setSvg(""); setError(""); return; }
      try {
        const [{ default: mermaid }, { default: DOMPurify }] = await Promise.all([
          import("mermaid"),
          import("dompurify"),
        ]);
        mermaid.initialize({ startOnLoad: false, theme: "neutral" });
        const id = `mermaid-${++mermaidId}`;
        const { svg: rendered } = await mermaid.render(id, code.trim());
        if (!cancelled) {
          const clean = DOMPurify.sanitize(rendered, { USE_PROFILES: { svg: true, svgFilters: true } });
          setSvg(clean);
          setError("");
        }
      } catch {
        if (!cancelled) { setError(t("errorRender")); setSvg(""); }
      }
    };
    const timer = setTimeout(render, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [code, t]);

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("inputLabel")}</Label>
            <Textarea dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")} className="min-h-[200px] font-mono text-sm resize-y" />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(SAMPLES).map((key) => (
              <Button key={key} variant="outline" size="sm" onClick={() => setCode(SAMPLES[key])}>{key}</Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCode("")}>{t("clearAll")}</Button>
            {code && <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(code); toast.success(t("copied")); }}>{t("copyCode")}</Button>}
          </div>
        </CardContent>
      </Card>

      {svg && (
        <Card>
          <CardHeader><CardTitle className="text-base">{t("previewLabel")}</CardTitle></CardHeader>
          <CardContent>
            <div
              className="overflow-x-auto flex justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
