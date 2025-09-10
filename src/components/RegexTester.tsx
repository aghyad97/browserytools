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

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const [text, setText] = useState<string>("");

  const { regex, error, matches } = useMemo(() => {
    try {
      // Only allow valid flags
      const safeFlags = flags.replace(/[^gimsuyd]/g, "");
      const rx = new RegExp(pattern, safeFlags as any);
      const result: { index: number; match: string }[] = [];
      if (text && pattern) {
        if (rx.global) {
          let m: RegExpExecArray | null;
          while ((m = rx.exec(text))) {
            result.push({ index: m.index, match: m[0] });
            if (m[0] === "") rx.lastIndex++;
          }
        } else {
          const m = rx.exec(text);
          if (m) result.push({ index: m.index, match: m[0] });
        }
      }
      return { regex: rx, error: null as string | null, matches: result };
    } catch (e: any) {
      return { regex: null, error: e.message as string, matches: [] as any[] };
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
                <Badge variant="outline">g</Badge>
                <Badge variant="outline">i</Badge>
                <Badge variant="outline">m</Badge>
                <Badge variant="outline">s</Badge>
                <Badge variant="outline">u</Badge>
                <Badge variant="outline">y</Badge>
                <Badge variant="outline">d</Badge>
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
          <div className="text-sm text-destructive h-5">{error}</div>
          <div className="text-sm text-muted-foreground">
            Matches: {matches.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
