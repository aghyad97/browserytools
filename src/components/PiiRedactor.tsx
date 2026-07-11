"use client";

import { useCallback, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { EyeOffIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { getPipeline, type LoadProgress } from "@/lib/hf-pipeline";

const MODEL = "Xenova/bert-base-NER";

/** A detected piece of personal information. */
type Entity = {
  type: Category;
  word: string;
  start: number;
  end: number;
};

/** Raw NER output shape from the token-classification pipeline (aggregated). */
type NerToken = {
  entity_group?: string;
  entity?: string;
  word: string;
  start?: number;
  end?: number;
};

type NerPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<NerToken[]>;

const CATEGORIES = [
  "PER",
  "ORG",
  "LOC",
  "EMAIL",
  "PHONE",
  "CREDITCARD",
  "IP",
] as const;
type Category = (typeof CATEGORIES)[number];

// Regex detectors for structured PII the NER model does not catch.
const REGEX_DETECTORS: { type: Category; re: RegExp }[] = [
  {
    type: "EMAIL",
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  },
  {
    // Credit-card-like: 13-16 digits possibly grouped in 4s.
    type: "CREDITCARD",
    re: /\b(?:\d[ -]?){13,16}\b/g,
  },
  {
    type: "IP",
    re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  },
  {
    // Phone numbers: optional +, groups of digits with spaces/dashes/dots/parens.
    type: "PHONE",
    re: /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{2,4}(?:[\s.-]?\d{2,4}){1,4}/g,
  },
];

/** Map a raw NER label (e.g. "B-PER", "PER") to one of our categories. */
function normalizeNerType(label: string | undefined): Category | null {
  if (!label) return null;
  const clean = label.replace(/^[BI]-/, "").toUpperCase();
  if (clean === "PER" || clean === "ORG" || clean === "LOC") return clean;
  return null;
}

/** Detect entities from NER output + regex passes, deduped and sorted. */
function detectEntities(text: string, ner: NerToken[]): Entity[] {
  const found: Entity[] = [];
  const taken: boolean[] = new Array(text.length).fill(false);

  // 1. NER model entities (names, orgs, locations).
  for (const tok of ner) {
    const type = normalizeNerType(tok.entity_group ?? tok.entity);
    if (!type) continue;
    if (typeof tok.start !== "number" || typeof tok.end !== "number") continue;
    const word = text.slice(tok.start, tok.end);
    if (!word.trim()) continue;
    found.push({ type, word, start: tok.start, end: tok.end });
    for (let i = tok.start; i < tok.end; i++) taken[i] = true;
  }

  // 2. Regex detectors (structured identifiers). Email/CreditCard/IP run before
  //    the generic phone matcher so they win on overlap.
  for (const { type, re } of REGEX_DETECTORS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (m[0].trim().length < 4) continue;
      let overlap = false;
      for (let i = start; i < end; i++) {
        if (taken[i]) {
          overlap = true;
          break;
        }
      }
      if (overlap) continue;
      for (let i = start; i < end; i++) taken[i] = true;
      found.push({ type, word: m[0], start, end });
    }
  }

  return found.sort((a, b) => a.start - b.start);
}

/** Build redacted text by replacing enabled-category spans with tags. */
function buildRedacted(
  text: string,
  entities: Entity[],
  enabled: Record<Category, boolean>
): string {
  const active = entities
    .filter((e) => enabled[e.type])
    .sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const e of active) {
    if (e.start < cursor) continue; // skip overlaps
    out += text.slice(cursor, e.start);
    out += `[${e.type}_REDACTED]`;
    cursor = e.end;
  }
  out += text.slice(cursor);
  return out;
}

