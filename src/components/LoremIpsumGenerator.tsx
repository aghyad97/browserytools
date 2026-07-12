"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

const loremWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "sed",
  "ut",
  "perspiciatis",
  "unde",
  "omnis",
  "iste",
  "natus",
  "error",
  "sit",
  "voluptatem",
  "accusantium",
  "doloremque",
  "laudantium",
  "totam",
  "rem",
  "aperiam",
  "eaque",
  "ipsa",
  "quae",
  "ab",
  "illo",
  "inventore",
  "veritatis",
  "et",
  "quasi",
  "architecto",
  "beatae",
  "vitae",
  "dicta",
  "sunt",
  "explicabo",
  "nemo",
  "enim",
  "ipsam",
  "voluptatem",
  "quia",
  "voluptas",
  "sit",
  "aspernatur",
  "aut",
  "odit",
  "aut",
  "fugit",
  "sed",
  "quia",
  "consequuntur",
  "magni",
  "dolores",
  "eos",
  "qui",
  "ratione",
  "voluptatem",
  "sequi",
  "nesciunt",
  "neque",
  "porro",
  "quisquam",
  "est",
  "qui",
  "dolorem",
  "ipsum",
  "quia",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipisci",
  "velit",
  "sed",
  "quia",
  "non",
  "numquam",
  "eius",
  "modi",
  "tempora",
  "incidunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magnam",
  "aliquam",
  "quaerat",
  "voluptatem",
  "ut",
  "enim",
  "ad",
  "minima",
  "veniam",
  "quis",
  "nostrum",
  "exercitationem",
  "ullam",
  "corporis",
  "suscipit",
  "laboriosam",
];

const loremSentences = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "Consectetur, adipisci velit, sed quia non numquam eius modi tempora.",
  "Incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
];

export default function LoremIpsumGenerator() {
  const t = useTranslations("Tools.LoremIpsumGenerator");
  const tc = useTranslations("ToolsConfig");
  const [generatedText, setGeneratedText] = useState("");
  const [count, setCount] = useState(5);
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">(
    "paragraphs"
  );
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generateRandomWords = (numWords: number): string => {
    const words = [];
    for (let i = 0; i < numWords; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(" ");
  };

  const generateRandomSentences = (numSentences: number): string => {
    const sentences = [];
    for (let i = 0; i < numSentences; i++) {
      sentences.push(
        loremSentences[Math.floor(Math.random() * loremSentences.length)]
      );
    }
    return sentences.join(" ");
  };

  const generateParagraph = (): string => {
    const numSentences = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
    return generateRandomSentences(numSentences);
  };

  const generateLoremIpsum = () => {
    let text = "";

    if (type === "words") {
      text = generateRandomWords(count);
    } else if (type === "sentences") {
      text = generateRandomSentences(count);
    } else if (type === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      text = paragraphs.join("\n\n");
    }

    if (startWithLorem && type !== "words") {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    }

    setGeneratedText(text);
  };

  const handleClear = () => {
    setGeneratedText("");
  };

  const handleCountChange = (value: string) => {
    const num = parseInt(value);
    if (num > 0 && num <= 1000) {
      setCount(num);
    }
  };

  return (
    <ToolShell
      slug="lorem-ipsum"
      title={tc("tools.lorem-ipsum.name")}
      sub={tc("tools.lorem-ipsum.description")}
      controls={
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t("clear")}
        </Button>
      }
      primaryAction={{
        label: t("generateText"),
        onClick: generateLoremIpsum,
      }}
    >
      <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <SettingsCard title={t("generatorOptions")} description={t("generatorOptionsDesc")}>
          <OptionRow label={t("generate")} htmlFor="type">
            <Select
              value={type}
              onValueChange={(value: "words" | "sentences" | "paragraphs") =>
                setType(value)
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">{t("words")}</SelectItem>
                <SelectItem value="sentences">{t("sentences")}</SelectItem>
                <SelectItem value="paragraphs">{t("paragraphs")}</SelectItem>
              </SelectContent>
            </Select>
          </OptionRow>

          <OptionRow label={t("count")} htmlFor="count" hint={t("maxCount", { type })}>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              placeholder={t("count")}
              dir="ltr"
            />
          </OptionRow>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch
              id="start-with-lorem"
              checked={startWithLorem}
              onCheckedChange={setStartWithLorem}
              disabled={type === "words"}
            />
            <Label htmlFor="start-with-lorem">{t("startWithLorem")}</Label>
          </div>
        </SettingsCard>

        {/* Generated Text */}
        <div className="lg:col-span-2">
          <OutputPanel
            text={generatedText}
            title={t("generatedTextTitle")}
            copySuccessMessage={t("copiedToClipboard")}
          >
            <p className="text-sm text-muted-foreground px-1 pt-1">{t("generatedTextDesc")}</p>
            <Textarea
              placeholder={t("generatedTextPlaceholder")}
              value={generatedText}
              readOnly
              className="min-h-[400px] rounded-none border-0 bg-transparent resize-none focus-visible:ring-0"
              dir="ltr"
            />
            <div className="flex justify-between items-center px-1 pb-1">
              <span className="text-sm text-muted-foreground">
                <NumberFlow value={generatedText.length} /> {t("characters")}
              </span>
            </div>
          </OutputPanel>
        </div>
      </div>

      {/* Quick Generate Buttons */}
      <SettingsCard title={t("quickGenerate")} description={t("quickGenerateDesc")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setType("paragraphs");
              setCount(1);
              generateLoremIpsum();
            }}
          >
            {t("oneParagraph")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setType("paragraphs");
              setCount(3);
              generateLoremIpsum();
            }}
          >
            {t("threeParagraphs")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setType("words");
              setCount(50);
              generateLoremIpsum();
            }}
          >
            {t("fiftyWords")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setType("sentences");
              setCount(5);
              generateLoremIpsum();
            }}
          >
            {t("fiveSentences")}
          </Button>
        </div>
      </SettingsCard>

      {/* Info */}
      <SettingsCard title={t("aboutLoremTitle")} description={t("aboutLoremDesc")} />
      </div>
    </ToolShell>
  );
}
