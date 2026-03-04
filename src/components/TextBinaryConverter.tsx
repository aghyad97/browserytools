"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Trash2, ArrowRightLeft, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

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

  const [input, setInput] = useState("");
  const [reverseInput, setReverseInput] = useState("");
  const [tab, setTab] = useState("binary" as RepTab);
  const [direction, setDirection] = useState("text-to-binary" as Direction);

  const output = direction === "text-to-binary" ? getOutput(input, tab) : reverseConvert(reverseInput, tab);
  const byteCount = input ? new TextEncoder().encode(input).length : 0;

  const handleCopy = async () => {
    if (!output) { toast.error(t("nothingToCopy")); return; }
    try { await navigator.clipboard.writeText(output); toast.success(t("copiedToClipboard")); }
    catch { toast.error(t("copyFailed")); }
  };

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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={direction === "text-to-binary" ? "default" : "outline"} onClick={() => setDirection("text-to-binary")}>{t("textToBinary")}</Button>
            <Button variant={direction === "binary-to-text" ? "default" : "outline"} onClick={() => setDirection("binary-to-text")}>{t("binaryToText")}</Button>
            <Button variant="outline" onClick={handleSwap}><ArrowRightLeft className="h-4 w-4 me-2" />{t("swap")}</Button>
            <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 me-2" />{tCommon("copy")}</Button>
            <Button variant="outline" onClick={handleLoadSample}><FileText className="h-4 w-4 me-2" />{t("loadSample")}</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="h-4 w-4 me-2" />{tCommon("clear")}</Button>
            {byteCount > 0 && direction === "text-to-binary" && (
              <span className="ms-auto text-xs text-muted-foreground">{input.length} chars / {byteCount} bytes</span>
            )}
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as RepTab)}>
            <TabsList>
              <TabsTrigger value="binary">Binary</TabsTrigger>
              <TabsTrigger value="hex">Hex</TabsTrigger>
              <TabsTrigger value="octal">Octal</TabsTrigger>
              <TabsTrigger value="decimal">Decimal</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col gap-2">
                  <span className="text-sm font-medium">{direction === "text-to-binary" ? t("textInput") : tab.charAt(0).toUpperCase()+tab.slice(1)+" Input"}</span>
                  {direction === "text-to-binary" ? (
                    <Textarea placeholder={t("inputPlaceholderText")} className="min-h-[420px] font-mono text-sm resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
                  ) : (
                    <Textarea placeholder={t("inputPlaceholderEncoded")} className="min-h-[420px] font-mono text-sm resize-none" value={reverseInput} onChange={(e) => setReverseInput(e.target.value)} />
                  )}
                </Card>
                <Card className="p-4 flex flex-col gap-2">
                  <span className="text-sm font-medium">{direction === "text-to-binary" ? tab.charAt(0).toUpperCase()+tab.slice(1)+" Output" : t("output")}</span>
                  <Textarea placeholder={t("outputPlaceholder")} className="min-h-[420px] font-mono text-sm resize-none" value={output} readOnly />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
