"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ModePicker } from "@/components/shared/ModePicker";
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
        </>
      }
      primaryAction={{ label: t("download"), onClick: handleDownload, disabled: !output }}
    >
      <div className="space-y-4">
        <SettingsCard>
          <OptionRow label={t("targetLabel")}>
            <ModePicker
              aria-label={t("targetLabel")}
              value={target}
              onChange={(v) => setTarget(v as Target)}
              options={[
                { value: "cursor", label: t("cursor") },
                { value: "windsurf", label: t("windsurf") },
                { value: "copilot", label: t("copilot") },
              ]}
            />
          </OptionRow>
          <div className="grid sm:grid-cols-2 gap-4">
            <OptionRow label={t("languageLabel")} htmlFor="rules-language">
              <Input
                id="rules-language"
                dir="auto"
                value={fields.language}
                onChange={set("language")}
                placeholder="TypeScript"
              />
            </OptionRow>
            <OptionRow label={t("frameworkLabel")} htmlFor="rules-framework">
              <Input
                id="rules-framework"
                dir="auto"
                value={fields.framework}
                onChange={set("framework")}
                placeholder={t("frameworkPlaceholder")}
              />
            </OptionRow>
          </div>
          <OptionRow label={t("styleLabel")} htmlFor="rules-style">
            <Textarea
              id="rules-style"
              dir="auto"
              value={fields.style}
              onChange={set("style")}
              placeholder={t("stylePlaceholder")}
              rows={3}
            />
          </OptionRow>
          <div className="grid sm:grid-cols-2 gap-4">
            <OptionRow label={t("doLabel")} htmlFor="rules-do">
              <Textarea
                id="rules-do"
                dir="auto"
                value={fields.doRules}
                onChange={set("doRules")}
                placeholder={t("doPlaceholder")}
                rows={4}
              />
            </OptionRow>
            <OptionRow label={t("dontLabel")} htmlFor="rules-dont">
              <Textarea
                id="rules-dont"
                dir="auto"
                value={fields.dontRules}
                onChange={set("dontRules")}
                placeholder={t("dontPlaceholder")}
                rows={4}
              />
            </OptionRow>
          </div>
        </SettingsCard>

        <OutputPanel
          text={output}
          title={
            <>
              {t("preview")} —{" "}
              <code className="text-xs bg-muted px-1 rounded">{FILENAMES[target]}</code>
            </>
          }
          copyLabel={t("copy")}
          copySuccessMessage={t("copied")}
        >
          {output ? undefined : (
            <p className="text-muted-foreground text-sm py-4 text-center">{t("emptyPreview")}</p>
          )}
        </OutputPanel>
      </div>
    </ToolShell>
  );
}
