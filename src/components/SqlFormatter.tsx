"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, RotateCcw, Database, Minimize2, Sparkles } from "lucide-react";
import { toast } from "sonner";

// ── Sample ────────────────────────────────────────────────────────────────────

const SAMPLE_SQL = `select u.id, u.name, u.email, o.id as order_id, o.total, p.name as product_name, p.price from users u inner join orders o on u.id = o.user_id inner join order_items oi on o.id = oi.order_id inner join products p on oi.product_id = p.id where u.created_at >= '2024-01-01' and o.status = 'completed' and p.price > 50 group by u.id, u.name, u.email, o.id, o.total, p.name, p.price having count(oi.id) > 1 order by o.total desc limit 100;`;

// ── SQL keywords ──────────────────────────────────────────────────────────────

const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "CREATE INDEX",
  "DROP INDEX",
  "UNION ALL",
  "UNION",
  "EXCEPT",
  "INTERSECT",
  "WITH",
];

const JOIN_KEYWORDS = [
  "INNER JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "JOIN",
];

const INLINE_KEYWORDS = [
  "AND",
  "OR",
  "NOT",
  "IN",
  "NOT IN",
  "IS NULL",
  "IS NOT NULL",
  "IS",
  "AS",
  "ON",
  "DISTINCT",
  "ALL",
  "NULL",
  "TRUE",
  "FALSE",
  "BETWEEN",
  "LIKE",
  "ILIKE",
  "EXISTS",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "ASC",
  "DESC",
];

function uppercaseKeywords(sql: string): string {
  const all = [...MAJOR_KEYWORDS, ...JOIN_KEYWORDS, ...INLINE_KEYWORDS];
  // Sort by length descending so multi-word keywords match first
  all.sort((a, b) => b.length - a.length);
  let result = sql;
  for (const kw of all) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    result = result.replace(re, kw);
  }
  return result;
}

// ── Formatter ─────────────────────────────────────────────────────────────────

