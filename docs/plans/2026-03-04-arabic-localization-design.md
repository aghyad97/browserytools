# Arabic Localization Design
**Date:** 2026-03-04
**Branch:** `feature/arabic-localization`
**Status:** Approved — ready for implementation

---

## Problem

BrowseryTools has 80+ tools serving a global audience. There is zero Arabic support, no RTL layout, and no localization infrastructure. Arabic is the 5th most spoken language globally and a significant growth market (MENA region).

## Goals

- Full Arabic (ar) translation of all UI strings across 80+ tool components
- Full RTL layout support
- Language toggle in header with persistence and browser language auto-detection
- Extensible i18n architecture (easy to add more languages later)
- Localized SEO (bilingual keywords, correct HTML lang attribute)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL strategy | Context-based (single URL) | Zero routing changes to 80+ existing pages |
| i18n library | `next-intl` non-routing mode | Purpose-built for App Router, TypeScript-safe, handles Arabic date/number formatting |
| Arabic font | IBM Plex Sans Arabic | Professional, tech-forward, good match for the product's tone |
| Language detection | Browser language → localStorage fallback | First-visit UX, then persistence |

---

## Architecture

### New Files

```
messages/
  en.json                     ← Source of truth (all English strings)
  ar.json                     ← Arabic translations (same key structure)

src/
  store/language-store.ts     ← Zustand store: locale, dir, setLocale()
  providers/language-provider.tsx  ← Wraps NextIntlClientProvider, reads store
  components/language-switcher.tsx ← Header dropdown (Globe icon + EN/عر)
```

### Modified Files

```
src/app/layout.tsx            ← Font loading, inline FOUC-prevention script, lang/dir
src/providers/providers.tsx   ← Add LanguageProvider wrapper
src/components/header.tsx     ← Add LanguageSwitcher component
src/components/sidebar.tsx    ← Sheet side="right" in RTL, translated category names
src/lib/metadata.ts           ← Bilingual keywords, hreflang x-default
src/app/sitemap.ts            ← No change needed (URLs unchanged)
tailwind.config.ts            ← Ensure RTL variant enabled (already on by default in v3)
```

### Translation File Structure

```json
{
  "Common": {
    "copy": "Copy",
    "download": "Download",
    "upload": "Upload",
    "reset": "Reset",
    "clear": "Clear",
    "save": "Save",
    "cancel": "Cancel",
    "apply": "Apply",
    "close": "Close",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "Header": {
    "requestTool": "Request a tool",
    "coffee": "Buy me a coffee",
    "openMenu": "Open navigation menu",
    "github": "Visit our GitHub repository",
    "twitter": "Follow us on X (Twitter)"
  },
  "LanguageSwitcher": {
    "label": "Language",
    "en": "English",
    "ar": "العربية"
  },
  "Sidebar": {
    "searchPlaceholder": "Search tools...",
    "allTools": "All Tools",
    "newBadge": "New"
  },
  "Home": {
    "hero": "Essential Browser-Based Productivity Tools",
    "subtitle": "No servers. Full privacy. Everything runs in your browser.",
    "searchPlaceholder": "Search 80+ tools...",
    "newToolsBadge": "New tools added weekly"
  },
  "ToolsConfig": {
    "categories": {
      "imageTools": "Image Tools",
      "fileTools": "File Tools",
      "mediaTools": "Media & Video",
      "textLanguage": "Text & Language",
      "dataTools": "Data & Conversion",
      "mathFinance": "Math & Finance",
      "productivity": "Productivity",
      "securityDev": "Security & Dev",
      "designTools": "Design & Visual"
    },
    "tools": {
      "bg-removal": { "name": "Background Removal", "description": "..." },
      "json-formatter": { "name": "JSON Formatter", "description": "..." }
    }
  },
  "Tools": {
    "JsonFormatter": {
      "format": "Format",
      "minify": "Minify",
      "copy": "Copy JSON",
      "inputPlaceholder": "Paste JSON here..."
    }
  }
}
```

### Language Store

```typescript
// src/store/language-store.ts
interface LanguageState {
  locale: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  setLocale: (locale: 'en' | 'ar') => void;
}

// Zustand with persist middleware (localStorage key: 'browsery-locale')
// On first load: detect from navigator.language if no stored value
```

