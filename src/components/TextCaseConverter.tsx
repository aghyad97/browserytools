"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { TwoPane } from "@/components/shared/TwoPane";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { ModePicker } from "@/components/shared/ModePicker";

export default function TextCaseConverter() {
  const t = useTranslations("Tools.TextCaseConverter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeCase, setActiveCase] = useState("uppercase");

  const caseConverters = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    titlecase: (text: string) =>
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
    camelcase: (text: string) => {
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    },
    pascalcase: (text: string) => {
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, "");
    },
    snakecase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join("_");
    },
    kebabcase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join("-");
    },
    constantcase: (text: string) => {
      return text
        .replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toUpperCase())
        .join("_");
    },
    sentencecase: (text: string) => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    alternatingcase: (text: string) => {
      return text
        .split("")
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    },
    inverse: (text: string) => {
      return text
        .split("")
        .map((char) =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    },
  };

  const handleConvert = (caseType: string) => {
    if (!inputText.trim()) {
      toast.error(t("noTextToConvert"));
      return;
    }

    const converter = caseConverters[caseType as keyof typeof caseConverters];
    if (converter) {
      const converted = converter(inputText);
      setOutputText(converted);
      setActiveCase(caseType);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setActiveCase("uppercase");
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim() && activeCase) {
      const converter =
        caseConverters[activeCase as keyof typeof caseConverters];
      if (converter) {
        setOutputText(converter(value));
      }
    } else {
      setOutputText("");
    }
  };

  const caseOptions = [
    { value: "uppercase", label: t("upper") },
    { value: "lowercase", label: t("lower") },
    { value: "titlecase", label: t("title") },
    { value: "camelcase", label: "camelCase" },
    { value: "pascalcase", label: "PascalCase" },
    { value: "snakecase", label: "snake_case" },
    { value: "kebabcase", label: "kebab-case" },
    { value: "constantcase", label: "CONSTANT" },
    { value: "sentencecase", label: t("sentence") },
    { value: "alternatingcase", label: t("alternating") },
  ];

  return (
    <ToolShell
      slug="text-case"
      title={tc("tools.text-case.name")}
      sub={tc("tools.text-case.description")}
      controls={
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {tCommon("clear")}
        </Button>
      }
    >
      <div className="space-y-6">
      <TwoPane
        start={
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{t("inputTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("inputDesc")}</p>
            <Textarea
              placeholder={t("inputPlaceholder")}
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                {inputText.length} {t("characters")}
              </span>
            </div>
          </div>
        }
        end={
          <OutputPanel
            text={outputText}
            title={t("outputTitle")}
            copySuccessMessage={t("copiedToClipboard")}
          >
            <p className="text-sm text-muted-foreground px-1 pt-1">{t("outputDesc")}</p>
            <Textarea
              placeholder={t("outputPlaceholder")}
              value={outputText}
              readOnly
              className="min-h-[200px] rounded-none border-0 bg-transparent resize-none focus-visible:ring-0"
            />
            <div className="flex justify-between items-center px-1 pb-1">
              <span className="text-sm text-muted-foreground">
                {outputText.length} {t("characters")}
              </span>
            </div>
          </OutputPanel>
        }
      />

      {/* Case Options */}
      <SettingsCard title={t("caseOptions")} description={t("caseOptionsDesc")}>
        <ModePicker
          aria-label={t("caseOptions")}
          options={caseOptions}
          value={activeCase}
          onChange={handleConvert}
        />

        <Button
          variant="outline"
          onClick={() => handleConvert("inverse")}
          className="w-full"
        >
          {t("inverseCase")}
        </Button>
      </SettingsCard>
      </div>
    </ToolShell>
  );
}
