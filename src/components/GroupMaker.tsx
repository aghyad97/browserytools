"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PrinterIcon, UsersIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/template/tool-shell";
import { ModePicker } from "@/components/shared/ModePicker";
import { splitGroups, type GroupMode } from "@/lib/groups";

/** One name per line; blank/whitespace-only lines are dropped. */
function parseNames(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export interface GroupMakerProps {
  /** Injectable RNG forwarded to splitGroups; defaults to Math.random. Exists
   * so tests can force a deterministic split. */
  rng?: () => number;
}

export default function GroupMaker({ rng }: GroupMakerProps = {}) {
  const t = useTranslations("Tools.GroupMaker");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const [rawText, setRawText] = useState("");
  const [modeKind, setModeKind] = useState<GroupMode["kind"]>("count");
  const [countValue, setCountValue] = useState("2");
  const [sizeValue, setSizeValue] = useState("4");
  const [groups, setGroups] = useState<string[][] | null>(null);

  const names = useMemo(() => parseNames(rawText), [rawText]);

  const parsedCount = Math.max(0, Math.trunc(Number(countValue)) || 0);
  const parsedSize = Math.max(0, Math.trunc(Number(sizeValue)) || 0);

  const mode: GroupMode =
    modeKind === "count"
      ? { kind: "count", n: Math.max(1, parsedCount) }
      : { kind: "size", size: Math.max(1, parsedSize) };

  const canGenerate = names.length > 0 && (modeKind === "count" ? parsedCount > 0 : parsedSize > 0);

  const handleGenerate = () => {
    if (!canGenerate) return;
    setGroups(splitGroups(names, mode, rng));
  };

  const handleClear = () => {
    setRawText("");
    setGroups(null);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <ToolShell
      slug="group-maker"
      title={tc("tools.group-maker.name")}
      sub={tc("tools.group-maker.description")}
      controls={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!rawText}
          >
            {tCommon("clear")}
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex items-center gap-2"
            data-testid="generate-groups"
          >
            <UsersIcon className="w-4 h-4" />
            {t("generate")}
          </Button>
        </>
      }
    >
      <div className="space-y-6 print:space-y-0">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>{t("inputTitle")}</CardTitle>
            <CardDescription>{t("inputDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              data-testid="group-names-input"
              placeholder={t("inputPlaceholder")}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="min-h-[160px] resize-none"
            />
            <div className="text-sm text-muted-foreground" data-testid="group-names-count">
              {t("namesCount", { count: names.length })}
            </div>

            <ModePicker
              aria-label={t("modeLabel")}
              value={modeKind}
              onChange={setModeKind}
              options={[
                { value: "count", label: t("byGroupCount") },
                { value: "size", label: t("byGroupSize") },
              ]}
            />

            {modeKind === "count" ? (
              <label className="flex items-center gap-3 text-sm">
                {t("numberOfGroups")}
                <Input
                  type="number"
                  min={1}
                  data-testid="group-count-input"
                  value={countValue}
                  onChange={(e) => setCountValue(e.target.value)}
                  className="w-24"
                />
              </label>
            ) : (
              <label className="flex items-center gap-3 text-sm">
                {t("peoplePerGroup")}
                <Input
                  type="number"
                  min={1}
                  data-testid="group-size-input"
                  value={sizeValue}
                  onChange={(e) => setSizeValue(e.target.value)}
                  className="w-24"
                />
              </label>
            )}
          </CardContent>
        </Card>

        {groups && groups.length > 0 && (
          <Card className="print:border-0 print:shadow-none">
            <CardHeader className="print:hidden">
              <CardTitle className="flex items-center justify-between gap-2">
                {t("resultsTitle")}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <PrinterIcon className="w-4 h-4" />
                  {t("print")}
                </Button>
              </CardTitle>
              <CardDescription>{t("resultsDesc", { count: groups.length })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                data-testid="groups-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2"
              >
                {groups.map((group, index) => (
                  <div
                    key={index}
                    data-testid="group-card"
                    className="rounded-md border p-4 print:break-inside-avoid"
                  >
                    <div className="font-semibold mb-2">
                      {t("groupLabel", { number: index + 1 })}
                    </div>
                    <ul className="space-y-1 text-sm">
                      {group.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolShell>
  );
}