function formatSql(sql: string, commaFirst: boolean): string {
  // Normalise whitespace, uppercase keywords
  let s = uppercaseKeywords(sql.replace(/\s+/g, " ").trim());

  const lines: string[] = [];
  let current = "";
  let depth = 0;

  const flush = (extra = "") => {
    const t = (current + extra).trim();
    if (t) lines.push("  ".repeat(depth) + t);
    current = "";
  };

  // Tokenise naively by scanning character by character
  let i = 0;
  const len = s.length;

  const peek = (kws: string[]): string | null => {
    const sub = s.slice(i);
    for (const kw of kws) {
      const re = new RegExp(`^${kw.replace(/ /g, "\\s+")}\\b`, "i");
      if (re.test(sub)) return kw;
    }
    return null;
  };

  while (i < len) {
    // String literal
    if (s[i] === "'" || s[i] === '"' || s[i] === "`") {
      const q = s[i];
      let str = q;
      i++;
      while (i < len && s[i] !== q) {
        if (s[i] === "\\" && i + 1 < len) { str += s[i]; i++; }
        str += s[i]; i++;
      }
      str += s[i] ?? ""; i++;
      current += str;
      continue;
    }

    // Comment
    if (s[i] === "-" && s[i + 1] === "-") {
      const nl = s.indexOf("\n", i);
      const comment = nl === -1 ? s.slice(i) : s.slice(i, nl);
      flush();
      lines.push("  ".repeat(depth) + comment.trim());
      i = nl === -1 ? len : nl + 1;
      continue;
    }
    if (s[i] === "/" && s[i + 1] === "*") {
      const end = s.indexOf("*/", i + 2);
      const comment = end === -1 ? s.slice(i) : s.slice(i, end + 2);
      flush();
      lines.push("  ".repeat(depth) + comment.trim());
      i = end === -1 ? len : end + 2;
      continue;
    }

    // Parentheses
    if (s[i] === "(") {
      current += "(";
      depth++;
      i++;
      continue;
    }
    if (s[i] === ")") {
      depth = Math.max(0, depth - 1);
      current += ")";
      i++;
      continue;
    }

    // Semicolon
    if (s[i] === ";") {
      flush(";");
      i++;
      if (i < len) lines.push(""); // blank line between statements
      continue;
    }

    // Comma — trailing vs leading style
    if (s[i] === ",") {
      if (commaFirst) {
        flush();
        current = ", ";
      } else {
        current += ",";
        flush();
        current = "  "; // indent continuation
      }
      i++;
      continue;
    }

    // Major clause keywords
    const majorMatch = peek(MAJOR_KEYWORDS);
    if (majorMatch && depth === 0) {
      flush();
      current = majorMatch + " ";
      i += majorMatch.length;
      while (i < len && s[i] === " ") i++;
      continue;
    }

    // JOIN keywords
    const joinMatch = peek(JOIN_KEYWORDS);
    if (joinMatch && depth === 0) {
      flush();
      current = joinMatch + " ";
      i += joinMatch.length;
      while (i < len && s[i] === " ") i++;
      continue;
    }

    current += s[i];
    i++;
  }

  flush();

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function minifySql(sql: string): string {
  return uppercaseKeywords(
    sql
      .replace(/--[^\n]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

type Dialect = "standard" | "mysql" | "postgresql" | "sqlite";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("standard");
  const [commaFirst, setCommaFirst] = useState(false);
  const [mode, setMode] = useState<"format" | "minify" | null>(null);

  const inputStats = useMemo(() => {
    const lines = input ? input.split("\n").length : 0;
    const chars = input.length;
    return { lines, chars };
  }, [input]);

  const outputStats = useMemo(() => {
    const lines = output ? output.split("\n").length : 0;
    const chars = output.length;
    return { lines, chars };
  }, [output]);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    try {
      const result = formatSql(input, commaFirst);
      setOutput(result);
      setMode("format");
      toast.success("SQL formatted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Formatting failed");
    }
  }, [input, commaFirst]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    try {
      const result = minifySql(input);
      setOutput(result);
      setMode("minify");
      toast.success("SQL minified");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Minification failed");
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-${mode ?? "output"}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  }, [output, mode]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setMode(null);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SQL Formatter</h1>
            <p className="text-sm text-muted-foreground">Format, beautify, and minify SQL queries</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Dialect</Label>
            <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard SQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Comma style</Label>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={!commaFirst ? "default" : "outline"}
                onClick={() => setCommaFirst(false)}
              >
                Trailing
              </Button>
              <Button
                size="sm"
                variant={commaFirst ? "default" : "outline"}
                onClick={() => setCommaFirst(true)}
              >
                Leading
              </Button>
            </div>
          </div>

          <div className="flex gap-2 ml-auto flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_SQL)}>
              Sample Query
            </Button>
            <Button size="sm" onClick={handleFormat} disabled={!input.trim()}>
              <Sparkles className="w-4 h-4 mr-1.5" /> Format
            </Button>
            <Button size="sm" variant="secondary" onClick={handleMinify} disabled={!input.trim()}>
              <Minimize2 className="w-4 h-4 mr-1.5" /> Minify
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Clear
            </Button>
          </div>
        </div>

        {/* Editor panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                SQL Input
                <div className="flex gap-2">
                  <Badge variant="secondary">{inputStats.lines} lines</Badge>
                  <Badge variant="secondary">{inputStats.chars} chars</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your SQL query here..."
                className="w-full min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5"
                spellCheck={false}
                aria-label="SQL input"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>
                  Output
                  {mode && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {mode === "format" ? "Formatted" : "Minified"}
                    </Badge>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {output && (
                    <div className="flex gap-2">
                      <Badge variant="secondary">{outputStats.lines} lines</Badge>
                      <Badge variant="secondary">{outputStats.chars} chars</Badge>
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={handleCopy}
                      disabled={!output}
                      aria-label="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={handleDownload}
                      disabled={!output}
                      aria-label="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={output}
                readOnly
                placeholder="Formatted SQL will appear here..."
                className="w-full min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5"
                aria-label="SQL output"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
