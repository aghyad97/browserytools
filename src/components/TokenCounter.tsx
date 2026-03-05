"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { encode } from "gpt-tokenizer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AI_MODELS } from "@/lib/ai-models";

interface ModelOption {
  id: string;
  label: string;
  multiplier: number;
}

const MODEL_OPTIONS: ModelOption[] = [
  { id: "gpt-4o", label: "GPT-4o", multiplier: 1.0 },
  { id: "gpt-4o-mini", label: "GPT-4o mini", multiplier: 1.0 },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", multiplier: 1.05 },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", multiplier: 1.05 },
  { id: "llama-3-3-70b", label: "Llama 3.3 70B", multiplier: 1.02 },
  { id: "gemini-2-0-flash", label: "Gemini 2.0 Flash", multiplier: 1.0 },
];

const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate token counting across different AI models. Token counts can vary slightly between models due to differences in their tokenization algorithms. GPT-4 uses the cl100k_base tokenizer, while Claude uses its own tokenizer with slightly different behavior.";

export default function TokenCounter() {
  const t = useTranslations("Tools.TokenCounter");
  const [text, setText] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("gpt-4o");

  const selectedOption =
    MODEL_OPTIONS.find((m) => m.id === selectedModelId) ?? MODEL_OPTIONS[0];
  const aiModel = AI_MODELS.find((m) => m.id === selectedModelId);

  const rawTokens = text ? encode(text).length : 0;
  const tokens = Math.round(rawTokens * selectedOption.multiplier);
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const inputCost = aiModel ? (tokens / 1_000_000) * aiModel.inputPricePer1M : 0;
  const outputCost = aiModel
    ? (tokens / 1_000_000) * aiModel.outputPricePer1M
    : 0;

  const formatCost = (cost: number) => {
    if (cost === 0) return "$0.00";
    if (cost < 0.000001) return `$${cost.toExponential(2)}`;
    if (cost < 0.01) return `$${cost.toFixed(6)}`;
    return `$${cost.toFixed(4)}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tokens.toString());
    toast.success(t("copiedToClipboard"));
  };

  const StatCard = ({
    label,
    value,
    sub,
  }: {
    label: string;
    value: string | number;
    sub?: string;
  }) => (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("modelLabel")}</Label>
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("inputLabel")}</Label>
            <Textarea
              dir="auto"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="min-h-[200px] font-mono text-sm resize-y"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText(SAMPLE_TEXT)}
            >
              {t("loadSample")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setText("")}>
              {t("clearAll")}
            </Button>
            {text && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {t("totalTokens")}: {tokens.toLocaleString()}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {text ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label={t("totalTokens")}
            value={tokens.toLocaleString()}
          />
          <StatCard
            label={t("characters")}
            value={characters.toLocaleString()}
          />
          <StatCard label={t("words")} value={words.toLocaleString()} />
          <StatCard
            label={t("estimatedCost")}
            value={formatCost(inputCost)}
            sub={t("inputCost")}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noText")}
          </CardContent>
        </Card>
      )}

      {text && aiModel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {aiModel.name} — {aiModel.provider}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("inputCost")}</p>
                <p className="font-medium">{formatCost(inputCost)}</p>
                <p className="text-xs text-muted-foreground">
                  ${aiModel.inputPricePer1M}/1M tokens
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("outputCost")}</p>
                <p className="font-medium">{formatCost(outputCost)}</p>
                <p className="text-xs text-muted-foreground">
                  ${aiModel.outputPricePer1M}/1M tokens
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("assumingOutputLabel")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
