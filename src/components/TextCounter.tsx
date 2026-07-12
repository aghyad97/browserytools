"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTextCounterStore } from "@/store/text-counter-store";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { StatStrip } from "@/components/shared/StatStrip";

export default function TextCounter() {
  const t = useTranslations("Tools.TextCounter");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const { text, stats, setText, clearText } = useTextCounterStore();

  const handleClear = () => {
    clearText();
  };

  const handleSampleText = () => {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;

    setText(sampleText);
  };

  return (
    <ToolShell
      slug="text-counter"
      title={tc("tools.text-counter.name")}
      sub={tc("tools.text-counter.description")}
      controls={
        <>
          <Button variant="outline" size="sm" onClick={handleSampleText}>
            {t("loadSample")}
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
          <CopyButton
            text={text}
            label={t("copyText")}
            successMessage={t("copiedToClipboard")}
            disabled={!text}
          />
        </>
      }
    >
      <div className="space-y-6">
      {/* Text Input - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>{t("inputTitle")}</CardTitle>
          <CardDescription>{t("inputDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t("inputPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsTitle")}</CardTitle>
          <CardDescription>{t("statisticsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <StatStrip
            items={[
              {
                label: t("characters"),
                value: <NumberFlow value={stats.characters} />,
                sub: t("charactersIncSpaces"),
              },
              {
                label: t("characters"),
                value: <NumberFlow value={stats.charactersNoSpaces} />,
                sub: t("charactersNoSpaces"),
              },
              {
                label: t("words"),
                value: <NumberFlow value={stats.words} />,
                sub: t("totalWordCount"),
              },
              {
                label: t("lines"),
                value: <NumberFlow value={stats.lines} />,
                sub: t("lineBreaks"),
              },
              {
                label: t("paragraphs"),
                value: <NumberFlow value={stats.paragraphs} />,
                sub: t("paragraphBreaks"),
              },
              {
                label: t("sentences"),
                value: <NumberFlow value={stats.sentences} />,
                sub: t("sentenceCount"),
              },
              {
                label: t("readingTime"),
                value: (
                  <>
                    <NumberFlow value={stats.readingTime} />
                    <span className="text-base text-muted-foreground ms-1">
                      {t("minSuffix")}
                    </span>
                  </>
                ),
                sub: t("readingTimeDesc"),
              },
              {
                label: t("speakingTime"),
                value: (
                  <>
                    <NumberFlow value={stats.speakingTime} />
                    <span className="text-base text-muted-foreground ms-1">
                      {t("minSuffix")}
                    </span>
                  </>
                ),
                sub: t("speakingTimeDesc"),
              },
            ]}
          />
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}
