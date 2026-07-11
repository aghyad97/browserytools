"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Terminal, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

type TargetLang =
  | "fetch"
  | "node-fetch"
  | "node-axios"
  | "python"
  | "go"
  | "php";

interface ParsedCurl {
  method: string;
  url: string;
  headers: [string, string][];
  query: [string, string][];
  body: string | null;
  isJsonBody: boolean;
  formFields: [string, string][];
  user: string | null;
  compressed: boolean;
}

const SAMPLE = `curl -X POST https://api.example.com/v1/users?team=core \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"name":"Ada","role":"admin"}'`;

// --- Tokenizer: splits a curl command respecting quotes and line continuations ---
function tokenize(input: string): string[] {
  // Remove backslash-newline line continuations
  const cleaned = input.replace(/\\\r?\n/g, " ");
  const tokens: string[] = [];
  let i = 0;
  const n = cleaned.length;
  while (i < n) {
    const ch = cleaned[i];
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      i++;
      continue;
    }
    let token = "";
    while (i < n) {
      const c = cleaned[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") break;
      if (c === "'") {
        i++;
        while (i < n && cleaned[i] !== "'") {
          token += cleaned[i];
          i++;
        }
        i++; // skip closing quote
        continue;
      }
      if (c === '"') {
        i++;
        while (i < n && cleaned[i] !== '"') {
          if (cleaned[i] === "\\" && i + 1 < n) {
            const next = cleaned[i + 1];
            if (next === '"' || next === "\\") {
              token += next;
              i += 2;
              continue;
            }
          }
          token += cleaned[i];
          i++;
        }
        i++; // skip closing quote
        continue;
      }
      if (c === "\\" && i + 1 < n) {
        token += cleaned[i + 1];
        i += 2;
        continue;
      }
      token += c;
      i++;
    }
    tokens.push(token);
  }
  return tokens;
}

function splitHeader(raw: string): [string, string] {
  const idx = raw.indexOf(":");
  if (idx === -1) return [raw.trim(), ""];
  return [raw.slice(0, idx).trim(), raw.slice(idx + 1).trim()];
}

function parseCurl(input: string): ParsedCurl | null {
  const tokens = tokenize(input.trim());
  if (tokens.length === 0) return null;

  let method = "";
  let url = "";
  const headers: [string, string][] = [];
  const dataParts: string[] = [];
  const formFields: [string, string][] = [];
  let isJsonBody = false;
  let user: string | null = null;
  let compressed = false;
  let getFlag = false;

  let i = 0;
  // Skip leading "curl"
  if (tokens[0] === "curl") i = 1;

  for (; i < tokens.length; i++) {
    const tok = tokens[i];
    const next = () => tokens[++i];

    if (tok === "-X" || tok === "--request") {
      method = (next() || "").toUpperCase();
    } else if (tok === "-H" || tok === "--header") {
      headers.push(splitHeader(next() || ""));
    } else if (
      tok === "-d" ||
      tok === "--data" ||
      tok === "--data-raw" ||
      tok === "--data-binary" ||
      tok === "--data-ascii"
    ) {
      dataParts.push(next() || "");
    } else if (tok === "--data-urlencode") {
      dataParts.push(next() || "");
    } else if (tok === "--json") {
      dataParts.push(next() || "");
      isJsonBody = true;
      if (!headers.some(([k]) => k.toLowerCase() === "content-type")) {
        headers.push(["Content-Type", "application/json"]);
      }
      if (!headers.some(([k]) => k.toLowerCase() === "accept")) {
        headers.push(["Accept", "application/json"]);
      }
    } else if (tok === "-F" || tok === "--form") {
      const f = next() || "";
      formFields.push(splitForm(f));
    } else if (tok === "-u" || tok === "--user") {
      user = next() || "";
    } else if (tok === "--compressed") {
      compressed = true;
    } else if (tok === "-G" || tok === "--get") {
      getFlag = true;
    } else if (tok === "-A" || tok === "--user-agent") {
      headers.push(["User-Agent", next() || ""]);
    } else if (tok === "-e" || tok === "--referer") {
      headers.push(["Referer", next() || ""]);
    } else if (tok === "-b" || tok === "--cookie") {
      headers.push(["Cookie", next() || ""]);
    } else if (
      tok === "-L" ||
      tok === "--location" ||
      tok === "-s" ||
      tok === "--silent" ||
      tok === "-k" ||
      tok === "--insecure" ||
      tok === "-i" ||
      tok === "--include" ||
      tok === "-v" ||
      tok === "--verbose" ||
      tok === "-f" ||
      tok === "--fail"
    ) {
      // boolean flags with no value relevant to code output
    } else if (tok === "-o" || tok === "--output" || tok === "--url") {
      const v = next() || "";
      if (tok === "--url") url = v;
    } else if (tok.startsWith("-")) {
      // Unknown flag: skip
    } else if (!url) {
      url = tok;
    }
  }

  if (!url) return null;

  // Combine data parts (curl joins multiple -d with &)
  let body: string | null = dataParts.length ? dataParts.join("&") : null;

  // Detect JSON content-type
  const ct = headers.find(([k]) => k.toLowerCase() === "content-type");
  if (ct && ct[1].toLowerCase().includes("application/json")) {
    isJsonBody = true;
  }

  // Default method
  if (!method) {
    if (formFields.length || body !== null) method = "POST";
    else method = "GET";
  }

  // Parse query from URL
  const query: [string, string][] = [];
  let cleanUrl = url;
  const qIdx = url.indexOf("?");
  if (qIdx !== -1) {
    cleanUrl = url.slice(0, qIdx);
    const qs = url.slice(qIdx + 1);
    for (const pair of qs.split("&")) {
      if (!pair) continue;
      const eq = pair.indexOf("=");
      if (eq === -1) query.push([decode(pair), ""]);
      else query.push([decode(pair.slice(0, eq)), decode(pair.slice(eq + 1))]);
    }
  }

  // -G moves data to query string
  if (getFlag && body) {
    for (const pair of body.split("&")) {
      if (!pair) continue;
      const eq = pair.indexOf("=");
      if (eq === -1) query.push([pair, ""]);
      else query.push([pair.slice(0, eq), pair.slice(eq + 1)]);
    }
    body = null;
  }

  // Auto content-type for form-urlencoded body
  if (
    body !== null &&
    !isJsonBody &&
    !ct &&
    formFields.length === 0 &&
    /=[^&]*/.test(body)
  ) {
    headers.push(["Content-Type", "application/x-www-form-urlencoded"]);
  }

  return {
    method,
    url: cleanUrl,
    headers,
    query,
    body,
    isJsonBody,
    formFields,
    user,
    compressed,
  };
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    return s;
  }
}

