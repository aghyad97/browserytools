"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Copy, X, ArrowUpDown, Globe, Plus } from "lucide-react";
import { toast } from "sonner";

interface CityConfig {
  id: string;
  city: string;
  country: string;
  flag: string;
  timezone: string;
}

const DEFAULT_CITIES: CityConfig[] = [
  { id: "new-york", city: "New York", country: "United States", flag: "🇺🇸", timezone: "America/New_York" },
  { id: "london", city: "London", country: "United Kingdom", flag: "🇬🇧", timezone: "Europe/London" },
  { id: "paris", city: "Paris", country: "France", flag: "🇫🇷", timezone: "Europe/Paris" },
  { id: "dubai", city: "Dubai", country: "UAE", flag: "🇦🇪", timezone: "Asia/Dubai" },
  { id: "tokyo", city: "Tokyo", country: "Japan", flag: "🇯🇵", timezone: "Asia/Tokyo" },
  { id: "sydney", city: "Sydney", country: "Australia", flag: "🇦🇺", timezone: "Australia/Sydney" },
];

const ALL_TIMEZONES: CityConfig[] = [
  ...DEFAULT_CITIES,
  { id: "los-angeles", city: "Los Angeles", country: "United States", flag: "🇺🇸", timezone: "America/Los_Angeles" },
  { id: "chicago", city: "Chicago", country: "United States", flag: "🇺🇸", timezone: "America/Chicago" },
  { id: "toronto", city: "Toronto", country: "Canada", flag: "🇨🇦", timezone: "America/Toronto" },
  { id: "singapore", city: "Singapore", country: "Singapore", flag: "🇸🇬", timezone: "Asia/Singapore" },
  { id: "hong-kong", city: "Hong Kong", country: "China", flag: "🇭🇰", timezone: "Asia/Hong_Kong" },
  { id: "berlin", city: "Berlin", country: "Germany", flag: "🇩🇪", timezone: "Europe/Berlin" },
  { id: "madrid", city: "Madrid", country: "Spain", flag: "🇪🇸", timezone: "Europe/Madrid" },
  { id: "moscow", city: "Moscow", country: "Russia", flag: "🇷🇺", timezone: "Europe/Moscow" },
  { id: "istanbul", city: "Istanbul", country: "Turkey", flag: "🇹🇷", timezone: "Europe/Istanbul" },
  { id: "cairo", city: "Cairo", country: "Egypt", flag: "🇪🇬", timezone: "Africa/Cairo" },
  { id: "johannesburg", city: "Johannesburg", country: "South Africa", flag: "🇿🇦", timezone: "Africa/Johannesburg" },
  { id: "mumbai", city: "Mumbai", country: "India", flag: "🇮🇳", timezone: "Asia/Kolkata" },
  { id: "bangkok", city: "Bangkok", country: "Thailand", flag: "🇹🇭", timezone: "Asia/Bangkok" },
  { id: "seoul", city: "Seoul", country: "South Korea", flag: "🇰🇷", timezone: "Asia/Seoul" },
  { id: "shanghai", city: "Shanghai", country: "China", flag: "🇨🇳", timezone: "Asia/Shanghai" },
  { id: "auckland", city: "Auckland", country: "New Zealand", flag: "🇳🇿", timezone: "Pacific/Auckland" },
  { id: "sao-paulo", city: "Sao Paulo", country: "Brazil", flag: "🇧🇷", timezone: "America/Sao_Paulo" },
  { id: "mexico-city", city: "Mexico City", country: "Mexico", flag: "🇲🇽", timezone: "America/Mexico_City" },
  { id: "riyadh", city: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦", timezone: "Asia/Riyadh" },
  { id: "karachi", city: "Karachi", country: "Pakistan", flag: "🇵🇰", timezone: "Asia/Karachi" },
];

interface ClockData {
  time: string;
  date: string;
  dayOfWeek: string;
  ampm: string;
  utcOffset: string;
  utcOffsetMinutes: number;
  isDaytime: boolean;
  isBusinessHours: boolean;
}

function getClockData(timezone: string): ClockData {
  const now = new Date();

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  }).formatToParts(now);

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, weekday: "short", month: "short", day: "numeric",
  }).formatToParts(now);

  const hours24Parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, hour: "numeric", hour12: false,
  }).formatToParts(now);

  const get = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const hourStr = get(timeParts, "hour");
  const minuteStr = get(timeParts, "minute");
  const secondStr = get(timeParts, "second");
  const ampm = get(timeParts, "dayPeriod").toUpperCase();
  const hours24Raw = get(hours24Parts, "hour");
  const hours24 = parseInt(hours24Raw === "24" ? "0" : hours24Raw, 10);
  const dayOfWeek = get(dateParts, "weekday");
  const month = get(dateParts, "month");
  const day = get(dateParts, "day");

  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, timeZoneName: "shortOffset",
  });
  const offsetStr = offsetFormatter.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "UTC";

  let utcOffsetMinutes = 0;
  const offsetMatch = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (offsetMatch) {
    const sign = offsetMatch[1] === "+" ? 1 : -1;
    const hrs = parseInt(offsetMatch[2], 10);
    const mins = parseInt(offsetMatch[3] ?? "0", 10);
    utcOffsetMinutes = sign * (hrs * 60 + mins);
  }

  return {
    time: `${String(hourStr).padStart(2, "0")}:${minuteStr}:${secondStr}`,
    date: `${month} ${day}`,
    dayOfWeek,
    ampm,
    utcOffset: offsetStr.replace("GMT", "UTC"),
    utcOffsetMinutes,
    isDaytime: hours24 >= 6 && hours24 < 20,
    isBusinessHours: hours24 >= 8 && hours24 < 18,
  };
}

