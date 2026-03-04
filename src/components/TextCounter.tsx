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
import {
  Copy,
  RotateCcw,
  FileText,
  Hash,
  AlignLeft,
  Type,
  Clock,
  Mic,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useTextCounterStore } from "@/store/text-counter-store";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function TextCounter() {
  const t = useTranslations("Tools.TextCounter");
  const tCommon = useTranslations("Common");

  const { text, stats, setText, clearText } = useTextCounterStore();

  const handleCopy = () => {
    if (!text) {
      toast.error(t("noTextToCopy"));
      return;
    }

    navigator.clipboard.writeText(text);
    toast.success(t("copiedToClipboard"));
  };

  const handleClear = () => {
    clearText();
  };

  const handleSampleText = () => {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;

    setText(sampleText);
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    suffix = "",
  }: {
    icon: any;
    title: string;
    value: number;
    description: string;
    suffix?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              <NumberFlow value={value} />
              {suffix && (
                <span className="text-lg text-muted-foreground ms-1">
                  {suffix}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Text Input - Full Width */}
      <Card className="mb-6">
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
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
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
            </div>
            <Button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {t("copyText")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("statisticsTitle")}</CardTitle>
            <CardDescription>{t("statisticsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <StatCard
                icon={Type}
                title={t("characters")}
                value={stats.characters}
                description={t("charactersIncSpaces")}
              />
              <StatCard
                icon={Hash}
                title={t("characters")}
                value={stats.charactersNoSpaces}
                description={t("charactersNoSpaces")}
              />
              <StatCard
                icon={FileText}
                title={t("words")}
                value={stats.words}
                description={t("totalWordCount")}
              />
              <StatCard
                title={t("lines")}
                value={stats.lines}
                description={t("lineBreaks")}
                icon={AlignLeft}
              />
              <StatCard
                title={t("paragraphs")}
                value={stats.paragraphs}
                description={t("paragraphBreaks")}
                icon={FileText}
              />
              <StatCard
                title={t("sentences")}
                value={stats.sentences}
                description={t("sentenceCount")}
                icon={Type}
              />
              <StatCard
                title={t("readingTime")}
                value={stats.readingTime}
                description={t("readingTimeDesc")}
                icon={Clock}
                suffix={t("minSuffix")}
              />
              <StatCard
                title={t("speakingTime")}
                value={stats.speakingTime}
                description={t("speakingTimeDesc")}
                icon={Mic}
                suffix={t("minSuffix")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