export default function PiiRedactor() {
  const t = useTranslations("Tools.PiiRedactor");
  const tc = useTranslations("ToolsConfig");

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [entities, setEntities] = useState<Entity[] | null>(null);
  const [enabled, setEnabled] = useState<Record<Category, boolean>>({
    PER: true,
    ORG: true,
    LOC: true,
    EMAIL: true,
    PHONE: true,
    CREDITCARD: true,
    IP: true,
  });

  const categoryLabel = useCallback(
    (c: Category): string => {
      switch (c) {
        case "PER":
          return t("catPER");
        case "ORG":
          return t("catORG");
        case "LOC":
          return t("catLOC");
        case "EMAIL":
          return t("catEMAIL");
        case "PHONE":
          return t("catPHONE");
        case "CREDITCARD":
          return t("catCREDITCARD");
        case "IP":
          return t("catIP");
      }
    },
    [t]
  );

  const detect = useCallback(async () => {
    if (!text.trim()) {
      toast.error(t("enterText"));
      return;
    }
    setBusy(true);
    setEntities(null);
    try {
      const ner = await getPipeline<NerPipeline>(
        "token-classification",
        MODEL,
        { device: "wasm", onProgress: setProgress }
      );
      const out = await ner(text, { aggregation_strategy: "simple" });
      const detected = detectEntities(text, Array.isArray(out) ? out : []);
      setEntities(detected);
      if (detected.length === 0) {
        toast.info(t("noneFound"));
      } else {
        toast.success(t("detectedToast", { count: detected.length }));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("failed"));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [text, t]);

  const redacted = useMemo(() => {
    if (!entities) return "";
    return buildRedacted(text, entities, enabled);
  }, [text, entities, enabled]);

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      PER: 0,
      ORG: 0,
      LOC: 0,
      EMAIL: 0,
      PHONE: 0,
      CREDITCARD: 0,
      IP: 0,
    };
    for (const e of entities ?? []) c[e.type] += 1;
    return c;
  }, [entities]);

  const toggle = useCallback((c: Category, checked: boolean) => {
    setEnabled((prev) => ({ ...prev, [c]: checked }));
  }, []);

  return (
    <ToolShell
      slug="pii-redactor"
      title={tc("tools.pii-redactor.name")}
      sub={tc("tools.pii-redactor.description")}
      primaryAction={{
        label: busy ? t("detecting") : t("detect"),
        onClick: detect,
        disabled: busy,
      }}
    >
      <div className="space-y-4">
        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium" htmlFor="pii-input">
            {t("inputLabel")}
          </label>
          <Textarea
            id="pii-input"
            dir="auto"
            className="min-h-[160px]"
            placeholder={t("inputPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {busy && progress && progress.status === "progress" && (
            <div className="space-y-1">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {t("loadingModel")}{" "}
                <span dir="ltr">{progress.percent}%</span>
              </p>
            </div>
          )}
        </Card>

        {entities && (
          <>
            <Card className="p-4 space-y-3">
              <p className="text-sm font-medium">{t("categoriesLabel")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((c) => (
                  <label
                    key={c}
                    htmlFor={`pii-cat-${c}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      id={`pii-cat-${c}`}
                      data-testid={`pii-cat-${c}`}
                      checked={enabled[c]}
                      onCheckedChange={(v) => toggle(c, Boolean(v))}
                    />
                    <span>
                      {categoryLabel(c)}
                      {counts[c] > 0 && (
                        <span
                          className="ms-1 text-muted-foreground tabular-nums"
                          dir="ltr"
                        >
                          ({counts[c]})
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium flex items-center gap-2">
                  <EyeOffIcon className="h-4 w-4" />
                  {t("redactedLabel")}
                </p>
                <CopyButton
                  text={redacted}
                  label={t("copy")}
                  successMessage={t("copied")}
                  errorMessage={t("copyFailed")}
                  disabled={!redacted}
                />
              </div>
              <Textarea
                dir="auto"
                className="min-h-[160px] font-mono text-sm"
                value={redacted}
                readOnly
                data-testid="pii-output"
              />
            </Card>
          </>
        )}

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">{t("modelNote")}</p>
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
