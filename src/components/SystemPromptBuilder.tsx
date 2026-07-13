"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";

type ExportFormat = "plain" | "xml" | "json";

function buildPrompt(
  role: string,
  tone: string,
  constraints: string,
  outputFormat: string,
  examples: string,
  format: ExportFormat
): string {
  const parts = [role, tone, constraints, outputFormat, examples].filter(Boolean);
  if (!parts.some(Boolean)) return "";

  if (format === "plain") {
    return [
      role && `You are ${role}.`,
      tone && `\nTone & Style:\n${tone}`,
      constraints && `\nRules:\n${constraints}`,
      outputFormat && `\nOutput Format:\n${outputFormat}`,
      examples && `\nExamples:\n${examples}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (format === "xml") {
    return [
      "<system>",
      role && `  <role>${role}</role>`,
      tone && `  <tone>${tone}</tone>`,
      constraints && `  <constraints>${constraints}</constraints>`,
      outputFormat && `  <output_format>${outputFormat}</output_format>`,
      examples && `  <examples>${examples}</examples>`,
      "</system>",
    ]
      .filter(Boolean)
      .join("\n");
  }

  // json / ChatML
  const content = [
    role && `You are ${role}.`,
    tone && `\nTone: ${tone}`,
    constraints && `\nRules:\n${constraints}`,
    outputFormat && `\nOutput format: ${outputFormat}`,
    examples && `\nExamples:\n${examples}`,
  ]
    .filter(Boolean)
    .join("");
  return JSON.stringify({ role: "system", content }, null, 2);
}

export default function SystemPromptBuilder() {
  const t = useTranslations("Tools.SystemPromptBuilder");
  const tc = useTranslations("ToolsConfig");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("");
  const [constraints, setConstraints] = useState("");
  const [outputFmt, setOutputFmt] = useState("");
  const [examples, setExamples] = useState("");
  const [format, setFormat] = useState<ExportFormat>("plain");

  const preview = buildPrompt(role, tone, constraints, outputFmt, examples, format);

  const handleClear = () => {
    setRole("");
    setTone("");
    setConstraints("");
    setOutputFmt("");
    setExamples("");
  };

  const Field = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    rows?: number;
  }) => (
    <OptionRow label={label} htmlFor={id}>
      <Textarea
        id={id}
        dir="auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y"
      />
    </OptionRow>
  );

  return (
    <ToolShell
      slug="system-prompt-builder"
      title={tc("tools.system-prompt-builder.name")}
      sub={tc("tools.system-prompt-builder.description")}
      controls={
        <>
          <select
            className="text-sm border rounded px-2 py-1 bg-background"
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
          >
            <option value="plain">{t("formatPlain")}</option>
            <option value="xml">{t("formatXml")}</option>
            <option value="json">{t("formatJson")}</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleClear}>
            {t("clearAll")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SettingsCard>
          <Field
            id="spb-role"
            label={t("roleLabel")}
            value={role}
            onChange={setRole}
            placeholder={t("rolePlaceholder")}
            rows={3}
          />
          <Field
            id="spb-tone"
            label={t("toneLabel")}
            value={tone}
            onChange={setTone}
            placeholder={t("tonePlaceholder")}
            rows={2}
          />
          <Field
            id="spb-constraints"
            label={t("constraintsLabel")}
            value={constraints}
            onChange={setConstraints}
            placeholder={t("constraintsPlaceholder")}
            rows={3}
          />
          <Field
            id="spb-output-format"
            label={t("outputFormatLabel")}
            value={outputFmt}
            onChange={setOutputFmt}
            placeholder={t("outputFormatPlaceholder")}
            rows={2}
          />
          <Field
            id="spb-examples"
            label={t("examplesLabel")}
            value={examples}
            onChange={setExamples}
            placeholder={t("examplesPlaceholder")}
            rows={3}
          />
        </SettingsCard>

        <OutputPanel
          text={preview}
          title={t("preview")}
          copyLabel={t("copyPrompt")}
          copySuccessMessage={t("copied")}
        >
          {preview ? undefined : (
            <p className="text-muted-foreground text-sm py-4 text-center">
              {t("emptyPreview")}
            </p>
          )}
        </OutputPanel>
      </div>
    </ToolShell>
  );
}