function splitForm(raw: string): [string, string] {
  const idx = raw.indexOf("=");
  if (idx === -1) return [raw, ""];
  return [raw.slice(0, idx), raw.slice(idx + 1)];
}

// --- Code generators ---
function jsStr(s: string): string {
  return JSON.stringify(s);
}

function basicAuthHeader(user: string): [string, string] {
  return ["Authorization", `Basic <base64 of ${user}>`];
}

function fullUrl(p: ParsedCurl): string {
  if (!p.query.length) return p.url;
  const qs = p.query
    .map(([k, v]) =>
      v === ""
        ? encodeURIComponent(k)
        : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    )
    .join("&");
  return `${p.url}?${qs}`;
}

function headersForOutput(p: ParsedCurl): [string, string][] {
  const out = [...p.headers];
  if (p.user) out.push(basicAuthHeader(p.user));
  return out;
}

function genFetch(p: ParsedCurl): string {
  const url = fullUrl(p);
  const headers = headersForOutput(p);
  const lines: string[] = [];
  const optParts: string[] = [`  method: ${jsStr(p.method)},`];
  if (headers.length) {
    optParts.push("  headers: {");
    headers.forEach(([k, v], idx) => {
      optParts.push(
        `    ${jsStr(k)}: ${jsStr(v)}${idx < headers.length - 1 ? "," : ""}`
      );
    });
    optParts.push("  },");
  }
  if (p.formFields.length) {
    lines.push("const form = new FormData();");
    p.formFields.forEach(([k, v]) => {
      lines.push(`form.append(${jsStr(k)}, ${jsStr(v.replace(/^@/, ""))});`);
    });
    optParts.push("  body: form,");
  } else if (p.body !== null) {
    if (p.isJsonBody) {
      optParts.push(`  body: JSON.stringify(${tryJson(p.body)}),`);
    } else {
      optParts.push(`  body: ${jsStr(p.body)},`);
    }
  }
  lines.push(
    `const response = await fetch(${jsStr(url)}, {`,
    ...optParts,
    `});`,
    "",
    "const data = await response.json();",
    "console.log(data);"
  );
  return lines.join("\n");
}

