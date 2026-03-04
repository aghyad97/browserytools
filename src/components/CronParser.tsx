"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";
import { toast } from "sonner";

export default function CronParser() {
  const t = useTranslations("Tools.CronParser");
  const [activeTab, setActiveTab] = useState<string>("parse");
  const [expr, setExpr] = useState<string>("*/5 * * * *");
  const [count, setCount] = useState<number>(5);
  const [tz, setTz] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );

  // Builder state
  const [min, setMin] = useState<string>("*");
  const [hour, setHour] = useState<string>("*");
  const [dom, setDom] = useState<string>("*");
  const [mon, setMon] = useState<string>("*");
  const [dow, setDow] = useState<string>("*");

  const builtExpr = useMemo(
    () => `${min} ${hour} ${dom} ${mon} ${dow}`.trim(),
    [min, hour, dom, mon, dow]
  );

  const parseResult = useMemo(() => {
    try {
      const interval = CronExpressionParser.parse(expr, { tz });
      const next: string[] = [];
      for (let i = 0; i < count; i++) {
        next.push(interval.next().toDate().toLocaleString());
      }
      const description = safeCronstrue(expr);
      return { next, description, error: null as string | null };
    } catch (e: any) {
      return {
        next: [] as string[],
        description: "",
        error: e.message as string,
      };
    }
  }, [expr, tz, count]);

  const builderPreview = useMemo(() => {
    try {
      const interval = CronExpressionParser.parse(builtExpr, { tz });
      const next: string[] = [];
      for (let i = 0; i < 5; i++)
        next.push(interval.next().toDate().toLocaleString());
      const description = safeCronstrue(builtExpr);
      return { next, description, error: null as string | null };
    } catch (e: any) {
      return {
        next: [] as string[],
        description: "",
        error: e.message as string,
      };
    }
  }, [builtExpr, tz]);

  const applyFromBuilder = () => {
    setExpr(builtExpr);
    setActiveTab("parse");
  };

  const tzOptions = useMemo(() => ["UTC", tz].filter(Boolean), [tz]);

  return (
    <div className="container mx-auto max-w-6xl flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parse">{t("parserTab")}</TabsTrigger>
                <TabsTrigger value="build">{t("builderTab")}</TabsTrigger>
              </TabsList>

              <TabsContent value="parse" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Input
                      value={expr}
                      onChange={(e) => setExpr(e.target.value)}
                      placeholder="*/5 * * * *"
                    />
                  </div>
                  <div>
                    <Select value={tz} onValueChange={setTz}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set([
                            "UTC",
                            Intl.DateTimeFormat().resolvedOptions().timeZone ||
                              "UTC",
                          ])
                        ).map((z) => (
                          <SelectItem key={z} value={z}>
                            {z}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Input
                      value={String(count)}
                      onChange={(e) =>
                        setCount(
                          Math.max(1, Math.min(20, Number(e.target.value) || 5))
                        )
                      }
                      placeholder={t("countPlaceholder")}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {parseResult.description}
                </div>
                {parseResult.error && (
                  <div className="text-sm text-destructive">
                    {parseResult.error}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {t("nextRuns")}
                  </div>
                  <ul className="text-sm list-disc pl-5">
                    {parseResult.next.length === 0 && (
                      <li>{t("noMatches")}</li>
                    )}
                    {parseResult.next.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="build" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    placeholder={t("minutePlaceholder")}
                    dir="ltr"
                  />
                  <Input
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder={t("hourPlaceholder")}
                    dir="ltr"
                  />
                  <Input
                    value={dom}
                    onChange={(e) => setDom(e.target.value)}
                    placeholder={t("dayOfMonthPlaceholder")}
                    dir="ltr"
                  />
                  <Input
                    value={mon}
                    onChange={(e) => setMon(e.target.value)}
                    placeholder={t("monthPlaceholder")}
                    dir="ltr"
                  />
                  <Input
                    value={dow}
                    onChange={(e) => setDow(e.target.value)}
                    placeholder={t("dayOfWeekPlaceholder")}
                    dir="ltr"
                  />
                </div>
                <div className="text-sm">
                  {t("expressionLabel")} <span className="font-mono" dir="ltr">{builtExpr}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {builderPreview.description}
                </div>
                {builderPreview.error && (
                  <div className="text-sm text-destructive">
                    {builderPreview.error}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {t("nextRuns")}
                  </div>
                  <ul className="text-sm list-disc pl-5">
                    {builderPreview.next.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("0");
                      setDom("*");
                      setMon("*");
                      setDow("*");
                    }}
                  >
                    {t("presetEveryDay")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("*/1");
                      setDom("*");
                      setMon("*");
                      setDow("*");
                    }}
                  >
                    {t("presetEveryHour")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("9");
                      setDom("*");
                      setMon("*");
                      setDow("1-5");
                    }}
                  >
                    {t("presetWeekdays9")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("*/15");
                      setHour("*");
                      setDom("*");
                      setMon("*");
                      setDow("*");
                    }}
                  >
                    {t("presetEvery15")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("*/30");
                      setHour("*");
                      setDom("*");
                      setMon("*");
                      setDow("*");
                    }}
                  >
                    {t("presetEvery30")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("30");
                      setHour("8");
                      setDom("*");
                      setMon("*");
                      setDow("1-5");
                    }}
                  >
                    {t("presetWeekdays830")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("0");
                      setDom("*");
                      setMon("*");
                      setDow("0");
                    }}
                  >
                    {t("presetWeeklySunday")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("9");
                      setDom("1");
                      setMon("*");
                      setDow("*");
                    }}
                  >
                    {t("presetMonthly1st")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMin("0");
                      setHour("0");
                      setDom("1");
                      setMon("*/3");
                      setDow("*");
                    }}
                  >
                    {t("presetQuarterly")}
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(builtExpr);
                        toast.success(t("copiedToClipboard"));
                      } catch {
                        toast.error(t("copyFailed"));
                      }
                    }}
                  >
                    {t("copyExpression")}
                  </Button>
                  <Button onClick={applyFromBuilder}>{t("useInParser")}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function safeCronstrue(expr: string): string {
  try {
    return cronstrue.toString(expr, { use24HourTimeFormat: true });
  } catch {
    return "";
  }
}
