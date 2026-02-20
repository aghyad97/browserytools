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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState<"text-to-morse" | "morse-to-text">(
    "text-to-morse"
  );
  const [textInput, setTextInput] = useState("");
  const [morseInput, setMorseInput] = useState("");
  const [showReference, setShowReference] = useState(false);

  const morseOutput = useMemo(() => textToMorse(textInput), [textInput]);
  const textOutput = useMemo(() => morseToText(morseInput), [morseInput]);

  const handleCopyOutput = useCallback(() => {
    const val = activeTab === "text-to-morse" ? morseOutput : textOutput;
    if (!val.trim()) {
      toast.error("Nothing to copy");
      return;
    }
    navigator.clipboard.writeText(val);
    toast.success("Copied to clipboard");
  }, [activeTab, morseOutput, textOutput]);

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
    <div className="container mx-auto p-6 max-w-5xl">
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "text-to-morse" | "morse-to-text")
        }
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="text-to-morse">Text → Morse</TabsTrigger>
            <TabsTrigger value="morse-to-text">Morse → Text</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              className="flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleCopyOutput}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Output
            </Button>
          </div>
        </div>

        {/* Text → Morse */}
        <TabsContent value="text-to-morse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
                <CardDescription>Type your text to encode</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[240px] resize-none"
                  rows={10}
                />
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">{textInput.length} chars</Badge>
                  <Badge variant="secondary">
                    {textInput.trim() ? textInput.trim().split(/\s+/).length : 0} words
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Morse Code Output</CardTitle>
                <CardDescription>
                  Letters separated by spaces, words by " / "
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={morseOutput}
                  readOnly
                  placeholder="Morse code will appear here..."
                  className="min-h-[240px] resize-none bg-muted font-mono text-sm"
                  rows={10}
                />
                <div className="mt-2">
                  <Badge variant="secondary">{morseOutput.length} chars</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Morse → Text */}
        <TabsContent value="morse-to-text">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Morse Code Input</CardTitle>
                <CardDescription>
                  Use dots and dashes; separate letters with spaces, words with " / "
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., .... . .-.. .-.. --- / .-- --- .-. .-.. -.."
                  value={morseInput}
                  onChange={(e) => setMorseInput(e.target.value)}
                  className="min-h-[240px] resize-none font-mono text-sm"
                  rows={10}
                />
                <div className="mt-2">
                  <Badge variant="secondary">{morseInput.length} chars</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Text Output</CardTitle>
                <CardDescription>Decoded plain text</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={textOutput}
                  readOnly
                  placeholder="Decoded text will appear here..."
                  className="min-h-[240px] resize-none bg-muted"
                  rows={10}
                />
                <div className="mt-2">
                  <Badge variant="secondary">{textOutput.length} chars</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reference Table */}
      <Card className="mt-6">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setShowReference((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Morse Code Reference</CardTitle>
              <CardDescription>A–Z, 0–9 character table</CardDescription>
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
    </div>
  );
}