function genNodeFetch(p: ParsedCurl): string {
  return `// Node.js 18+ (built-in fetch)\n${genFetch(p)}`;
}

function genAxios(p: ParsedCurl): string {
  const url = fullUrl(p);
  const headers = headersForOutput(p);
  const lines: string[] = ['const axios = require("axios");', ""];
  const cfg: string[] = [
    `  method: ${jsStr(p.method.toLowerCase())},`,
    `  url: ${jsStr(url)},`,
  ];
  if (headers.length) {
    cfg.push("  headers: {");
    headers.forEach(([k, v], idx) => {
      cfg.push(
        `    ${jsStr(k)}: ${jsStr(v)}${idx < headers.length - 1 ? "," : ""}`
      );
    });
    cfg.push("  },");
  }
  if (p.body !== null && !p.formFields.length) {
    if (p.isJsonBody) {
      cfg.push(`  data: ${tryJson(p.body)},`);
    } else {
      cfg.push(`  data: ${jsStr(p.body)},`);
    }
  }
  lines.push(
    "const response = await axios({",
    ...cfg,
    "});",
    "",
    "console.log(response.data);"
  );
  return lines.join("\n");
}

function pyStr(s: string): string {
  return JSON.stringify(s);
}

function genPython(p: ParsedCurl): string {
  const headers = headersForOutput(p);
  const lines: string[] = ["import requests", ""];
  lines.push(`url = ${pyStr(p.url)}`);
  if (p.query.length) {
    lines.push("params = {");
    p.query.forEach(([k, v]) => lines.push(`    ${pyStr(k)}: ${pyStr(v)},`));
    lines.push("}");
  }
  if (headers.length) {
    lines.push("headers = {");
    headers.forEach(([k, v]) => lines.push(`    ${pyStr(k)}: ${pyStr(v)},`));
    lines.push("}");
  }
  let bodyArg = "";
  if (p.formFields.length) {
    lines.push("files = {");
    p.formFields.forEach(([k, v]) =>
      lines.push(`    ${pyStr(k)}: (None, ${pyStr(v.replace(/^@/, ""))}),`)
    );
    lines.push("}");
    bodyArg = "files=files";
  } else if (p.body !== null) {
    if (p.isJsonBody) {
      lines.push(`json_data = ${tryJson(p.body)}`);
      bodyArg = "json=json_data";
    } else {
      lines.push(`data = ${pyStr(p.body)}`);
      bodyArg = "data=data";
    }
  }
  const args = [`url`];
  if (p.query.length) args.push("params=params");
  if (headers.length) args.push("headers=headers");
  if (bodyArg) args.push(bodyArg);
  lines.push(
    "",
    `response = requests.${p.method.toLowerCase()}(${args.join(", ")})`,
    "print(response.json())"
  );
  return lines.join("\n");
}

function goStr(s: string): string {
  return JSON.stringify(s);
}

function genGo(p: ParsedCurl): string {
  const url = fullUrl(p);
  const headers = headersForOutput(p);
  const lines: string[] = [
    "package main",
    "",
    "import (",
    '\t"fmt"',
    '\t"io"',
    '\t"net/http"',
  ];
  if (p.body !== null) lines.push('\t"strings"');
  lines.push(")", "", "func main() {");
  if (p.body !== null) {
    lines.push(`\tbody := strings.NewReader(${goStr(p.body)})`);
    lines.push(
      `\treq, _ := http.NewRequest(${goStr(p.method)}, ${goStr(url)}, body)`
    );
  } else {
    lines.push(
      `\treq, _ := http.NewRequest(${goStr(p.method)}, ${goStr(url)}, nil)`
    );
  }
  headers.forEach(([k, v]) =>
    lines.push(`\treq.Header.Set(${goStr(k)}, ${goStr(v)})`)
  );
  lines.push(
    "",
    "\tresp, err := http.DefaultClient.Do(req)",
    "\tif err != nil {",
    "\t\tpanic(err)",
    "\t}",
    "\tdefer resp.Body.Close()",
    "",
    "\tdata, _ := io.ReadAll(resp.Body)",
    "\tfmt.Println(string(data))",
    "}"
  );
  return lines.join("\n");
}

