"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coffee, Infinity as InfinityIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { ModePicker } from "@/components/shared/ModePicker";

type PresetKey = "15m" | "30m" | "1h" | "2h" | "4h" | "8h" | "infinity" | "custom";

const PRESETS: { key: PresetKey; minutes: number | null }[] = [
  { key: "15m", minutes: 15 },
  { key: "30m", minutes: 30 },
  { key: "1h", minutes: 60 },
  { key: "2h", minutes: 120 },
  { key: "4h", minutes: 240 },
  { key: "8h", minutes: 480 },
  { key: "infinity", minutes: null },
];

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function KeepAwake() {
  const t = useTranslations("Tools.KeepAwake");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [supported, setSupported] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("1h");
  const [customValue, setCustomValue] = useState<number>(45);
  const [customUnit, setCustomUnit] = useState<"min" | "h">("min");
  const [isActive, setIsActive] = useState(false);
  const [isInfinity, setIsInfinity] = useState(false);
  const [remainingSec, setRemainingSec] = useState<number>(0);

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const endAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const infinityRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      document.title = isInfinity
        ? `∞ — ${t("title")} | ${tCommon("siteName")}`
        : `${formatRemaining(remainingSec)} — ${t("title")} | ${tCommon("siteName")}`;
    } else {
      document.title = `${t("title")} | ${tCommon("siteName")}`;
    }
    return () => {
      document.title = `${t("title")} | ${tCommon("siteName")}`;
    };
  }, [isActive, isInfinity, remainingSec, t, tCommon]);

  const acquireLock = useCallback(async (): Promise<boolean> => {
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      wakeLockRef.current = sentinel;
      sentinel.addEventListener("release", () => {
        wakeLockRef.current = null;
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const stop = useCallback((reason: "manual" | "ended") => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    endAtRef.current = null;
    infinityRef.current = false;
    setIsActive(false);
    setIsInfinity(false);
    setRemainingSec(0);
    if (reason === "manual") toast.info(t("deactivated"));
    if (reason === "ended") toast.success(t("sessionEnded"));
  }, [t]);

  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState === "visible" && isActive && !wakeLockRef.current) {
        const ok = await acquireLock();
        if (ok) toast.info(t("lostAndResumed"));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive, acquireLock, t]);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (wakeLockRef.current) wakeLockRef.current.release().catch(() => {});
    };
  }, []);

  const getSelectedMinutes = (): number | null => {
    if (selectedPreset === "infinity") return null;
    if (selectedPreset === "custom") {
      const base = Number.isFinite(customValue) ? customValue : 0;
      return customUnit === "h" ? base * 60 : base;
    }
    const preset = PRESETS.find((p) => p.key === selectedPreset);
    return preset?.minutes ?? 60;
  };

  const start = async () => {
    if (!supported) {
      toast.error(t("notSupported"));
      return;
    }
    const minutes = getSelectedMinutes();
    if (minutes !== null && (!Number.isFinite(minutes) || minutes <= 0)) {
      toast.error(t("invalidDuration"));
      return;
    }
    const ok = await acquireLock();
    if (!ok) {
      toast.error(t("notSupported"));
      return;
    }
    if (minutes === null) {
      infinityRef.current = true;
      endAtRef.current = null;
      setIsInfinity(true);
      setRemainingSec(0);
      setIsActive(true);
      toast.success(t("activatedInfinity"));
      return;
    }
    const totalSec = Math.round(minutes * 60);
    endAtRef.current = Date.now() + totalSec * 1000;
    setIsInfinity(false);
    setRemainingSec(totalSec);
    setIsActive(true);
    toast.success(t("activated"));
    tickRef.current = setInterval(() => {
      if (infinityRef.current || !endAtRef.current) return;
      const secs = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemainingSec(secs);
      if (secs <= 0) stop("ended");
    }, 1000);
  };

  const handleToggle = () => {
    if (isActive) stop("manual");
    else start();
  };

  const statusLabel = isActive ? t("active") : t("inactive");

  return (
    <ToolShell
      slug="keep-awake"
      title={tc("tools.keep-awake.name")}
      sub={tc("tools.keep-awake.description")}
      primaryAction={{
        label: isActive ? t("deactivate") : t("activate"),
        onClick: handleToggle,
        disabled: !supported,
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {!supported && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3 text-sm">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                <p className="text-destructive">{t("notSupported")}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card
          className={`transition-colors border-0 shadow-lg bg-gradient-to-br ${
            isActive
              ? "from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/20"
              : "from-muted to-secondary/60 dark:from-muted dark:to-secondary/40"
          }`}
        >
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center gap-5">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/50"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"
                  }`}
                />
                {statusLabel}
              </div>

              <div className="text-center select-none">
                {isActive && isInfinity ? (
                  <div dir="ltr" className="text-6xl font-mono font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <InfinityIcon className="w-16 h-16" />
                  </div>
                ) : (
                  <div
                    dir="ltr"
                    className={`text-6xl font-mono font-bold tracking-tight ${
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    {isActive ? formatRemaining(remainingSec) : "00:00:00"}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-2 font-medium">
                  {isActive ? t("running") : t("idle")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <SettingsCard title={t("presets")}>
          <ModePicker
            aria-label={t("presets")}
            value={selectedPreset}
            disabled={isActive}
            onChange={(key) => {
              if (!isActive) setSelectedPreset(key);
            }}
            options={[
              ...PRESETS.map((p) => ({
                value: p.key,
                label:
                  p.key === "15m" ? t("preset15")
                  : p.key === "30m" ? t("preset30")
                  : p.key === "1h" ? t("preset1h")
                  : p.key === "2h" ? t("preset2h")
                  : p.key === "4h" ? t("preset4h")
                  : p.key === "8h" ? t("preset8h")
                  : (
                    <span className="inline-flex items-center gap-1.5">
                      <InfinityIcon className="w-3.5 h-3.5" />
                      {t("infinity")}
                    </span>
                  ),
              })),
              { value: "custom" as PresetKey, label: t("custom") },
            ]}
          />

          {selectedPreset === "custom" && (
            <OptionRow label={t("customLabel")}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={customUnit === "h" ? 48 : 1440}
                  value={customValue}
                  disabled={isActive}
                  onChange={(e) => setCustomValue(Math.max(1, Number(e.target.value) || 0))}
                  placeholder={t("customPlaceholder")}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
                />
                <ModePicker
                  aria-label={t("customLabel")}
                  value={customUnit}
                  disabled={isActive}
                  onChange={(unit) => {
                    if (!isActive) setCustomUnit(unit);
                  }}
                  options={[
                    { value: "min" as const, label: t("unitMinutes") },
                    { value: "h" as const, label: t("unitHours") },
                  ]}
                />
              </div>
            </OptionRow>
          )}

          {selectedPreset === "infinity" && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <InfinityIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{t("infinityDesc")}</p>
            </div>
          )}
        </SettingsCard>

        <SettingsCard>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{t("tipTitle")}</p>
              <p>{t("tipBody")}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Coffee className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
            <p>{t("warnClosedLid")}</p>
          </div>
        </SettingsCard>
      </div>
    </ToolShell>
  );
}
