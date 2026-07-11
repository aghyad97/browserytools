import { readFileSync, writeFileSync } from "node:fs";

/**
 * R2 chrome — inject the two universal-dropzone keys (`Landing.dropAnyFile`,
 * `Landing.dropSuggest`) across all nine locale files.
 *
 * Consumed by src/components/landing/landing.tsx (LiveDemo):
 *   - demo box title/sub (the "any file" promise replacing the image-only copy)
 *   - the full-canvas drag overlay headline/subline
 *
 * Merged into the existing `Landing` namespace so pre-existing keys are
 * untouched. Idempotent — re-running just overwrites these two keys.
 */

const BY_LOCALE = {
  en: {
    dropAnyFile: "Drop any file here",
    dropSuggest: "We'll match it to the right tool — images compress on-device.",
  },
  ar: {
    dropAnyFile: "أسقط أي ملف هنا",
    dropSuggest: "سنرشدك إلى الأداة المناسبة — والصور تُضغط على جهازك مباشرة.",
  },
  es: {
    dropAnyFile: "Suelta cualquier archivo aquí",
    dropSuggest: "Te sugerimos la herramienta adecuada; las imágenes se comprimen en tu dispositivo.",
  },
  "pt-BR": {
    dropAnyFile: "Solte qualquer arquivo aqui",
    dropSuggest: "Indicamos a ferramenta certa — imagens são comprimidas no seu dispositivo.",
  },
  fr: {
    dropAnyFile: "Déposez n'importe quel fichier ici",
    dropSuggest: "Nous vous orientons vers le bon outil — les images sont compressées sur votre appareil.",
  },
  de: {
    dropAnyFile: "Beliebige Datei hier ablegen",
    dropSuggest: "Wir schlagen dir das passende Tool vor — Bilder werden direkt auf deinem Gerät komprimiert.",
  },
  ru: {
    dropAnyFile: "Перетащите сюда любой файл",
    dropSuggest: "Мы подберём подходящий инструмент — изображения сжимаются прямо на устройстве.",
  },
  id: {
    dropAnyFile: "Letakkan file apa pun di sini",
    dropSuggest: "Kami arahkan ke alat yang tepat — gambar dikompresi langsung di perangkat Anda.",
  },
  "zh-CN": {
    dropAnyFile: "拖放任意文件到这里",
    dropSuggest: "我们会为你匹配合适的工具——图片直接在设备上压缩。",
  },
};

for (const [locale, keys] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));
  json.Landing = { ...json.Landing, ...keys };
  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log("injected dropzone i18n into", Object.keys(BY_LOCALE).length, "locales");
