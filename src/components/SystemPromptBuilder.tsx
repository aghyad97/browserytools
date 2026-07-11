"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

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
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    rows?: number;
  }) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        dir="auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y"
      />
    </div>
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
          <CopyButton
            text={preview}
            label={t("copyPrompt")}
            successMessage={t("copied")}
            disabled={!preview}
          />
        </>
      }
    >
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Field
              label={t("roleLabel")}
              value={role}
              onChange={setRole}
              placeholder={t("rolePlaceholder")}
              rows={3}
            />
            <Field
              label={t("toneLabel")}
              value={tone}
              onChange={setTone}
              placeholder={t("tonePlaceholder")}
              rows={2}
            />
            <Field
              label={t("constraintsLabel")}
              value={constraints}
              onChange={setConstraints}
              placeholder={t("constraintsPlaceholder")}
              rows={3}
            />
            <Field
              label={t("outputFormatLabel")}
              value={outputFmt}
              onChange={setOutputFmt}
              placeholder={t("outputFormatPlaceholder")}
              rows={2}
            />
            <Field
              label={t("examplesLabel")}
              value={examples}
              onChange={setExamples}
              placeholder={t("examplesPlaceholder")}
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("preview")}</CardTitle>
          </CardHeader>
          <CardContent>
            {preview ? (
              <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words">
                {preview}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">
                {t("emptyPreview")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}
