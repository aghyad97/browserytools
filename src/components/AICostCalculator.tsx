"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AI_MODELS } from "@/lib/ai-models";

export default function AICostCalculator() {
  const t = useTranslations("Tools.AICostCalculator");
  const [modelId, setModelId] = useState("gpt-4o");
  const [inputTokens, setInputTokens] = useState<string>("1000");
  const [outputTokens, setOutputTokens] = useState<string>("500");
  const [requests, setRequests] = useState<string>("1");

  const model = AI_MODELS.find((m) => m.id === modelId) ?? AI_MODELS[0];
  const inp = parseInt(inputTokens) || 0;
  const out = parseInt(outputTokens) || 0;
  const reqs = parseInt(requests) || 1;

  const inputCostPerReq = (inp / 1_000_000) * model.inputPricePer1M;
  const outputCostPerReq = (out / 1_000_000) * model.outputPricePer1M;
  const totalPerReq = inputCostPerReq + outputCostPerReq;
  const totalAll = totalPerReq * reqs;

  const fmt = (n: number) => {
    if (n === 0) return "$0.000000";
    if (n < 0.000001) return `$${n.toExponential(3)}`;
    if (n < 0.01) return `$${n.toFixed(6)}`;
    if (n < 1) return `$${n.toFixed(4)}`;
    return `$${n.toFixed(2)}`;
  };

  const handleReset = () => {
    setInputTokens("1000");
    setOutputTokens("500");
    setRequests("1");
    setModelId("gpt-4o");
  };

  const CostRow = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      <p className="font-mono font-semibold text-lg">{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("modelLabel")}</Label>
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{t("inputPrice")}: ${model.inputPricePer1M} {t("per1MTokens")}</span>
              <span>{t("outputPrice")}: ${model.outputPricePer1M} {t("per1MTokens")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("inputTokensLabel")}</Label>
              <Input
                dir="auto"
                type="number"
                min="0"
                value={inputTokens}
                onChange={(e) => setInputTokens(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("outputTokensLabel")}</Label>
              <Input
                dir="auto"
                type="number"
                min="0"
                value={outputTokens}
                onChange={(e) => setOutputTokens(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("requestsLabel")}</Label>
              <Input
                dir="auto"
                type="number"
                min="1"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>
            {t("resetAll")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-1">
          <CostRow label={t("inputCost")} value={fmt(inputCostPerReq)} sub={t("perRequest")} />
          <Separator />
          <CostRow label={t("outputCost")} value={fmt(outputCostPerReq)} sub={t("perRequest")} />
          <Separator />
          <CostRow label={t("totalCost")} value={fmt(totalPerReq)} sub={t("perRequest")} />
          {reqs > 1 && (
            <>
              <Separator />
              <CostRow
                label={t("totalCost")}
                value={fmt(totalAll)}
                sub={`${t("totalForRequests")} (×${reqs.toLocaleString()})`}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
