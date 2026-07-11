import { readFileSync, writeFileSync } from "node:fs";

/**
 * R2 Task 14 (cleanup ledger) — two coupled i18n mutations across all nine
 * locale files, applied with the same JSON.stringify(…, 2) formatting the other
 * inject scripts use so the diff stays minimal:
 *
 *   1. Rename `ToolsConfig.tools["speech-to-text"].name` to the new
 *      "Live Dictation (mic)" naming (natural per-locale translations), matching
 *      the tools-config.ts / README rename already landed.
 *
 *   2. Prune i18n keys left orphaned by the ToolShell migration + earlier
 *      batches. Every key below was verified namespace-aware to have ZERO
 *      references in src/ (the owning component no longer calls t("<key>")).
 *      resetSpeed (AudioEditor) and title (KeepAwake — used for document.title)
 *      are deliberately NOT pruned.
 */

const SPEECH_NAME = {
  en: "Live Dictation (mic)",
  ar: "الإملاء المباشر (ميكروفون)",
  es: "Dictado en vivo (micrófono)",
  "pt-BR": "Ditado ao vivo (microfone)",
  fr: "Dictée en direct (micro)",
  de: "Live-Diktat (Mikrofon)",
  ru: "Живая диктовка (микрофон)",
  id: "Dikte Langsung (mikrofon)",
  "zh-CN": "实时听写（麦克风）",
};

// namespace under Tools -> keys to delete (verified unreferenced in src/)
const PRUNE = {
  AudioEditor: [
    "fadeIn",
    "fadeOut",
    "addEcho",
    "appliedEffects",
    "selection",
    "tabPlayback",
    "tabEffects",
    "tabTrim",
    "echoApplied",
    "fadeInApplied",
    "fadeOutApplied",
    "processingDownload",
    "errorProcessingDownload",
  ],
  JsonFormatter: ["nothingToCopy"],
  CurlConverter: ["nothingToCopy"],
  FaviconGenerator: ["copySnippet"],
  CssMinifier: ["title", "description"],
  SqlFormatter: ["title", "description"],
  PomodoroTimer: ["title", "subtitle"],
  HabitTracker: ["title", "subtitle"],
  Stopwatch: ["title", "subtitle"],
  KeepAwake: ["subtitle"],
  WorldClock: ["title"],
  TodoList: ["title"],
};

const LOCALES = ["en", "ar", "es", "pt-BR", "fr", "de", "ru", "id", "zh-CN"];

let totalPruned = 0;
for (const locale of LOCALES) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));

  // 1. speech-to-text rename
  if (json.ToolsConfig?.tools?.["speech-to-text"]) {
    json.ToolsConfig.tools["speech-to-text"].name = SPEECH_NAME[locale];
  }

  // 2. prune orphaned keys (only if present)
  for (const [ns, keys] of Object.entries(PRUNE)) {
    const nsObj = json.Tools?.[ns];
    if (!nsObj) continue;
    for (const k of keys) {
      if (k in nsObj) {
        delete nsObj[k];
        totalPruned++;
      }
    }
  }

  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log(
  `R2 cleanup i18n: renamed speech-to-text in ${LOCALES.length} locales, pruned ${totalPruned} orphaned key entries`,
);
