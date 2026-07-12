"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { downloadText } from "@/lib/download";

function buildClaudeMd(fields: {
  projectName: string;
  description: string;
  techStack: string;
  commands: string;
  conventions: string;
  doRules: string;
  dontRules: string;
}): string {
  const { projectName, description, techStack, commands, conventions, doRules, dontRules } = fields;
  const sections: string[] = [];
  if (projectName) sections.push(`# ${projectName}`);
  if (description) sections.push(`## Overview\n${description}`);
  if (techStack) sections.push(`## Tech Stack\n${techStack}`);
  if (commands) sections.push(`## Key Commands\n\`\`\`\n${commands}\n\`\`\``);
  if (conventions) sections.push(`## Coding Conventions\n${conventions}`);
  if (doRules) sections.push(`## Do\n${doRules}`);
  if (dontRules) sections.push(`## Don't\n${dontRules}`);
  return sections.join("\n\n");
}

export default function ClaudeMdGenerator() {
  const t = useTranslations("Tools.ClaudeMdGenerator");
  const tc = useTranslations("ToolsConfig");
  const [fields, setFields] = useState({
    projectName: "",
    description: "",
    techStack: "",
    commands: "",
    conventions: "",
    doRules: "",
    dontRules: "",
  });

  const output = buildClaudeMd(fields);

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleDownload = () => {
    if (!output) return;
    downloadText(output, "CLAUDE.md", "text/markdown");
    toast.success(t("downloaded"));
  };

  const handleClear = () =>
    setFields({
      projectName: "",
      description: "",
      techStack: "",
      commands: "",
      conventions: "",
      doRules: "",
      dontRules: "",
    });

  return (
    <ToolShell
      slug="claude-md-generator"
      title={tc("tools.claude-md-generator.name")}
      sub={tc("tools.claude-md-generator.description")}
      controls={
        <>
          <Button variant="outline" size="sm" onClick={handleClear}>
            {t("clearAll")}
          </Button>
        </>
      }
      primaryAction={{ label: t("download"), onClick: handleDownload, disabled: !output }}
    >
      <div className="space-y-4">
        <SettingsCard>
          <OptionRow label={t("projectNameLabel")} htmlFor="cmd-project-name">
            <Input
              id="cmd-project-name"
              dir="auto"
              value={fields.projectName}
              onChange={set("projectName")}
              placeholder={t("projectNamePlaceholder")}
            />
          </OptionRow>
          <OptionRow label={t("descriptionLabel")} htmlFor="cmd-description">
            <Textarea
              id="cmd-description"
              dir="auto"
              value={fields.description}
              onChange={set("description")}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </OptionRow>
          <OptionRow label={t("techStackLabel")} htmlFor="cmd-tech-stack">
            <Textarea
              id="cmd-tech-stack"
              dir="auto"
              value={fields.techStack}
              onChange={set("techStack")}
              placeholder={t("techStackPlaceholder")}
              rows={2}
            />
          </OptionRow>
          <OptionRow label={t("commandsLabel")} htmlFor="cmd-commands">
            <Textarea
              id="cmd-commands"
              dir="auto"
              value={fields.commands}
              onChange={set("commands")}
              placeholder={t("commandsPlaceholder")}
              rows={3}
              className="font-mono text-sm"
            />
          </OptionRow>
          <OptionRow label={t("conventionsLabel")} htmlFor="cmd-conventions">
            <Textarea
              id="cmd-conventions"
              dir="auto"
              value={fields.conventions}
              onChange={set("conventions")}
              placeholder={t("conventionsPlaceholder")}
              rows={3}
            />
          </OptionRow>
          <div className="grid sm:grid-cols-2 gap-4">
            <OptionRow label={t("doLabel")} htmlFor="cmd-do">
              <Textarea
                id="cmd-do"
                dir="auto"
                value={fields.doRules}
                onChange={set("doRules")}
                placeholder={t("doPlaceholder")}
                rows={4}
              />
            </OptionRow>
            <OptionRow label={t("dontLabel")} htmlFor="cmd-dont">
              <Textarea
                id="cmd-dont"
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
          title={t("preview")}
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
