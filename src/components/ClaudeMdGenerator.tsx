"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CLAUDE.md";
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("projectNameLabel")}</Label>
            <Input
              dir="auto"
              value={fields.projectName}
              onChange={set("projectName")}
              placeholder={t("projectNamePlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("descriptionLabel")}</Label>
            <Textarea
              dir="auto"
              value={fields.description}
              onChange={set("description")}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("techStackLabel")}</Label>
            <Textarea
              dir="auto"
              value={fields.techStack}
              onChange={set("techStack")}
              placeholder={t("techStackPlaceholder")}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("commandsLabel")}</Label>
            <Textarea
              dir="auto"
              value={fields.commands}
              onChange={set("commands")}
              placeholder={t("commandsPlaceholder")}
              rows={3}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("conventionsLabel")}</Label>
            <Textarea
              dir="auto"
              value={fields.conventions}
              onChange={set("conventions")}
              placeholder={t("conventionsPlaceholder")}
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
          <Button variant="outline" size="sm" onClick={handleClear}>
            {t("clearAll")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{t("preview")}</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy} disabled={!output}>
                {t("copy")}
              </Button>
              <Button size="sm" onClick={handleDownload} disabled={!output}>
                {t("download")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {output ? (
            <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
              {output}
            </pre>
          ) : (
            <p className="text-muted-foreground text-sm py-4 text-center">{t("emptyPreview")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
