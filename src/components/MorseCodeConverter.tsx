"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { ModePicker } from "@/components/shared/ModePicker";

const MORSE_MAP: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((char) => MORSE_MAP[char] ?? "")
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean)
    .join(" / ");
}

function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => REVERSE_MORSE[code.trim()] ?? "?")
        .join("")
    )
    .join(" ");
}

const REFERENCE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

export default function MorseCodeConverter() {
  const t = useTranslations("Tools.MorseCodeConverter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [activeTab, setActiveTab] = useState<"text-to-morse" | "morse-to-text">(
    "text-to-morse"
  );
  const [textInput, setTextInput] = useState("");
  const [morseInput, setMorseInput] = useState("");
  const [showReference, setShowReference] = useState(false);

  const morseOutput = useMemo(() => textToMorse(textInput), [textInput]);
  const textOutput = useMemo(() => morseToText(morseInput), [morseInput]);

  const isTextToMorse = activeTab === "text-to-morse";
  const copyValue = isTextToMorse ? morseOutput : textOutput;

  const handleSwap = useCallback(() => {
    if (activeTab === "text-to-morse") {
      setMorseInput(morseOutput);
      setActiveTab("morse-to-text");
    } else {
      setTextInput(textOutput);
      setActiveTab("text-to-morse");
    }
  }, [activeTab, morseOutput, textOutput]);

  const handleClear = useCallback(() => {
    if (activeTab === "text-to-morse") {
      setTextInput("");
    } else {
      setMorseInput("");
    }
  }, [activeTab]);

  return (
    <ToolShell
      slug="morse-code"
      title={tc("tools.morse-code.name")}
      sub={tc("tools.morse-code.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="flex items-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {t("swap")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {tCommon("clear")}
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <ModePicker
          aria-label={t("textToMorse")}
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "text-to-morse", label: t("textToMorse") },
            { value: "morse-to-text", label: t("morseToText") },
          ]}
        />
      </div>

      <TwoPane
        start={
          <Card>
            <CardHeader>
              <CardTitle>{isTextToMorse ? t("textInputTitle") : t("morseInputTitle")}</CardTitle>
              <CardDescription>{isTextToMorse ? t("textInputDesc") : t("morseInputDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isTextToMorse ? (
                <Textarea
                  placeholder={t("textInputPlaceholder")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[240px] resize-none"
                  rows={10}
                />
              ) : (
                <Textarea
                  placeholder={t("morseInputPlaceholder")}
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  className="min-h-[240px] resize-none font-mono text-sm"
                  rows={10}
                />
              )}
              <div className="mt-2 flex gap-2">
                {isTextToMorse ? (
                  <>
                    <Badge variant="secondary">{textInput.length} {t("chars")}</Badge>
                    <Badge variant="secondary">
                      {textInput.trim() ? textInput.trim().split(/\s+/).length : 0} {t("words")}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="secondary">{morseInput.length} {t("chars")}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        }
        end={
          <OutputPanel
            text={copyValue}
            title={
              <>
                {isTextToMorse ? t("morseOutputTitle") : t("textOutputTitle")}
                {copyValue ? ` · ${copyValue.length} ${t("chars")}` : ""}
              </>
            }
            copyLabel={t("copyOutput")}
            copySuccessMessage={t("copiedToClipboard")}
          >
            <Textarea
              value={copyValue}
              readOnly
              placeholder={isTextToMorse ? t("morseOutputPlaceholder") : t("textOutputPlaceholder")}
              className={`min-h-[240px] rounded-none border-0 bg-transparent resize-none focus-visible:ring-0${isTextToMorse ? " font-mono text-sm" : ""}`}
              rows={10}
            />
          </OutputPanel>
        }
      />

      {/* Reference Table */}
      <Card className="mt-6">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setShowReference((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("referenceTitle")}</CardTitle>
              <CardDescription>{t("referenceDesc")}</CardDescription>
            </div>
            {showReference ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {showReference && (
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {REFERENCE_CHARS.map((char) => (
                <div
                  key={char}
                  className="flex flex-col items-center p-2 rounded-md border bg-muted/40 text-center"
                >
                  <span className="font-bold text-base leading-none">{char}</span>
                  <span className="font-mono text-xs text-muted-foreground mt-1 leading-tight">
                    {MORSE_MAP[char]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </ToolShell>
  );
}
