"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const [text, setText] = useState<string>("");
  const [replacement, setReplacement] = useState<string>("");
  const presetOptions = [
    {
      id: "email",
      label: "Email",
      pattern: "(?:[a-z0-9._%+-]+)@(?:[a-z0-9.-]+)\\.(?:[a-z]{2,})",
      flags: "gi",
      sample:
        "Contact us at support@example.com or sales@example.co.uk. Also try TEST@EXAMPLE.IO",
    },
    {
      id: "url",
      label: "URL",
      pattern: "https?:\\/\\/[^\\s]+",
      flags: "gi",
      sample:
        "Visit https://example.com and http://sub.example.org/page?x=1 y not a url",
    },
    {
      id: "ipv4",
      label: "IPv4",
      pattern:
        "\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b",
      flags: "g",
      sample: "Router at 192.168.0.1 and DNS 8.8.8.8; invalid 999.999.1.1",
    },
    {
      id: "date",
      label: "Date (YYYY-MM-DD)",
      pattern: "(\\d{4})-(\\d{2})-(\\d{2})",
      flags: "gd",
      sample: "Today is 2025-09-10. Another: 1999-12-31",
    },
    {
      id: "hex-color",
      label: "Hex Color",
      pattern: "#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b",
      flags: "g",
      sample: "Primary #ff5733, short #0af, invalid #abcdg",
    },
    {
      id: "uuid-v4",
      label: "UUID v4",
      pattern:
        "\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b",
      flags: "g",
      sample:
        "Valid: 123e4567-e89b-12d3-a456-426614174000 invalid: 123e4567-e89b-12d3-a456-zzzzzzzzzzzz",
    },
    {
      id: "iso-datetime",
      label: "ISO Datetime",
      pattern: "\\b\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z?\\b",
      flags: "g",
      sample: "Event at 2024-01-02T15:04:05Z and 2024-01-02T15:04:05.123",
    },
    {
      id: "phone-e164",
      label: "Phone (E.164)",
      pattern: "\\+?[1-9]\\d{1,14}\\b",
      flags: "g",
      sample: "+14155552671, +442071838750, invalid +00",
    },
    {
      id: "us-zip",
      label: "US ZIP Code",
      pattern: "\\b\\d{5}(?:-\\d{4})?\\b",
      flags: "g",
      sample: "90210, 12345-6789, bad 1234",
    },
    {
      id: "slug",
      label: "Slug",
      pattern: "[a-z0-9]+(?:-[a-z0-9]+)*",
      flags: "g",
      sample: "post-title-123, invalid Slug, another-slug",
    },
    {
      id: "html-tag",
      label: "HTML Tag",
      pattern: "<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>(.*?)<\\/\\1>",
      flags: "gsi",
      sample: '<div class="x">Hello</div> plain text <span>hi</span>',
    },
    {
      id: "md-link",
      label: "Markdown Link",
      pattern: "\\[([^\\]]+)\\]\\(([^\\)]+)\\)",
      flags: "g",
      sample: "See [Example](https://example.com) and [Text](page.md)",
    },
    {
      id: "credit-card",
      label: "Credit Card (simple)",
      pattern: "\\b(?:\\d[ -]*?){13,19}\\b",
      flags: "g",
      sample: "4111 1111 1111 1111, 5500-0000-0000-0004",
    },
    {
      id: "time-hhmm",
      label: "Time HH:MM",
      pattern: "\\b([01]\\d|2[0-3]):([0-5]\\d)\\b",
      flags: "g",
      sample: "Meeting at 09:30 and 23:59, invalid 24:01",
    },
    {
      id: "username",
      label: "Username (alnum_.)",
      pattern: "[a-zA-Z0-9_.]{3,16}",
      flags: "g",
      sample: "user_01, Aghyad.T, too_long_username_over_16",
    },
  ] as const;

  const { regex, error, matches, matchDetails } = useMemo(() => {
    try {
      // Only allow valid flags
      const safeFlags = flags.replace(/[^gimsuyd]/g, "");
      const rx = new RegExp(pattern, safeFlags as any);
      const result: { index: number; match: string }[] = [];
      const details: {
        index: number;
        match: string;
        groups: (string | undefined)[];
        namedGroups: Record<string, string | undefined> | undefined;
        indices?: {
          span: [number, number];
          groupSpans?: Array<[number, number] | undefined>;
        };
      }[] = [];
      if (text && pattern) {
        if (rx.global) {
          let m: RegExpExecArray | null;
          while ((m = rx.exec(text))) {
            result.push({ index: m.index, match: m[0] });
            const groups = Array.from(
              { length: Math.max(0, m.length - 1) },
              (_, i) => m?.[i + 1]
            );
            const anyMatch: any = m as any;
            const indices = anyMatch.indices
              ? {
                  span: anyMatch.indices[0] as [number, number],
                  groupSpans: Array.isArray(anyMatch.indices)
                    ? (anyMatch.indices as Array<[number, number]>).slice(1)
                    : undefined,
                }
              : undefined;
            details.push({
              index: m.index,
              match: m[0],
              groups,
              namedGroups: (m as any).groups,
              indices,
            });
            if (m[0] === "") rx.lastIndex++;
          }
        } else {
          const m = rx.exec(text);
          if (m) {
            result.push({ index: m.index, match: m[0] });
            const groups = Array.from(
              { length: Math.max(0, m.length - 1) },
              (_, i) => m?.[i + 1]
            );
            const anyMatch: any = m as any;
            const indices = anyMatch.indices
              ? {
                  span: anyMatch.indices[0] as [number, number],
                  groupSpans: Array.isArray(anyMatch.indices)
                    ? (anyMatch.indices as Array<[number, number]>).slice(1)
                    : undefined,
                }
              : undefined;
            details.push({
              index: m.index,
              match: m[0],
              groups,
              namedGroups: (m as any).groups,
              indices,
            });
          }
        }
      }
      return {
        regex: rx,
        error: null as string | null,
        matches: result,
        matchDetails: details,
      };
    } catch (e: any) {
      return {
        regex: null,
        error: e.message as string,
        matches: [] as any[],
        matchDetails: [] as any[],
      };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!regex || !text || error) return text;
    let last = 0;
    const parts: React.ReactNode[] = [];
    const res: RegExpExecArray[] = [];
    const r = new RegExp(
      regex.source,
      regex.flags.includes("g") ? regex.flags : regex.flags + "g"
    );
    let m: RegExpExecArray | null;
    while ((m = r.exec(text))) {
      res.push(m);
      const start = m.index;
      const end = m.index + m[0].length;
      parts.push(text.slice(last, start));
      parts.push(
        <mark
          key={`${start}-${end}`}
          className="bg-yellow-300 text-black rounded px-0.5"
        >
          {text.slice(start, end)}
        </mark>
      );
      last = end;
      if (m[0] === "") r.lastIndex++;
    }
    parts.push(text.slice(last));
    return parts;
  }, [regex, text, error]);

  const replacedOutput = useMemo<string | null>(() => {
    if (!regex || !text || error || replacement === "") return null;
    try {
      const r = new RegExp(regex.source, regex.flags);
      return text.replace(r as any, replacement);
    } catch {
      return null;
    }
  }, [regex, text, error, replacement]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => {
      const cleaned = prev.replace(/[^gimsuyd]/g, "");
      return cleaned.includes(flag)
        ? cleaned.replace(new RegExp(flag, "g"), "")
        : (cleaned + flag)
            .split("")
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join("");
    });
  };

  const applyPreset = (id: string) => {
    const p = presetOptions.find((x) => x.id === id);
    if (!p) return;
    setPattern(p.pattern);
    setFlags(p.flags);
    setText(p.sample);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester</CardTitle>
          <CardDescription>
            Test JavaScript regular expressions with live highlighting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium">Preset</label>
              <Select onValueChange={applyPreset}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a preset (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pattern</label>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g., ^https?://(.*)$"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Flags</label>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g i m s u y d"
              />
              <div className="flex gap-1 flex-wrap text-xs text-muted-foreground">
                {["g", "i", "m", "s", "u", "y", "d"].map((f) => (
                  <Button
                    key={f}
                    variant={flags.includes(f) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFlag(f)}
                    className="h-6 px-2"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input</label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[220px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Output</label>
              <div className="min-h-[220px] p-3 border rounded bg-muted font-mono text-sm break-words whitespace-pre-wrap">
                {highlighted}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Replacement</label>
              <Input
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Use $1, $<name>, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Replaced Output</label>
              <div className="min-h-[42px] p-3 border rounded bg-muted font-mono text-sm break-words whitespace-pre-wrap">
                {replacedOutput !== null ? (
                  replacedOutput
                ) : (
                  <span className="text-muted-foreground">
                    Type a replacement to preview
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-destructive h-5">{error}</div>
          <div className="text-sm text-muted-foreground">
            Matches: {matches.length}
          </div>
          {matchDetails.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Capture Groups</div>
              <div className="space-y-3">
                {matchDetails.map((m, idx) => (
                  <div key={`${m.index}-${idx}`} className="text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Match {idx + 1}</Badge>
                      <span className="font-mono">"{m.match}"</span>
                      <span className="text-muted-foreground">@ {m.index}</span>
                      {m.indices?.span && (
                        <span className="text-muted-foreground">
                          [{m.indices.span[0]}, {m.indices.span[1]}]
                        </span>
                      )}
                    </div>
                    {m.groups.length > 0 ||
                    (m.namedGroups && Object.keys(m.namedGroups).length > 0) ? (
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {m.groups.map((g: string | undefined, gi: number) => (
                          <div key={gi} className="p-2 border rounded">
                            <div className="text-muted-foreground">
                              ${gi + 1}
                            </div>
                            <div className="font-mono break-words">
                              {g === undefined ? (
                                <em className="text-muted-foreground">
                                  undefined
                                </em>
                              ) : (
                                g
                              )}
                            </div>
                            {m.indices?.groupSpans?.[gi] && (
                              <div className="text-muted-foreground">
                                [{m.indices.groupSpans[gi]?.[0]},{" "}
                                {m.indices.groupSpans[gi]?.[1]}]
                              </div>
                            )}
                          </div>
                        ))}
                        {m.namedGroups &&
                          Object.entries(
                            m.namedGroups as Record<string, string | undefined>
                          ).map(([name, val]: [string, string | undefined]) => (
                            <div key={name} className="p-2 border rounded">
                              <div className="text-muted-foreground">
                                $&lt;{name}&gt;
                              </div>
                              <div className="font-mono break-words">
                                {val !== undefined ? (
                                  <span>{val}</span>
                                ) : (
                                  <em className="text-muted-foreground">
                                    undefined
                                  </em>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        (no capture groups)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