function formatDiff(diffMinutes: number): string {
  if (diffMinutes === 0) return "local";
  const sign = diffMinutes > 0 ? "+" : "-";
  const abs = Math.abs(diffMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${m}m`;
}

export default function WorldClock() {
  const t = useTranslations("Tools.WorldClock");
  const [cities, setCities] = useState<CityConfig[]>(DEFAULT_CITIES);
  const [clockDataMap, setClockDataMap] = useState<Record<string, ClockData>>({});
  const [sortByOffset, setSortByOffset] = useState(false);
  const [selectedTz, setSelectedTz] = useState<string>("");

  const localOffsetMinutes = useMemo(() => -new Date().getTimezoneOffset(), []);

  const updateClocks = useCallback(() => {
    const map: Record<string, ClockData> = {};
    cities.forEach((c) => {
      try { map[c.id] = getClockData(c.timezone); } catch {}
    });
    setClockDataMap(map);
  }, [cities]);

  useEffect(() => {
    updateClocks();
    const id = setInterval(updateClocks, 1000);
    return () => clearInterval(id);
  }, [updateClocks]);

  const handleRemove = useCallback((id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleAddCity = (tzId: string) => {
    const found = ALL_TIMEZONES.find((tz) => tz.id === tzId);
    if (!found) return;
    if (cities.some((c) => c.id === found.id)) {
      toast.info(t("alreadyDisplayed", { city: found.city }));
      return;
    }
    setCities((prev) => [...prev, found]);
    setSelectedTz("");
    toast.success(t("added", { city: found.city }));
  };

  const availableToAdd = useMemo(
    () => ALL_TIMEZONES.filter((tz) => !cities.some((c) => c.id === tz.id)),
    [cities]
  );

  const displayCities = useMemo(() => {
    if (!sortByOffset) return cities;
    return [...cities].sort((a, b) => {
      const aOff = clockDataMap[a.id]?.utcOffsetMinutes ?? 0;
      const bOff = clockDataMap[b.id]?.utcOffsetMinutes ?? 0;
      return aOff - bOff;
    });
  }, [cities, clockDataMap, sortByOffset]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("citiesCount", { count: cities.length })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedTz} onValueChange={handleAddCity}>
              <SelectTrigger className="w-52 h-9">
                <Plus className="w-4 h-4 mr-1 shrink-0" />
                <SelectValue placeholder={t("addCity")} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {availableToAdd.map((tz) => (
                  <SelectItem key={tz.id} value={tz.id}>
                    {tz.flag} {tz.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={sortByOffset ? "default" : "outline"}
              size="sm"
              onClick={() => setSortByOffset((s) => !s)}
              className="h-9 gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5" /> {t("sortByUTC")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCities.map((city) => {
            const data = clockDataMap[city.id];
            if (!data) return null;
            const diff = data.utcOffsetMinutes - localOffsetMinutes;
            return (
              <Card key={city.id} className="relative group overflow-hidden">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{city.flag}</span>
                      <div>
                        <div className="font-semibold text-sm leading-tight">{city.city}</div>
                        <div className="text-xs text-muted-foreground">{city.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(`${city.city}: ${data.time} ${data.ampm} (${data.utcOffset}) — ${data.dayOfWeek}, ${data.date}`);
                            toast.success(t("copiedCity", { city: city.city }));
                          } catch { toast.error(t("failedCopy")); }
                        }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(city.id)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span dir="ltr" className="text-3xl font-mono font-bold tracking-tight tabular-nums">{data.time}</span>
                    <span className="text-sm font-medium text-muted-foreground">{data.ampm}</span>
                    <span className="ml-auto">
                      {data.isDaytime ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">{data.dayOfWeek}, {data.date}</div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs font-mono" dir="ltr">{data.utcOffset}</Badge>
                    <Badge variant="secondary" className={`text-xs ${diff === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`} dir="ltr">
                      {formatDiff(diff)}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${data.isBusinessHours ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {data.isBusinessHours ? t("businessHours") : t("offHours")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> {t("dayLabel")}</span>
          <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-indigo-400" /> {t("nightLabel")}</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> {t("businessLabel")}</span>
        </div>
      </div>
    </div>
  );
}
