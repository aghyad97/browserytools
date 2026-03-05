"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Format = "plain" | "chatml" | "llama3" | "claude_xml" | "openai_json";

function formatPrompt(system: string, user: string, assistant: string, fmt: Format): string {
  if (fmt === "plain") {
    return [
      system && `System: ${system}`,
      user && `\nUser: ${user}`,
      assistant && `\nAssistant: ${assistant}`,
    ].filter(Boolean).join("\n");
  }

  if (fmt === "chatml") {
    return [
      system && `<|im_start|>system\n${system}<|im_end|>`,
      user && `<|im_start|>user\n${user}<|im_end|>`,
      assistant && `<|im_start|>assistant\n${assistant}<|im_end|>`,
      !assistant && `<|im_start|>assistant`,
    ].filter(Boolean).join("\n");
  }

  if (fmt === "llama3") {
    return [
      "<|begin_of_text|>",
      system && `<|start_header_id|>system<|end_header_id|>\n\n${system}<|eot_id|>`,
      user && `<|start_header_id|>user<|end_header_id|>\n\n${user}<|eot_id|>`,
      `<|start_header_id|>assistant<|end_header_id|>`,
      assistant && `\n\n${assistant}`,
    ].filter(Boolean).join("\n");
  }

  if (fmt === "claude_xml") {
    return [
      system && `<system>${system}</system>`,
      user && `<human>${user}</human>`,
      assistant && `<assistant>${assistant}</assistant>`,
    ].filter(Boolean).join("\n");
  }

  // openai_json
  const messages: Array<{ role: string; content: string }> = [];
  if (system) messages.push({ role: "system", content: system });
  if (user) messages.push({ role: "user", content: user });
  if (assistant) messages.push({ role: "assistant", content: assistant });
  return JSON.stringify(messages, null, 2);
}

export default function PromptFormatter() {
  const t = useTranslations("Tools.PromptFormatter");
  const [system, setSystem] = useState("");
  const [user, setUser] = useState("");
  const [assistant, setAssistant] = useState("");
  const [format, setFormat] = useState<Format>("chatml");

  const output = formatPrompt(system, user, assistant, format);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setSystem("");
    setUser("");
    setAssistant("");
  };

  const FORMAT_OPTIONS: Array<{ value: Format; label: string }> = [
    { value: "plain", label: t("formatPlain") },
    { value: "chatml", label: t("formatChatML") },
    { value: "llama3", label: t("formatLlama3") },
    { value: "claude_xml", label: t("formatClaudeXml") },
    { value: "openai_json", label: t("formatOpenAI") },
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("systemLabel")}</Label>
            <Textarea
              dir="auto"
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              placeholder={t("systemPlaceholder")}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("userLabel")}</Label>
            <Textarea
              dir="auto"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={t("userPlaceholder")}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("assistantLabel")}</Label>
            <Textarea
              dir="auto"
              value={assistant}
              onChange={(e) => setAssistant(e.target.value)}
              placeholder={t("assistantPlaceholder")}
              rows={2}
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
            <CardTitle className="text-base">{t("output")}</CardTitle>
            <div className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
              >
                {FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button size="sm" onClick={handleCopy} disabled={!output}>
                {t("copy")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {output ? (
            <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto max-h-[400px] overflow-y-auto">
              {output}
            </pre>
          ) : (
            <p className="text-muted-foreground text-sm py-4 text-center">
              {t("systemPlaceholder")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
