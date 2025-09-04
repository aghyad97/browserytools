"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Clock, Globe, Calendar } from "lucide-react";
import { toast } from "sonner";

interface TimeZoneInfo {
  timezone: string;
  offset: string;
  abbreviation: string;
  time: string;
  date: string;
}

export default function TimeZoneConverter() {
  const [fromTimeZone, setFromTimeZone] = useState<string>("");
  const [toTimeZone, setToTimeZone] = useState<string>("");
  const [inputDateTime, setInputDateTime] = useState<string>("");
  const [convertedTimes, setConvertedTimes] = useState<TimeZoneInfo[]>([]);
  const [currentTime, setCurrentTime] = useState<TimeZoneInfo[]>([]);

  // Popular timezones
  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)" },
    { value: "America/Denver", label: "Denver (MST/MDT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Europe/Rome", label: "Rome (CET/CEST)" },
    { value: "Europe/Madrid", label: "Madrid (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Kolkata", label: "Mumbai/Delhi (IST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
    { value: "Australia/Melbourne", label: "Melbourne (AEST/AEDT)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
    { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
    { value: "America/Toronto", label: "Toronto (EST/EDT)" },
    { value: "America/Vancouver", label: "Vancouver (PST/PDT)" },
  ];

  // Get current time in all timezones
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const times: TimeZoneInfo[] = timezones.map((tz) => {
        try {
          const timeInTz = new Date(
            now.toLocaleString("en-US", { timeZone: tz.value })
          );
          const offset = getTimezoneOffset(tz.value);
          const abbreviation = getTimezoneAbbreviation(tz.value, now);

          return {
            timezone: tz.value,
            offset,
            abbreviation,
            time: timeInTz.toLocaleTimeString("en-US", {
              timeZone: tz.value,
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            date: timeInTz.toLocaleDateString("en-US", {
              timeZone: tz.value,
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
        } catch (error) {
          return {
            timezone: tz.value,
            offset: "N/A",
            abbreviation: "N/A",
            time: "Error",
            date: "Error",
          };
        }
      });
      setCurrentTime(times);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimezoneOffset = (timezone: string): string => {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const targetTime = new Date(
        utc.toLocaleString("en-US", { timeZone: timezone })
      );
      const offset = (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);

      if (offset === 0) return "UTC±0";
      if (offset > 0) return `UTC+${offset}`;
      return `UTC${offset}`;
    } catch {
      return "N/A";
    }
  };

  const getTimezoneAbbreviation = (timezone: string, date: Date): string => {
    try {
      const formatter = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "short",
      });
      const parts = formatter.formatToParts(date);
      const timeZoneName = parts.find((part) => part.type === "timeZoneName");
      return timeZoneName?.value || "N/A";
    } catch {
      return "N/A";
    }
  };

  const convertTime = () => {
    if (!fromTimeZone || !toTimeZone || !inputDateTime) {
      toast.error(
        "Missing information please select both timezones and enter date/time"
      );

      return;
    }

    try {
      const inputDate = new Date(inputDateTime);
      if (isNaN(inputDate.getTime())) {
        toast.error("Invalid date please enter a valid date and time");

        return;
      }

      const times: TimeZoneInfo[] = [fromTimeZone, toTimeZone].map((tz) => {
        const timeInTz = new Date(
          inputDate.toLocaleString("en-US", { timeZone: tz })
        );
        const offset = getTimezoneOffset(tz);
        const abbreviation = getTimezoneAbbreviation(tz, inputDate);

        return {
          timezone: tz,
          offset,
          abbreviation,
          time: timeInTz.toLocaleTimeString("en-US", {
            timeZone: tz,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          date: timeInTz.toLocaleDateString("en-US", {
            timeZone: tz,
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        };
      });

      setConvertedTimes(times);
    } catch (error) {
      toast.error(
        "Conversion error unable to convert the time please check your input"
      );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    setInputDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Converter
            </CardTitle>
            <CardDescription>
              Convert a specific date and time between time zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="datetime">Date & Time</Label>
              <div className="flex gap-2">
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={inputDateTime}
                  onChange={(e) => setInputDateTime(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={setCurrentDateTime}
                  variant="outline"
                  size="sm"
                >
                  Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Timezone</Label>
                <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Timezone</Label>
                <Select value={toTimeZone} onValueChange={setToTimeZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={convertTime} className="w-full">
              Convert Time
            </Button>

            {convertedTimes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Conversion Result</h3>
                {convertedTimes.map((time, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{time.timezone}</Badge>
                      <div className="flex gap-1">
                        <Badge variant="secondary">{time.offset}</Badge>
                        <Badge variant="secondary">{time.abbreviation}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-lg">{time.time}</div>
                        <div className="text-sm text-muted-foreground">
                          {time.date}
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          copyToClipboard(
                            `${time.date} ${time.time} (${time.timezone})`
                          )
                        }
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* World Clock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              World Clock
            </CardTitle>
            <CardDescription>
              Current time in major cities around the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentTime.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {timezones
                        .find((tz) => tz.value === time.timezone)
                        ?.label.split(" (")[0] || time.timezone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {time.timezone}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{time.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {time.date}
                    </div>
                  </div>
                  <div className="ml-2">
                    <Badge variant="outline" className="text-xs">
                      {time.offset}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Zone Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Americas</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>New York: EST/EDT</li>
                <li>Chicago: CST/CDT</li>
                <li>Denver: MST/MDT</li>
                <li>Los Angeles: PST/PDT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Europe</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>London: GMT/BST</li>
                <li>Paris: CET/CEST</li>
                <li>Berlin: CET/CEST</li>
                <li>Madrid: CET/CEST</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Asia</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Tokyo: JST</li>
                <li>Shanghai: CST</li>
                <li>Hong Kong: HKT</li>
                <li>Singapore: SGT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Oceania</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Sydney: AEST/AEDT</li>
                <li>Melbourne: AEST/AEDT</li>
                <li>Auckland: NZST/NZDT</li>
                <li>Perth: AWST</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
