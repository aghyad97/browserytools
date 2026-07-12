"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { OutputPanel } from "@/components/shared/OutputPanel";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: string;
  daysUntilBirthday: number;
  zodiacSign: string;
  dayOfWeek: string;
}

interface AgeDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  olderPerson: string;
  youngerPerson: string;
}

export default function AgeCalculator() {
  const t = useTranslations("Tools.AgeCalculator");
  const tc = useTranslations("ToolsConfig");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [person1BirthDate, setPerson1BirthDate] = useState<Date | undefined>(
    undefined
  );
  const [person2BirthDate, setPerson2BirthDate] = useState<Date | undefined>(
    undefined
  );
  const [person1Name, setPerson1Name] = useState<string>("Person 1");
  const [person2Name, setPerson2Name] = useState<string>("Person 2");
  const [ageDifference, setAgeDifference] = useState<AgeDifference | null>(
    null
  );
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const [person1Open, setPerson1Open] = useState(false);
  const [person2Open, setPerson2Open] = useState(false);

  // Earliest selectable date for the dropdown calendars.
  const fromDate = new Date(1920, 0);
  const today = new Date();

  const zodiacSigns = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  ];

  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && (month > startMonth || month < endMonth))
      ) {
        return sign.name;
      }
    }
    return "Unknown";
  };

  const calculateAge = (birthDate: Date): AgeResult => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate next birthday
    const nextBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const zodiacSign = getZodiacSign(birth);
    const dayOfWeek = birth.toLocaleDateString("en-US", { weekday: "long" });

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: nextBirthday.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      daysUntilBirthday,
      zodiacSign,
      dayOfWeek,
    };
  };

  const calculateAgeDifference = (
    date1: Date,
    date2: Date,
    name1: string,
    name2: string
  ): AgeDifference => {
    const older = date1 < date2 ? date1 : date2;
    const younger = date1 < date2 ? date2 : date1;
    const olderName = date1 < date2 ? name1 : name2;
    const youngerName = date1 < date2 ? name2 : name1;

    let years = younger.getFullYear() - older.getFullYear();
    let months = younger.getMonth() - older.getMonth();
    let days = younger.getDate() - older.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(younger.getFullYear(), younger.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (younger.getTime() - older.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      years,
      months,
      days,
      totalDays,
      olderPerson: olderName,
      youngerPerson: youngerName,
    };
  };

  const handleCalculateAge = () => {
    if (!birthDate) {
      toast.error(t("errorMissingBirthDate"));
      return;
    }

    if (birthDate > new Date()) {
      toast.error(t("errorFutureDate"));
      return;
    }

    const result = calculateAge(birthDate);
    setAgeResult(result);
  };

  const handleCalculateDifference = () => {
    if (!person1BirthDate || !person2BirthDate) {
      toast.error(t("errorMissingBirthDates"));
      return;
    }

    if (person1BirthDate > new Date() || person2BirthDate > new Date()) {
      toast.error(t("errorFutureDates"));
      return;
    }

    const result = calculateAgeDifference(
      person1BirthDate,
      person2BirthDate,
      person1Name,
      person2Name
    );
    setAgeDifference(result);
  };

  const setCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 25; // Default to 25 years ago
    const exampleDate = new Date(year, today.getMonth(), today.getDate());
    setBirthDate(exampleDate);
  };

  return (
    <ToolShell
      slug="age-calculator"
      title={tc("tools.age-calculator.name")}
      sub={tc("tools.age-calculator.description")}
    >
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">{t("tabSingle")}</TabsTrigger>
          <TabsTrigger value="difference">{t("tabDifference")}</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {t("calculateAgeTitle")}
              </span>
            }
            description={t("calculateAgeDesc")}
          >
            <OptionRow label={t("birthDateLabel")}>
              <div className="flex gap-2">
                <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-start font-normal"
                    >
                      <CalendarIcon className="me-2 h-4 w-4" />
                      {birthDate
                        ? format(birthDate, "PPP")
                        : t("selectBirthDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      defaultMonth={birthDate}
                      startMonth={fromDate}
                      endMonth={today}
                      selected={birthDate}
                      onSelect={(date) => {
                        setBirthDate(date);
                        setBirthDateOpen(false);
                      }}
                      disabled={(date) => date > today || date < fromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={setCurrentDate} variant="outline" size="sm">
                  {t("exampleButton")}
                </Button>
              </div>
            </OptionRow>

            <Button onClick={handleCalculateAge} className="w-full">
              {t("calculateAgeButton")}
            </Button>
          </SettingsCard>

          {ageResult && (
            <SettingsCard>
              <StatStrip
                items={[
                  { label: t("years"), value: ageResult.years },
                  { label: t("months"), value: ageResult.months },
                  { label: t("days"), value: ageResult.days },
                ]}
              />

              <StatStrip
                items={[
                  {
                    label: t("totalDays"),
                    value: ageResult.totalDays.toLocaleString(),
                  },
                  {
                    label: t("totalHours"),
                    value: ageResult.totalHours.toLocaleString(),
                  },
                  {
                    label: t("totalMinutes"),
                    value: ageResult.totalMinutes.toLocaleString(),
                  },
                  {
                    label: t("totalSeconds"),
                    value: ageResult.totalSeconds.toLocaleString(),
                  },
                ]}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{t("nextBirthday")}</span>
                  <span dir="ltr">{ageResult.nextBirthday}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{t("daysUntilBirthday")}</span>
                  <Badge variant="secondary">
                    {ageResult.daysUntilBirthday} {t("daysLabel")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{t("zodiacSign")}</span>
                  <Badge variant="outline">{ageResult.zodiacSign}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{t("bornOn")}</span>
                  <span>{ageResult.dayOfWeek}</span>
                </div>
              </div>

              <OutputPanel
                text={`Age: ${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days (${ageResult.totalDays} total days)`}
                copyLabel={t("copyAgeInfo")}
                copySuccessMessage={t("copiedToClipboard")}
              />
            </SettingsCard>
          )}
        </TabsContent>

        <TabsContent value="difference" className="space-y-6">
          <SettingsCard
            title={
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("ageDiffTitle")}
              </span>
            }
            description={t("ageDiffDesc")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionRow label={t("person1Name")} htmlFor="person1-name">
                <Input
                  id="person1-name"
                  value={person1Name}
                  onChange={(e) => setPerson1Name(e.target.value)}
                  placeholder={t("enterName")}
                />
              </OptionRow>
              <OptionRow label={t("person2Name")} htmlFor="person2-name">
                <Input
                  id="person2-name"
                  value={person2Name}
                  onChange={(e) => setPerson2Name(e.target.value)}
                  placeholder={t("enterName")}
                />
              </OptionRow>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionRow label={t("person1BirthDate")}>
                <Popover open={person1Open} onOpenChange={setPerson1Open}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-start font-normal"
                    >
                      <CalendarIcon className="me-2 h-4 w-4" />
                      {person1BirthDate
                        ? format(person1BirthDate, "PPP")
                        : t("selectBirthDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      defaultMonth={person1BirthDate}
                      startMonth={fromDate}
                      endMonth={today}
                      selected={person1BirthDate}
                      onSelect={(date) => {
                        setPerson1BirthDate(date);
                        setPerson1Open(false);
                      }}
                      disabled={(date) => date > today || date < fromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </OptionRow>
              <OptionRow label={t("person2BirthDate")}>
                <Popover open={person2Open} onOpenChange={setPerson2Open}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-start font-normal"
                    >
                      <CalendarIcon className="me-2 h-4 w-4" />
                      {person2BirthDate
                        ? format(person2BirthDate, "PPP")
                        : t("selectBirthDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      defaultMonth={person2BirthDate}
                      startMonth={fromDate}
                      endMonth={today}
                      selected={person2BirthDate}
                      onSelect={(date) => {
                        setPerson2BirthDate(date);
                        setPerson2Open(false);
                      }}
                      disabled={(date) => date > today || date < fromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </OptionRow>
            </div>

            <Button onClick={handleCalculateDifference} className="w-full">
              {t("calculateDiffButton")}
            </Button>
          </SettingsCard>

          {ageDifference && (
            <SettingsCard>
              <div className="text-center" dir="ltr">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t("ageDifferenceLabel")}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {ageDifference.years} {t("years")}, {ageDifference.months}{" "}
                  {t("months")}, {ageDifference.days} {t("days")}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {ageDifference.totalDays.toLocaleString()} {t("totalDaysLabel")}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded text-center">
                  {/* content value: older/younger comparison colors carry meaning, no bt token */}
                  <div className="font-semibold text-green-600">
                    {ageDifference.olderPerson}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("older")}</div>
                </div>
                <div className="p-3 border rounded text-center">
                  {/* content value: older/younger comparison colors carry meaning, no bt token */}
                  <div className="font-semibold text-blue-600">
                    {ageDifference.youngerPerson}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("younger")}
                  </div>
                </div>
              </div>

              <OutputPanel
                text={`Age difference between ${ageDifference.olderPerson} and ${ageDifference.youngerPerson}: ${ageDifference.years} years, ${ageDifference.months} months, ${ageDifference.days} days`}
                copyLabel={t("copyAgeDiff")}
                copySuccessMessage={t("copiedToClipboard")}
              />
            </SettingsCard>
          )}
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}
