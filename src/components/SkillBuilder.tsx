"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type OutputFormat = "markdown" | "yaml" | "json";

function buildSkill(
  name: string,
  description: string,
  triggers: string,
  instructions: string,
  fmt: OutputFormat,
): string {
  const triggerList = triggers
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (fmt === "markdown") {
    const frontmatter = [
      "---",
      `name: ${name || "skill-name"}`,
      `description: ${description || ""}`,
      triggerList.length
        ? `triggers:\n${triggerList.map((t) => `  - ${t}`).join("\n")}`
        : "",
      "---",
    ]
      .filter(Boolean)
      .join("\n");
    return `${frontmatter}\n\n# ${name || "Skill Name"}\n\n${instructions || ""}`;
  }

  if (fmt === "yaml") {
    return [
      `name: ${name || "skill-name"}`,
      `description: "${description || ""}"`,
      triggerList.length
        ? `triggers:\n${triggerList.map((t) => `  - "${t}"`).join("\n")}`
        : "triggers: []",
      `instructions: |`,
      (instructions || "").split("\n").map((l) => `  ${l}`).join("\n"),
    ].join("\n");
  }

  return JSON.stringify(
    {
      name: name || "skill-name",
      description: description || "",
      triggers: triggerList,
      instructions: instructions || "",
    },
    null,
    2,
  );
}

export default function SkillBuilder() {
  const t = useTranslations("Tools.SkillBuilder");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggers, setTriggers] = useState("");
  const [instructions, setInstructions] = useState("");
  const [format, setFormat] = useState<OutputFormat>("markdown");

  const output = buildSkill(name, description, triggers, instructions, format);
  const filename = `${name || "skill"}.${format === "markdown" ? "md" : format === "yaml" ? "yaml" : "json"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setName("");
    setDescription("");
    setTriggers("");
    setInstructions("");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("nameLabel")}</Label>
              <Input
                dir="auto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("triggersLabel")}</Label>
              <Input
                dir="auto"
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
                placeholder={t("triggersPlaceholder")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("descriptionLabel")}</Label>
            <Textarea
              dir="auto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("instructionsLabel")}</Label>
            <Textarea
              dir="auto"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("instructionsPlaceholder")}
              rows={8}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleClear}>
            {t("clearAll")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">
              {t("preview")} —{" "}
              <code className="text-xs bg-muted px-1 rounded">{filename}</code>
            </CardTitle>
            <div className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
              >
                <option value="markdown">{t("formatMarkdown")}</option>
                <option value="yaml">{t("formatYaml")}</option>
                <option value="json">{t("formatJson")}</option>
              </select>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {t("copy")}
              </Button>
              <Button size="sm" onClick={handleDownload}>
                {t("download")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {name || description || instructions ? (
            <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
              {output}
            </pre>
          ) : (
            <p className="text-muted-foreground text-sm py-4 text-center">
              {t("emptyPreview")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
