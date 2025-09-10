"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tzOptions = ["UTC", Intl.DateTimeFormat().resolvedOptions().timeZone];

export default function UnixTimestampConverter() {
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Unix Timestamp Converter</CardTitle>
          <CardDescription>
            Convert between Epoch seconds/milliseconds and human-readable date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epoch">Epoch</Label>
              <Input
                id="epoch"
                inputMode="numeric"
                placeholder="e.g., 1736539200 or 1736539200000"
                value={epoch}
                onChange={(e) => handleEpochChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz">Time Zone</Label>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger>
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
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              placeholder="YYYY-MM-DD, HH:MM:SS (uses your locale formatting)"
              value={dateStr}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <Button variant="secondary" onClick={now}>
              Now
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                epoch && setEpoch((Number(epoch) * 1000).toString())
              }
            >
              ×1000 (to ms)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                epoch && setEpoch(Math.floor(Number(epoch) / 1000).toString())
              }
            >
              ÷1000 (to s)
            </Button>
          </div>
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