function phpStr(s: string): string {
  return "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

function genPhp(p: ParsedCurl): string {
  const url = fullUrl(p);
  const headers = headersForOutput(p);
  const lines: string[] = ["<?php", "$ch = curl_init();", ""];
  lines.push(`curl_setopt($ch, CURLOPT_URL, ${phpStr(url)});`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");
  lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${phpStr(p.method)});`);
  if (headers.length) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    headers.forEach(([k, v]) => lines.push(`    ${phpStr(`${k}: ${v}`)},`));
    lines.push("]);");
  }
  if (p.body !== null) {
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${phpStr(p.body)});`);
  }
  lines.push(
    "",
    "$response = curl_exec($ch);",
    "curl_close($ch);",
    "echo $response;"
  );
  return lines.join("\n");
}

function tryJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return JSON.stringify(s);
  }
}

function generate(p: ParsedCurl, lang: TargetLang): string {
  switch (lang) {
    case "fetch":
      return genFetch(p);
    case "node-fetch":
      return genNodeFetch(p);
    case "node-axios":
      return genAxios(p);
    case "python":
      return genPython(p);
    case "go":
      return genGo(p);
    case "php":
      return genPhp(p);
    default:
      return "";
  }
}

export default function CurlConverter() {
  const t = useTranslations("Tools.CurlConverter");
  const tc = useTranslations("ToolsConfig");
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<TargetLang>("fetch");

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseCurl(input);
    } catch {
      return null;
    }
  }, [input]);

  const output = useMemo(() => {
    if (!parsed) return "";
    try {
      return generate(parsed, lang);
    } catch {
      return "";
    }
  }, [parsed, lang]);

  const loadSample = () => {
    setInput(SAMPLE);
    toast.success(t("sampleLoaded"));
  };

  return (
    <ToolShell
      slug="curl-converter"
      title={tc("tools.curl-converter.name")}
      sub={tc("tools.curl-converter.description")}
      controls={
        <>
          <Select value={lang} onValueChange={(v) => setLang(v as TargetLang)}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fetch">{t("langFetch")}</SelectItem>
              <SelectItem value="node-fetch">{t("langNodeFetch")}</SelectItem>
              <SelectItem value="node-axios">{t("langAxios")}</SelectItem>
              <SelectItem value="python">{t("langPython")}</SelectItem>
              <SelectItem value="go">{t("langGo")}</SelectItem>
              <SelectItem value="php">{t("langPhp")}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadSample}>
            <Wand2 className="h-4 w-4 me-2" />
            {t("loadSample")}
          </Button>
        </>
      }
    >
      <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center mb-2 text-sm font-medium text-muted-foreground">
                <Terminal className="h-4 w-4 me-2" />
                {t("inputLabel")}
              </div>
              <Textarea
                placeholder={t("inputPlaceholder")}
                className="min-h-[300px] font-mono text-left"
                dir="ltr"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label={t("inputLabel")}
              />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("outputLabel")}
                </span>
                {output && (
                  <CopyButton
                    text={output}
                    size="icon"
                    successMessage={t("copiedToClipboard")}
                    errorMessage={t("failedToCopy")}
                  />
                )}
              </div>
              <Textarea
                placeholder={t("outputPlaceholder")}
                className="min-h-[300px] font-mono text-left"
                dir="ltr"
                value={output}
                readOnly
                aria-label={t("outputLabel")}
              />
            </Card>
          </div>

          {parsed && (
            <Card className="p-4">
              <div className="text-sm font-medium mb-3">{t("breakdown")}</div>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="font-medium min-w-[80px] text-muted-foreground">
                    {t("method")}:
                  </span>
                  <span className="font-mono" dir="ltr">
                    {parsed.method}
                  </span>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="font-medium min-w-[80px] text-muted-foreground">
                    {t("url")}:
                  </span>
                  <span className="font-mono break-all" dir="ltr">
                    {parsed.url}
                  </span>
                </div>
                {parsed.headers.length > 0 && (
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="font-medium min-w-[80px] text-muted-foreground">
                      {t("headers")}:
                    </span>
                    <div className="font-mono break-all" dir="ltr">
                      {parsed.headers.map(([k, v], idx) => (
                        <div key={idx}>
                          {k}: {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {parsed.query.length > 0 && (
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="font-medium min-w-[80px] text-muted-foreground">
                      {t("query")}:
                    </span>
                    <div className="font-mono break-all" dir="ltr">
                      {parsed.query.map(([k, v], idx) => (
                        <div key={idx}>
                          {k} = {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {parsed.body !== null && (
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="font-medium min-w-[80px] text-muted-foreground">
                      {t("body")}:
                    </span>
                    <span
                      className="font-mono break-all whitespace-pre-wrap"
                      dir="ltr"
                    >
                      {parsed.body}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
      </div>
    </ToolShell>
  );
}
