"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { diffLines, Change } from "diff";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const SAMPLE_V1 = `You are a helpful assistant. Be concise.
Always respond in English.
Do not make up facts.
Format code blocks with proper syntax highlighting.`;

const SAMPLE_V2 = `You are a helpful, expert assistant. Be concise and direct.
Always respond in the user's language.
Do not make up facts. Cite sources when possible.
Format code blocks with proper syntax highlighting.
End responses with a summary when answering complex questions.`;

export default function AIInstructionDiff() {
  const t = useTranslations("Tools.AIInstructionDiff");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [changes, setChanges] = useState<Change[] | null>(null);

  const handleCompare = () => {
    setChanges(diffLines(left, right));
  };

  const handleClear = () => { setLeft(""); setRight(""); setChanges(null); };

  const additions = changes?.filter(c => c.added).reduce((acc, c) => acc + (c.value.match(/\n/g)?.length ?? 0), 0) ?? 0;
  const deletions = changes?.filter(c => c.removed).reduce((acc, c) => acc + (c.value.match(/\n/g)?.length ?? 0), 0) ?? 0;
  const unchanged = changes?.filter(c => !c.added && !c.removed).reduce((acc, c) => acc + (c.value.match(/\n/g)?.length ?? 0), 0) ?? 0;

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>{t("leftLabel")}</Label>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setLeft(SAMPLE_V1)}>{t("loadSampleLeft")}</Button>
              </div>
              <Textarea dir="auto" value={left} onChange={e => { setLeft(e.target.value); setChanges(null); }} placeholder={t("leftPlaceholder")} rows={10} className="font-mono text-sm resize-y" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>{t("rightLabel")}</Label>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setRight(SAMPLE_V2)}>{t("loadSampleRight")}</Button>
              </div>
              <Textarea dir="auto" value={right} onChange={e => { setRight(e.target.value); setChanges(null); }} placeholder={t("rightPlaceholder")} rows={10} className="font-mono text-sm resize-y" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleCompare} disabled={!left || !right}>{t("compare")}</Button>
            <Button variant="outline" onClick={handleClear}>{t("clearAll")}</Button>
          </div>
        </CardContent>
      </Card>

      {changes !== null && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-base">{t("compare")}</CardTitle>
              {changes.length > 0 && (
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t("additions")}: {additions}</Badge>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{t("deletions")}: {deletions}</Badge>
                  <Badge variant="secondary">{t("unchanged")}: {unchanged}</Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {changes.every(c => !c.added && !c.removed) ? (
              <p className="text-muted-foreground text-sm py-4 text-center">{t("noChanges")}</p>
            ) : (
              <div className="rounded-md border overflow-hidden font-mono text-sm">
                {changes.map((change, i) => (
                  <div
                    key={i}
                    className={
                      change.added
                        ? "bg-green-50 dark:bg-green-950 border-l-4 border-green-500 px-3 py-0.5"
                        : change.removed
                        ? "bg-red-50 dark:bg-red-950 border-l-4 border-red-500 px-3 py-0.5"
                        : "px-3 py-0.5 text-muted-foreground"
                    }
                  >
                    <pre className="whitespace-pre-wrap break-words">
                      {change.added ? "+ " : change.removed ? "- " : "  "}
                      {change.value}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!changes && (!left || !right) && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground text-sm">{t("emptyInputs")}</CardContent>
        </Card>
      )}
    </div>
  );
}
