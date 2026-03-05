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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AI_MODELS } from "@/lib/ai-models";

const MULTIPLIERS: Record<string, number> = {
  "claude-opus-4-6": 1.05,
  "claude-sonnet-4-6": 1.05,
  "claude-haiku-4-5": 1.05,
  "llama-3-3-70b": 1.02,
};

const SAMPLE_TEXT =
  "You are a helpful AI assistant specializing in software engineering.\n\nUser: Can you help me write a fibonacci function in TypeScript?\n\nAssistant: Here's an efficient memoized implementation...";

export default function ContextWindowCalculator() {
  const t = useTranslations("Tools.ContextWindow");
  const [text, setText] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(AI_MODELS[0].id);

  const selectedModel =
    AI_MODELS.find((m) => m.id === selectedModelId) ?? AI_MODELS[0];
  const multiplier = MULTIPLIERS[selectedModelId] ?? 1.0;
  const tokenCount = text
    ? Math.round(encode(text).length * multiplier)
    : 0;
  const contextWindow = selectedModel.contextWindow;
  const usagePercent = Math.min((tokenCount / contextWindow) * 100, 100);
  const remaining = Math.max(contextWindow - tokenCount, 0);

  const getBarColor = () => {
    if (usagePercent < 50) return "bg-green-500";
    if (usagePercent < 80) return "bg-yellow-500";
    if (usagePercent < 95) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusBadge = () => {
    if (usagePercent < 50) return { label: "OK", className: "bg-green-500 text-white" };
    if (usagePercent < 80) return { label: t("dangerZone").split(":")[0], className: "bg-yellow-500 text-white" };
    return { label: t("criticalZone").split(":")[0], className: "bg-red-500 text-white" };
  };

  const status = getStatusBadge();

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
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} ({model.provider})
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">
              {selectedModel.name} — {selectedModel.provider}
            </CardTitle>
            {text && (
              <Badge className={status.className}>{status.label}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("tokenCount")}</span>
              <span className="font-medium tabular-nums">
                {tokenCount.toLocaleString()} /{" "}
                {contextWindow.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBarColor()}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {usagePercent.toFixed(1)}% {t("percentFilled")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-muted-foreground text-xs">{t("tokenCount")}</p>
              <p className="font-bold text-xl tabular-nums">
                {tokenCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-muted-foreground text-xs">{t("contextWindow")}</p>
              <p className="font-bold text-xl tabular-nums">
                {contextWindow.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-muted-foreground text-xs">{t("contextUsed")}</p>
              <p className="font-bold text-xl tabular-nums">
                {usagePercent.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-muted-foreground text-xs">{t("tokensRemaining")}</p>
              <p className="font-bold text-xl tabular-nums">
                {remaining.toLocaleString()}
              </p>
            </div>
          </div>

          {usagePercent >= 80 && (
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              {usagePercent >= 95 ? t("criticalZone") : t("dangerZone")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}