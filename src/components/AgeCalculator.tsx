"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Copy, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
      toast.error("Missing birth date");
      return;
    }

    if (birthDate > new Date()) {
      toast.error("Future date");
      return;
    }

    const result = calculateAge(birthDate);
    setAgeResult(result);
  };

  const handleCalculateDifference = () => {
    if (!person1BirthDate || !person2BirthDate) {
      toast.error("Missing birth dates");
      return;
    }

    if (person1BirthDate > new Date() || person2BirthDate > new Date()) {
      toast.error("Future dates");
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  const setCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 25; // Default to 25 years ago
    const exampleDate = new Date(year, today.getMonth(), today.getDate());
    setBirthDate(exampleDate);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Age</TabsTrigger>
          <TabsTrigger value="difference">Age Difference</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calculate Age
              </CardTitle>
              <CardDescription>
                Select a birth date to calculate the exact age
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate
                          ? format(birthDate, "PPP")
                          : "Select birth date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={setCurrentDate} variant="outline" size="sm">
                    Example
                  </Button>
                </div>
              </div>

              <Button onClick={handleCalculateAge} className="w-full">
                Calculate Age
              </Button>

              {ageResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {ageResult.years}
                      </div>
                      <div className="text-sm text-muted-foreground">Years</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {ageResult.months}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Months
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-primary">
                        {ageResult.days}
                      </div>
                      <div className="text-sm text-muted-foreground">Days</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="font-semibold">
                        {ageResult.totalDays.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Days
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="font-semibold">
                        {ageResult.totalHours.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Hours
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="font-semibold">
                        {ageResult.totalMinutes.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Minutes
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="font-semibold">
                        {ageResult.totalSeconds.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Seconds
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Next Birthday:</span>
                      <span>{ageResult.nextBirthday}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Days until Birthday:</span>
                      <Badge variant="secondary">
                        {ageResult.daysUntilBirthday} days
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Zodiac Sign:</span>
                      <Badge variant="outline">{ageResult.zodiacSign}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Born on:</span>
                      <span>{ageResult.dayOfWeek}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      copyToClipboard(
                        `Age: ${ageResult.years} years, ${ageResult.months} months, ${ageResult.days} days (${ageResult.totalDays} total days)`
                      )
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Age Information
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Age Difference Calculator
              </CardTitle>
              <CardDescription>Compare ages between two people</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="person1-name">Person 1 Name</Label>
                  <Input
                    id="person1-name"
                    value={person1Name}
                    onChange={(e) => setPerson1Name(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="person2-name">Person 2 Name</Label>
                  <Input
                    id="person2-name"
                    value={person2Name}
                    onChange={(e) => setPerson2Name(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Person 1 Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {person1BirthDate
                          ? format(person1BirthDate, "PPP")
                          : "Select birth date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={person1BirthDate}
                        onSelect={setPerson1BirthDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Person 2 Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {person2BirthDate
                          ? format(person2BirthDate, "PPP")
                          : "Select birth date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={person2BirthDate}
                        onSelect={setPerson2BirthDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button onClick={handleCalculateDifference} className="w-full">
                Calculate Age Difference
              </Button>

              {ageDifference && (
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg bg-muted">
                    <div className="text-lg font-semibold mb-2">
                      Age Difference
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {ageDifference.years} years, {ageDifference.months}{" "}
                      months, {ageDifference.days} days
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {ageDifference.totalDays.toLocaleString()} total days
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded text-center">
                      <div className="font-semibold text-green-600">
                        {ageDifference.olderPerson}
                      </div>
                      <div className="text-sm text-muted-foreground">Older</div>
                    </div>
                    <div className="p-3 border rounded text-center">
                      <div className="font-semibold text-blue-600">
                        {ageDifference.youngerPerson}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Younger
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      copyToClipboard(
                        `Age difference between ${ageDifference.olderPerson} and ${ageDifference.youngerPerson}: ${ageDifference.years} years, ${ageDifference.months} months, ${ageDifference.days} days`
                      )
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Age Difference
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
