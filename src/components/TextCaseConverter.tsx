"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

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

  return (
    <ToolShell
      slug="text-case"
      title={tc("tools.text-case.name")}
      sub={tc("tools.text-case.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {tCommon("clear")}
          </Button>
          <CopyButton
            text={outputText}
            successMessage={t("copiedToClipboard")}
            disabled={!outputText}
          />
        </>
      }
    >
      <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("inputTitle")}</CardTitle>
            <CardDescription>{t("inputDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("outputTitle")}</CardTitle>
            <CardDescription>{t("outputDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("outputPlaceholder")}
              value={outputText}
              readOnly
              className="min-h-[200px] resize-none bg-muted"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                {outputText.length} {t("characters")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Options */}
      <Card>
        <CardHeader>
          <CardTitle>{t("caseOptions")}</CardTitle>
          <CardDescription>{t("caseOptionsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCase} onValueChange={setActiveCase}>
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              <TabsTrigger
                value="uppercase"
                onClick={() => handleConvert("uppercase")}
              >
                {t("upper")}
              </TabsTrigger>
              <TabsTrigger
                value="lowercase"
                onClick={() => handleConvert("lowercase")}
              >
                {t("lower")}
              </TabsTrigger>
              <TabsTrigger
                value="titlecase"
                onClick={() => handleConvert("titlecase")}
              >
                {t("title")}
              </TabsTrigger>
              <TabsTrigger
                value="camelcase"
                onClick={() => handleConvert("camelcase")}
              >
                camelCase
              </TabsTrigger>
              <TabsTrigger
                value="pascalcase"
                onClick={() => handleConvert("pascalcase")}
              >
                PascalCase
              </TabsTrigger>
              <TabsTrigger
                value="snakecase"
                onClick={() => handleConvert("snakecase")}
              >
                snake_case
              </TabsTrigger>
              <TabsTrigger
                value="kebabcase"
                onClick={() => handleConvert("kebabcase")}
              >
                kebab-case
              </TabsTrigger>
              <TabsTrigger
                value="constantcase"
                onClick={() => handleConvert("constantcase")}
              >
                CONSTANT
              </TabsTrigger>
              <TabsTrigger
                value="sentencecase"
                onClick={() => handleConvert("sentencecase")}
              >
                {t("sentence")}
              </TabsTrigger>
              <TabsTrigger
                value="alternatingcase"
                onClick={() => handleConvert("alternatingcase")}
              >
                {t("alternating")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => handleConvert("inverse")}
              className="w-full"
            >
              {t("inverseCase")}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}
