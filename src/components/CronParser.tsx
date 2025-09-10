"use client";

import { useMemo, useState } from "react";
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
            <CardTitle>Cron Tools</CardTitle>
            <CardDescription>
              Parse, build, and understand cron expressions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parse">Parser</TabsTrigger>
                <TabsTrigger value="build">Builder</TabsTrigger>
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
                      placeholder="Count"
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
                    Next runs:
                  </div>
                  <ul className="text-sm list-disc pl-5">
                    {parseResult.next.length === 0 && (
                      <li>No matches (check expression)</li>
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
                    placeholder="Minute"
                  />
                  <Input
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="Hour"
                  />
                  <Input
                    value={dom}
                    onChange={(e) => setDom(e.target.value)}
                    placeholder="Day of Month"
                  />
                  <Input
                    value={mon}
                    onChange={(e) => setMon(e.target.value)}
                    placeholder="Month"
                  />
                  <Input
                    value={dow}
                    onChange={(e) => setDow(e.target.value)}
                    placeholder="Day of Week"
                  />
                </div>
                <div className="text-sm">
                  Expression: <span className="font-mono">{builtExpr}</span>
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
                    Next runs:
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
                    Every day at 00:00
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
                    Every hour
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
                    Weekdays at 09:00
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
                    Every 15 minutes
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
                    Every 30 minutes
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
                    Weekdays at 08:30
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
                    Weekly on Sunday 00:00
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
                    Monthly on 1st at 09:00
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
                    Quarterly, 1st day 00:00
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(builtExpr);
                        toast.success("Copied to clipboard");
                      } catch {
                        toast.error("Copy failed");
                      }
                    }}
                  >
                    Copy expression
                  </Button>
                  <Button onClick={applyFromBuilder}>Use in Parser</Button>
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