### RTL Layout Strategy

1. **`<html dir lang>`** — set via inline script in layout before hydration (prevents FOUC)
2. **Font** — `html[lang="ar"] { font-family: 'IBM Plex Sans Arabic', sans-serif; }` in globals.css
3. **Tailwind RTL variants** — all directional classes use `rtl:` counterparts
4. **Sheet sidebar** — `side={dir === 'rtl' ? 'right' : 'left'}`
5. **Directional icons** — arrows, chevrons get `rtl:scale-x-[-1]` where needed

### FOUC Prevention (Inline Script in layout.tsx)

```javascript
const lang = localStorage.getItem('browsery-locale') ||
  (navigator.language.startsWith('ar') ? 'ar' : 'en');
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
```

This runs synchronously before React hydration so no directional flash.

---

## Parallel Agent Split

Agent 1 must complete before agents 2–10 start (they depend on the translation hook).

| Agent | Scope | Components |
|-------|-------|-----------|
| **1 — Infrastructure** | Core i18n setup | next-intl install, language-store, LanguageProvider, LanguageSwitcher, layout RTL, font, en.json + ar.json skeletons |
| **2 — Image Tools** | 7 components | BgRemoval, PhoneMockups, ImageCompression, FormatConverter, ColorCorrection, SVGTools, ColorConverter |
| **3 — File & Media** | 8 components | PDF, Zip, Spreadsheet, FileConverter, Video, Audio, CompressVideo, MicCamera |
| **4 — Text Tools I** | 7 components | TextCase, TextCounter, TextDiff, TextSorter, TextBinary, TextRepeater, MorseCode |
| **5 — Text Tools II** | 8 components | MarkdownEditor, MarkdownHTML, HtmlFormatter, CodeFormat, CSSMinifier, SqlFormatter, WordFrequency, Notepad |
| **6 — Data Tools** | 12 components | JsonFormatter, JsonCSV, Base64, QRGenerator, QRScanner, BarcodeGenerator, BarcodeScanner, Charts, YamlJson, UrlEncoder, FakeData, LoremIpsum |
| **7 — Math & Finance** | 12 components | Calculator, UnitConverter, LoanCalculator, PercentageCalculator, AspectRatio, ExpenseTracker, Invoice, BMI, Tip, RomanNumeral, CurrencyConverter, NumberBase |
| **8 — Productivity & Nav** | 6 + sidebar | Todo, Timer, Pomodoro, WorldClock, Stopwatch, HabitTracker, Sidebar, tools-config Arabic names |
| **9 — Security & Dev** | 9 components | PasswordGenerator, JWT, Hash, RegexTester, CronParser, PasswordStrength, TextEncryption, HttpStatus, UuidGenerator |
| **10 — Design & SEO** | 8 + SEO | CSSGradient, ColorPalette, ImageResizer, ContrastChecker, ColorBlindness, ExifViewer, EmojiPicker, ScreenRecorder + metadata.ts, Homepage, Blog |

---

## Verification Checklist (Post-agents)

- [ ] `grep -r '"[A-Z]' src/components` finds no untranslated hardcoded strings
- [ ] `bun run build` passes with no TypeScript errors
- [ ] RTL visual check via Playwright screenshot (ar locale)
- [ ] Language toggle persists on page reload
- [ ] Browser language `ar` auto-selects Arabic on first visit
- [ ] All tool pages render correctly in both directions
- [ ] SEO: `<html lang="ar" dir="rtl">` when Arabic active

---

## Adding Future Languages

1. Add `messages/<locale>.json` with same key structure
2. Add locale to the union type in `language-store.ts` (`'en' | 'ar' | 'fr'`)
3. Add option to `LanguageSwitcher` component
4. Done — no routing changes, no infrastructure changes

---

## SEO Notes

Context-based i18n means server-rendered metadata is always English (server doesn't know user's locale preference). Mitigations:
- Bilingual keywords in `generateToolMetadata` (Arabic terms added alongside English)
- `hreflang: x-default` set in `alternates` metadata
- Inline script sets `lang="ar"` before hydration — Googlebot (JavaScript-rendering) will see the correct lang attribute
- Arabic Open Graph locale (`ar_SA`) injected client-side via `<Head>` update on locale change
