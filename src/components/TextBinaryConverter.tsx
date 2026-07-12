"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ArrowRightLeft, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ModePicker } from "@/components/shared/ModePicker";

type RepTab = "binary" | "hex" | "octal" | "decimal";
type Direction = "text-to-binary" | "binary-to-text";

const SAMPLE_TEXT = "Hello, World!";

function textToBinary(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");
}
function textToHex(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2,"0").toUpperCase()).join(" ");
}
function textToOctal(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(8).padStart(3,"0")).join(" ");
}
function textToDecimal(text: string): string {
  return Array.from(text).map(c => c.charCodeAt(0).toString(10)).join(" ");
}

function binaryToText(bin: string): string {
  return bin.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b,2))).join("");
}
function hexToText(hex: string): string {
  return hex.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h,16))).join("");
}
function octalToText(oct: string): string {
  return oct.trim().split(/\s+/).map(o => String.fromCharCode(parseInt(o,8))).join("");
}
function decimalToText(dec: string): string {
  return dec.trim().split(/\s+/).map(d => String.fromCharCode(parseInt(d,10))).join("");
}

function getOutput(text: string, tab: RepTab): string {
  if (!text) return "";
  switch (tab) {
    case "binary": return textToBinary(text);
    case "hex": return textToHex(text);
    case "octal": return textToOctal(text);
    case "decimal": return textToDecimal(text);
  }
}

function reverseConvert(val: string, tab: RepTab): string {
  try {
    switch (tab) {
      case "binary": return binaryToText(val);
      case "hex": return hexToText(val);
      case "octal": return octalToText(val);
      case "decimal": return decimalToText(val);
    }
  } catch { return "[Invalid input]"; }
}

export default function TextBinaryConverter() {
  const t = useTranslations("Tools.TextBinaryConverter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [input, setInput] = useState("");
  const [reverseInput, setReverseInput] = useState("");
  const [tab, setTab] = useState("binary" as RepTab);
  const [direction, setDirection] = useState("text-to-binary" as Direction);

  const output = direction === "text-to-binary" ? getOutput(input, tab) : reverseConvert(reverseInput, tab);
  const byteCount = input ? new TextEncoder().encode(input).length : 0;

  const handleClear = () => { setInput(""); setReverseInput(""); };
  const handleLoadSample = () => { setInput(SAMPLE_TEXT); setDirection("text-to-binary"); };

  const handleSwap = () => {
    if (direction === "text-to-binary") {
      setReverseInput(output);
      setDirection("binary-to-text");
    } else {
      setInput(output);
      setDirection("text-to-binary");
    }
  };

  return (
    <ToolShell
      slug="text-binary"
      title={tc("tools.text-binary.name")}
      sub={tc("tools.text-binary.description")}
    >
      <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ModePicker
              aria-label={t("textToBinary")}
              value={direction}
              onChange={setDirection}
              options={[
                { value: "text-to-binary", label: t("textToBinary") },
                { value: "binary-to-text", label: t("binaryToText") },
              ]}
            />
            <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 me-2" />{t("swap")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{tCommon("clear")}</Button>
            {byteCount > 0 && direction === "text-to-binary" && (
              <span className="ms-auto text-xs text-muted-foreground">{input.length} chars / {byteCount} bytes</span>
            )}
          </div>
          <ModePicker
            aria-label="Representation"
            value={tab}
            onChange={setTab}
            options={[
              { value: "binary", label: "Binary" },
              { value: "hex", label: "Hex" },
              { value: "octal", label: "Octal" },
              { value: "decimal", label: "Decimal" },
            ]}
          />
          <TwoPane
            start={
              <Card className="p-4 flex flex-col gap-2">
                <span className="text-sm font-medium">{direction === "text-to-binary" ? t("textInput") : tab.charAt(0).toUpperCase()+tab.slice(1)+" Input"}</span>
                {direction === "text-to-binary" ? (
                  <Textarea placeholder={t("inputPlaceholderText")} className="min-h-[420px] font-mono text-sm resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
                ) : (
                  <Textarea placeholder={t("inputPlaceholderEncoded")} className="min-h-[420px] font-mono text-sm resize-none" value={reverseInput} onChange={(e) => setReverseInput(e.target.value)} />
                )}
              </Card>
            }
            end={
              <OutputPanel
                text={output}
                title={direction === "text-to-binary" ? tab.charAt(0).toUpperCase()+tab.slice(1)+" Output" : t("output")}
                copyLabel={tCommon("copy")}
                copySuccessMessage={t("copiedToClipboard")}
                copyErrorMessage={t("copyFailed")}
              >
                <Textarea placeholder={t("outputPlaceholder")} className="min-h-[420px] rounded-none border-0 bg-transparent font-mono text-sm resize-none focus-visible:ring-0" value={output} readOnly />
              </OutputPanel>
            }
          />
      </div>
    </ToolShell>
  );
}
