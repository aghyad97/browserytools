"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Minimize2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { ModePicker } from "@/components/shared/ModePicker";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";

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
  const s = uppercaseKeywords(sql.replace(/\s+/g, " ").trim());

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
  const t = useTranslations("Tools.SqlFormatter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");
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
      toast.error(t("enterSqlQuery"));
      return;
    }
    try {
      const result = formatSql(input, commaFirst);
      setOutput(result);
      setMode("format");
      toast.success(t("sqlFormatted"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("formattingFailed"));
    }
  }, [input, commaFirst, t]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast.error(t("enterSqlQuery"));
      return;
    }
    try {
      const result = minifySql(input);
      setOutput(result);
      setMode("minify");
      toast.success(t("sqlMinified"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("minificationFailed"));
    }
  }, [input, t]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setMode(null);
  }, []);

  return (
    <ToolShell
      slug="sql-formatter"
      title={tc("tools.sql-formatter.name")}
      sub={tc("tools.sql-formatter.description")}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Controls */}
        <SettingsCard>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-40">
              <OptionRow label={t("dialect")}>
                <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard SQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </OptionRow>
            </div>

            <OptionRow label={t("commaStyle")}>
              <ModePicker
                aria-label={t("commaStyle")}
                value={commaFirst ? "leading" : "trailing"}
                onChange={(v) => setCommaFirst(v === "leading")}
                options={[
                  { value: "trailing", label: t("trailing") },
                  { value: "leading", label: t("leading") },
                ]}
              />
            </OptionRow>

            <div className="flex gap-2 ms-auto flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_SQL)}>
                {t("sampleQuery")}
              </Button>
              <Button size="sm" onClick={handleFormat} disabled={!input.trim()}>
                <Sparkles className="w-4 h-4 me-1.5" /> {t("formatButton")}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleMinify} disabled={!input.trim()}>
                <Minimize2 className="w-4 h-4 me-1.5" /> {t("minifyButton")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 me-1.5" /> {tCommon("clear")}
              </Button>
            </div>
          </div>
        </SettingsCard>

        {/* Editor panes */}
        <TwoPane
          start={
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {t("sqlInput")}
                  <div className="flex gap-2">
                    <Badge variant="secondary">{inputStats.lines} {t("lines")}</Badge>
                    <Badge variant="secondary">{inputStats.chars} {t("chars")}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("sqlInputPlaceholder")}
                  className="w-full min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5 text-left rtl:text-left"
                  spellCheck={false}
                  aria-label="SQL input"
                />
              </CardContent>
            </Card>
          }
          end={
            <OutputPanel
              title={
                <span className="inline-flex items-center gap-2">
                  {t("outputLabel")}
                  {mode && (
                    <Badge variant="outline" className="text-xs">
                      {mode === "format" ? t("formatted") : t("minified")}
                    </Badge>
                  )}
                  {output && (
                    <>
                      <Badge variant="secondary">{outputStats.lines} {t("lines")}</Badge>
                      <Badge variant="secondary">{outputStats.chars} {t("chars")}</Badge>
                    </>
                  )}
                </span>
              }
              text={output}
              filename={`query-${mode ?? "output"}.sql`}
              mime="text/plain"
              downloadSuccessMessage={t("downloaded")}
            >
              <textarea
                value={output}
                readOnly
                placeholder={t("sqlOutputPlaceholder")}
                className="w-full min-h-[50vh] font-mono text-sm resize-none bg-transparent outline-none leading-5 text-left rtl:text-left"
                aria-label="SQL output"
              />
            </OutputPanel>
          }
        />
      </div>
    </ToolShell>
  );
}
