"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

const tzOptions = ["UTC", Intl.DateTimeFormat().resolvedOptions().timeZone];

export default function UnixTimestampConverter() {
  const t = useTranslations("Tools.UnixTimestampConverter");
  const tc = useTranslations("ToolsConfig");
  const [epoch, setEpoch] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [tz, setTz] = useState<string>(tzOptions[1] || "UTC");

  const parseEpochToDate = (value: string): Date | null => {
    if (!value) return null;
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    // Detect seconds vs milliseconds
    const ms = num < 1e12 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (d: Date, timeZone: string) => {
    const fmt = new Intl.DateTimeFormat(undefined, {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return fmt.format(d);
  };

  const handleEpochChange = (v: string) => {
    setEpoch(v.replace(/\s/g, ""));
    const d = parseEpochToDate(v.replace(/\s/g, ""));
    if (d) setDateStr(formatDate(d, tz));
  };

  const handleDateChange = (v: string) => {
    setDateStr(v);
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      // Convert from local input to selected TZ epoch
      try {
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: tz,
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).formatToParts(d);
        const get = (t: string) =>
          parts.find((p) => p.type === t)?.value || "00";
        const iso = `${get("year")}-${get("month")}-${get("day")}T${get(
          "hour"
        )}:${get("minute")}:${get("second")}Z`;
        const epochMs = Date.parse(iso);
        setEpoch(Math.floor(epochMs / 1000).toString());
      } catch {
        // Fallback to local time
        setEpoch(Math.floor(d.getTime() / 1000).toString());
      }
    }
  };

  useEffect(() => {
    if (epoch) {
      const d = parseEpochToDate(epoch);
      if (d) setDateStr(formatDate(d, tz));
    } else if (dateStr) {
      handleDateChange(dateStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);

  const now = () => {
    const d = new Date();
    setEpoch(Math.floor(d.getTime() / 1000).toString());
    setDateStr(formatDate(d, tz));
  };

  const clearAll = () => {
    setEpoch("");
    setDateStr("");
  };

  return (
    <ToolShell
      slug="unix-timestamp"
      title={tc("tools.unix-timestamp.name")}
      sub={tc("tools.unix-timestamp.description")}
      controls={
        <>
          <Button
            variant="outline"
            onClick={() =>
              epoch && setEpoch((Number(epoch) * 1000).toString())
            }
          >
            {t("toMsButton")}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              epoch && setEpoch(Math.floor(Number(epoch) / 1000).toString())
            }
          >
            {t("toSButton")}
          </Button>
          <Button variant="outline" onClick={clearAll}>
            {t("clearButton")}
          </Button>
        </>
      }
      primaryAction={{ label: t("nowButton"), onClick: now }}
    >
      <SettingsCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionRow label={t("epochLabel")} htmlFor="epoch">
            <Input
              id="epoch"
              inputMode="numeric"
              placeholder={t("epochPlaceholder")}
              value={epoch}
              onChange={(e) => handleEpochChange(e.target.value)}
              dir="ltr"
            />
          </OptionRow>
          <OptionRow label={t("timezoneLabel")} htmlFor="tz">
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger id="tz">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(tzOptions)).map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </OptionRow>
        </div>
        <OptionRow label={t("dateTimeLabel")} htmlFor="date">
          <Input
            id="date"
            placeholder={t("dateTimePlaceholder")}
            value={dateStr}
            onChange={(e) => handleDateChange(e.target.value)}
            dir="ltr"
          />
        </OptionRow>
      </SettingsCard>
    </ToolShell>
  );
}
