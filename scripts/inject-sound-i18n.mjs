import { readFileSync, writeFileSync } from "node:fs";

/**
 * R2 chrome — inject the two SoundSwitcher labels (`Rail.soundOn`,
 * `Rail.soundOff`) across all nine locale files.
 *
 * Consumed by src/components/sound-switcher.tsx via
 *   useTranslations("Rail")  ->  t("soundOn" | "soundOff")
 * for the toggle's aria-label + title (state framing: the label describes the
 * current on/off state, matching the noun register of the sibling Theme/Language
 * switcher labels).
 *
 * Merged into the existing `Rail` namespace so the pre-existing keys are
 * untouched. Idempotent — re-running just overwrites these two keys.
 */

const BY_LOCALE = {
  en: { soundOn: "Sound on", soundOff: "Sound off" },
  ar: { soundOn: "الصوت مُفعّل", soundOff: "الصوت متوقف" },
  es: { soundOn: "Sonido activado", soundOff: "Sonido desactivado" },
  "pt-BR": { soundOn: "Som ativado", soundOff: "Som desativado" },
  fr: { soundOn: "Son activé", soundOff: "Son désactivé" },
  de: { soundOn: "Ton an", soundOff: "Ton aus" },
  ru: { soundOn: "Звук включён", soundOff: "Звук выключен" },
  id: { soundOn: "Suara aktif", soundOff: "Suara nonaktif" },
  "zh-CN": { soundOn: "声音开启", soundOff: "声音关闭" },
};

for (const [locale, keys] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));
  json.Rail = { ...json.Rail, ...keys };
  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log("injected sound i18n into", Object.keys(BY_LOCALE).length, "locales");
