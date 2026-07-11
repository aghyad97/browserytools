"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { downloadText } from "@/lib/download";

type Target = "cursor" | "windsurf" | "copilot";

const FILENAMES: Record<Target, string> = {
  cursor: ".cursorrules",
  windsurf: ".windsurfrules",
  copilot: "copilot-instructions.md",
};

function buildRules(
  target: Target,
  fields: {
    language: string;
    framework: string;
    style: string;
    doRules: string;
    dontRules: string;
  }
): string {
  const { language, framework, style, doRules, dontRules } = fields;
  const sections: string[] = [];

  if (target === "copilot") {
    sections.push("# GitHub Copilot Instructions");
    if (language || framework)
      sections.push(`## Stack\n${[language, framework].filter(Boolean).join(" — ")}`);
    if (style) sections.push(`## Code Style\n${style}`);
    if (doRules) sections.push(`## Always Do\n${doRules}`);
    if (dontRules) sections.push(`## Never Do\n${dontRules}`);
  } else {
    const ide = target === "cursor" ? "Cursor" : "Windsurf";
    if (language)
      sections.push(`# ${language}${framework ? ` + ${framework}` : ""} Rules for ${ide}`);
    if (style) sections.push(`## Code Style\n${style}`);
    if (doRules) sections.push(`## Always Do\n${doRules}`);
    if (dontRules) sections.push(`## Never Do\n${dontRules}`);
  }

  return sections.join("\n\n");
}

export default function AIRulesGenerator() {
  const t = useTranslations("Tools.AIRulesGenerator");
  const tc = useTranslations("ToolsConfig");
  const [target, setTarget] = useState<Target>("cursor");
  const [fields, setFields] = useState({
    language: "",
    framework: "",
    style: "",
    doRules: "",
    dontRules: "",
  });

  const output = buildRules(target, fields);

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleDownload = () => {
    if (!output) return;
    downloadText(output, FILENAMES[target], "text/plain");
  };

  return (
    <ToolShell
      slug="ai-rules-generator"
      title={tc("tools.ai-rules-generator.name")}
      sub={tc("tools.ai-rules-generator.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFields({ language: "", framework: "", style: "", doRules: "", dontRules: "" })
            }
          >
            {t("clearAll")}
          </Button>
          <CopyButton
            text={output}
            label={t("copy")}
            successMessage={t("copied")}
            disabled={!output}
          />
        </>
      }
      primaryAction={{ label: t("download"), onClick: handleDownload, disabled: !output }}
    >
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>{t("targetLabel")}</Label>
              <div className="flex flex-wrap gap-2">
                {(["cursor", "windsurf", "copilot"] as Target[]).map((tgt) => (
                  <button
                    key={tgt}
                    onClick={() => setTarget(tgt)}
                    className={`px-4 py-2 rounded-md text-sm border transition-colors ${
                      target === tgt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {t(tgt)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("languageLabel")}</Label>
                <Input dir="auto" value={fields.language} onChange={set("language")} placeholder="TypeScript" />
              </div>
              <div className="space-y-1.5">
                <Label>{t("frameworkLabel")}</Label>
                <Input
                  dir="auto"
                  value={fields.framework}
                  onChange={set("framework")}
                  placeholder={t("frameworkPlaceholder")}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("styleLabel")}</Label>
              <Textarea
                dir="auto"
                value={fields.style}
                onChange={set("style")}
                placeholder={t("stylePlaceholder")}
                rows={3}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("doLabel")}</Label>
                <Textarea
                  dir="auto"
                  value={fields.doRules}
                  onChange={set("doRules")}
                  placeholder={t("doPlaceholder")}
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("dontLabel")}</Label>
                <Textarea
                  dir="auto"
                  value={fields.dontRules}
                  onChange={set("dontRules")}
                  placeholder={t("dontPlaceholder")}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("preview")} —{" "}
              <code className="text-xs bg-muted px-1 rounded">{FILENAMES[target]}</code>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
                {output}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">{t("emptyPreview")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}
