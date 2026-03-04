# Arabic Localization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Full Arabic (ar) localization with RTL support for all 80+ tools, a header language toggle, localStorage persistence, browser language auto-detection, and bilingual SEO — using `next-intl` in non-routing mode.

**Architecture:** Context-based i18n (single URL structure). `next-intl` wraps the app via `LanguageProvider`. A Zustand store persists the locale (`'en'|'ar'`) to localStorage. An inline `<Script strategy="beforeInteractive">` prevents RTL FOUC. IBM Plex Sans Arabic font is loaded alongside Geist and activated via `html[lang="ar"]` CSS selector.

**Tech Stack:** next-intl, Zustand persist, IBM_Plex_Sans_Arabic (next/font/google), Tailwind RTL variants, Radix DropdownMenu

---

## IMPORTANT: Execution Order

**Task 1 MUST complete before Tasks 2–10 begin.** Tasks 2–10 are fully parallel.
After Tasks 2–10, run Tasks 11 (verification) and 12 (final commit/cleanup).

---

## Task 1: Infrastructure — i18n Core System

**Branch:** `feature/arabic-localization` (already created)

**Files to create:**
- `messages/en.json`
- `messages/ar.json`
- `src/store/language-store.ts`
- `src/providers/language-provider.tsx`
- `src/components/language-switcher.tsx`

**Files to modify:**
- `package.json` (add next-intl)
- `src/app/layout.tsx`
- `src/providers/providers.tsx`
- `src/components/header.tsx`
- `src/components/sidebar.tsx`
- `src/app/globals.css`
- `src/lib/tools-config.ts` (add `id` field to ToolCategory)

---

### Step 1: Install next-intl

```bash
bun add next-intl
```

Verify it appears in `package.json` dependencies.

---

### Step 2: Create `src/store/language-store.ts`

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "en" | "ar";
export type Dir = "ltr" | "rtl";

interface LanguageState {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      dir: "ltr",
      setLocale: (locale) =>
        set({ locale, dir: locale === "ar" ? "rtl" : "ltr" }),
    }),
    {
      name: "browsery-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

### Step 3: Add `id` field to `ToolCategory` in `src/lib/tools-config.ts`

**Find and modify** the `ToolCategory` interface (around line 75):

```typescript
export interface ToolCategory {
  category: string;
  id: string; // translation key for this category
  items: Tool[];
  order: number;
}
```

Then add `id` to each category in the `tools` array. Map:
- `"Image Tools"` → `id: "imageTools"`
- `"File Tools"` → `id: "fileTools"`
- Look for the categories in the file (there are ~9) and add the corresponding id using camelCase from the English name with `&` removed.

The full category id map:
| English Name | id |
|---|---|
| Image Tools | imageTools |
| File Tools | fileTools |
| Media & Video | mediaTools |
| Text & Language | textLanguage |
| Data & Conversion | dataTools |
| Math & Finance | mathFinance |
| Productivity | productivity |
| Security & Dev | securityDev |
| Design & Visual | designTools |

---

### Step 4: Create `messages/en.json`

Create this file at the project root level (same level as `src/`, `package.json`):

```json
{
  "Common": {
    "copy": "Copy",
    "copied": "Copied!",
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
    "success": "Success",
    "selectFile": "Select file",
    "dragDrop": "Drag and drop files here",
    "or": "or",
    "browse": "Browse files",
    "preview": "Preview",
    "output": "Output",
    "input": "Input",
    "settings": "Settings",
    "format": "Format",
    "convert": "Convert",
    "compress": "Compress",
    "generate": "Generate",
    "search": "Search",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "remove": "Remove",
    "export": "Export",
    "import": "Import",
    "start": "Start",
    "stop": "Stop",
    "pause": "Pause",
    "resume": "Resume",
    "done": "Done",
    "yes": "Yes",
    "no": "No",
    "comingSoon": "Coming Soon",
    "new": "New"
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
    "logoAlt": "BrowseryTools"
  },
  "Home": {
    "hero": "Essential Browser-Based Productivity Tools",
    "subtitle": "No servers. Full privacy. Everything runs in your browser.",
    "searchPlaceholder": "Search 80+ tools...",
    "newBadge": "New",
    "viewAll": "View all tools"
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
      "bg-removal": { "name": "Background Removal", "description": "Remove background from your images instantly using AI. Supports PNG, JPG. No watermark, completely free." },
      "phone-mockups": { "name": "Phone Mockups", "description": "Place screenshots into iPhone/Android device frames. Upload, choose a frame, and export." },
      "image-compression": { "name": "Image Compression", "description": "Compress images to reduce file size while maintaining quality. Supports JPG, PNG, WebP." },
      "image-converter": { "name": "Format Converter", "description": "Convert images between JPG, PNG, WebP, GIF, BMP, TIFF, and SVG. Batch conversion supported." },
      "color-correction": { "name": "Color Correction", "description": "Adjust colors, brightness, contrast, saturation, and hue in images." },
      "svg": { "name": "SVG Tools", "description": "Edit and manipulate SVG vector graphics. Scale, modify colors, optimize paths." },
      "color-converter": { "name": "Color Converter", "description": "Convert between HEX, RGB, and HSL with live preview." },
      "pdf": { "name": "PDF Tools", "description": "Merge, split, compress, and manipulate PDF files. Extract text, rotate pages." },
      "zip": { "name": "Zip Tools", "description": "Create, extract, and manage ZIP archives. Supports password protection." },
      "spreadsheet": { "name": "Spreadsheet Viewer", "description": "View and edit spreadsheet files (XLSX, CSV) in your browser." },
      "file-converter": { "name": "File Converter", "description": "Convert files between different formats. Supports documents, images, and more." },
      "video": { "name": "Video Editor", "description": "Edit videos in your browser. Trim, merge, and add effects." },
      "audio": { "name": "Audio Editor", "description": "Edit audio files. Trim, merge, and adjust volume." },
      "mic-camera": { "name": "Mic & Camera Tester", "description": "Test your microphone and camera without any app installation." },
      "compress-video": { "name": "Video Compressor", "description": "Compress video files to reduce size while maintaining quality." },
      "text-case": { "name": "Text Case Converter", "description": "Convert text between different cases: uppercase, lowercase, title case, camelCase, and more." },
      "text-counter": { "name": "Text Counter", "description": "Count characters, words, sentences, and paragraphs in your text." },
      "text-diff": { "name": "Text Diff", "description": "Compare two texts and highlight the differences." },
      "text-sorter": { "name": "Text Sorter", "description": "Sort lines of text alphabetically, numerically, or by length." },
      "text-binary": { "name": "Text to Binary", "description": "Convert text to binary and binary back to text." },
      "text-repeater": { "name": "Text Repeater", "description": "Repeat text a specified number of times with custom separators." },
      "morse-code": { "name": "Morse Code", "description": "Encode and decode Morse code. Convert text to dots and dashes." },
      "markdown-editor": { "name": "Markdown Editor", "description": "Write and preview Markdown in real time." },
      "markdown-html": { "name": "Markdown to HTML", "description": "Convert Markdown to HTML instantly." },
      "html-formatter": { "name": "HTML Formatter", "description": "Format and beautify HTML code for readability." },
      "code-format": { "name": "Code Formatter", "description": "Format code in multiple languages: JavaScript, Python, CSS, and more." },
      "css-minifier": { "name": "CSS Minifier", "description": "Minify CSS code to reduce file size." },
      "sql-formatter": { "name": "SQL Formatter", "description": "Format and beautify SQL queries." },
      "word-frequency": { "name": "Word Frequency", "description": "Analyze word frequency in text." },
      "notepad": { "name": "Notepad", "description": "A simple in-browser notepad that auto-saves your text." },
      "json-formatter": { "name": "JSON Formatter", "description": "Format, validate, and minify JSON with syntax highlighting." },
      "json-csv": { "name": "JSON ↔ CSV", "description": "Convert between JSON and CSV formats." },
      "base64": { "name": "Base64 Converter", "description": "Encode and decode Base64 strings." },
      "qr-generator": { "name": "QR Generator", "description": "Generate QR codes from text, URLs, or any data." },
      "qr-scanner": { "name": "QR Scanner", "description": "Scan and decode QR codes from your camera or uploaded images." },
      "barcode-generator": { "name": "Barcode Generator", "description": "Generate barcodes in multiple formats: EAN, UPC, Code128, and more." },
      "barcode-scanner": { "name": "Barcode Scanner", "description": "Scan and decode barcodes from your camera or images." },
      "charts": { "name": "Chart Builder", "description": "Create bar, line, pie, and area charts from your data." },
      "yaml-json": { "name": "YAML ↔ JSON", "description": "Convert between YAML and JSON formats." },
      "url-encoder": { "name": "URL Encoder/Decoder", "description": "Encode and decode URLs and query parameters." },
      "fake-data": { "name": "Fake Data Generator", "description": "Generate realistic fake data: names, emails, addresses, and more." },
      "lorem-ipsum": { "name": "Lorem Ipsum Generator", "description": "Generate placeholder Lorem Ipsum text in various formats." },
      "calculator": { "name": "Calculator", "description": "A full-featured scientific calculator." },
      "unit-converter": { "name": "Unit Converter", "description": "Convert between units of length, weight, temperature, and more." },
      "loan-calculator": { "name": "Loan Calculator", "description": "Calculate monthly payments, interest, and total cost of loans." },
      "percentage-calculator": { "name": "Percentage Calculator", "description": "Calculate percentages, percentage change, and ratio." },
      "aspect-ratio": { "name": "Aspect Ratio Calculator", "description": "Calculate and maintain aspect ratios for images and videos." },
      "expense-tracker": { "name": "Expense Tracker", "description": "Track your personal expenses with categories and charts." },
      "invoice": { "name": "Invoice Generator", "description": "Create and export professional invoices as PDF." },
      "bmi-calculator": { "name": "BMI Calculator", "description": "Calculate your Body Mass Index and health category." },
      "tip-calculator": { "name": "Tip Calculator", "description": "Calculate tip amounts and split bills." },
      "roman-numeral": { "name": "Roman Numeral Converter", "description": "Convert between Roman numerals and decimal numbers." },
      "currency-converter": { "name": "Currency Converter", "description": "Convert between world currencies with live exchange rates." },
      "number-base-converter": { "name": "Number Base Converter", "description": "Convert numbers between binary, octal, decimal, and hexadecimal." },
      "todo": { "name": "Todo List", "description": "Manage tasks with a persistent to-do list." },
      "timer": { "name": "Timer", "description": "A simple countdown timer with alarm." },
      "pomodoro": { "name": "Pomodoro Timer", "description": "Stay focused with the Pomodoro productivity technique." },
      "world-clock": { "name": "World Clock", "description": "View the current time in cities around the world." },
      "stopwatch": { "name": "Stopwatch", "description": "A precise stopwatch with lap tracking." },
      "habit-tracker": { "name": "Habit Tracker", "description": "Build and track daily habits with streaks." },
      "password-generator": { "name": "Password Generator", "description": "Generate strong, secure passwords with custom rules." },
      "jwt-decoder": { "name": "JWT Decoder", "description": "Decode and inspect JSON Web Tokens without verification." },
      "hash-generator": { "name": "Hash Generator", "description": "Generate MD5, SHA-1, SHA-256, and other cryptographic hashes." },
      "regex-tester": { "name": "Regex Tester", "description": "Test and debug regular expressions with live matching." },
      "cron-parser": { "name": "Cron Parser", "description": "Parse and explain cron expressions in plain English." },
      "password-strength": { "name": "Password Strength Checker", "description": "Analyze the strength of your passwords." },
      "text-encryption": { "name": "Text Encryption", "description": "Encrypt and decrypt text using AES and other algorithms." },
      "http-status": { "name": "HTTP Status Codes", "description": "Reference guide for all HTTP status codes with descriptions." },
      "uuid-generator": { "name": "UUID Generator", "description": "Generate UUIDs v4 and other versions instantly." },
      "css-gradient": { "name": "CSS Gradient Generator", "description": "Generate beautiful CSS gradients visually." },
      "color-palette": { "name": "Color Palette Generator", "description": "Generate color palettes from images or create custom ones." },
      "image-resizer": { "name": "Image Resizer", "description": "Resize images to specific dimensions while preserving quality." },
      "contrast-checker": { "name": "Contrast Checker", "description": "Check color contrast ratios for WCAG accessibility compliance." },
      "color-blindness": { "name": "Color Blindness Simulator", "description": "Simulate how your designs look to users with color vision deficiencies." },
      "exif-viewer": { "name": "EXIF Viewer", "description": "View EXIF metadata embedded in photos." },
      "emoji-picker": { "name": "Emoji Picker", "description": "Browse and copy emojis with search and categories." },
      "screen-recorder": { "name": "Screen Recorder", "description": "Record your screen directly in the browser. No app needed." },
      "text-sorter": { "name": "Text Sorter", "description": "Sort lines of text alphabetically or by custom rules." },
      "rich-editor": { "name": "Rich Text Editor", "description": "A full-featured rich text editor with formatting tools." },
      "typing-test": { "name": "Typing Test", "description": "Test and improve your typing speed and accuracy." },
      "timezone-converter": { "name": "Timezone Converter", "description": "Convert times between different timezones." },
      "age-calculator": { "name": "Age Calculator", "description": "Calculate exact age from a birth date." },
      "unix-timestamp": { "name": "Unix Timestamp", "description": "Convert between Unix timestamps and human-readable dates." },
      "svg-png": { "name": "SVG to PNG", "description": "Convert SVG files to PNG images." }
    }
  }
}
```

---

### Step 5: Create `messages/ar.json`

```json
{
  "Common": {
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "download": "تحميل",
    "upload": "رفع",
    "reset": "إعادة تعيين",
    "clear": "مسح",
    "save": "حفظ",
    "cancel": "إلغاء",
    "apply": "تطبيق",
    "close": "إغلاق",
    "loading": "جارٍ التحميل...",
    "error": "خطأ",
    "success": "تم بنجاح",
    "selectFile": "اختر ملفاً",
    "dragDrop": "اسحب وأفلت الملفات هنا",
    "or": "أو",
    "browse": "تصفح الملفات",
    "preview": "معاينة",
    "output": "الناتج",
    "input": "المدخل",
    "settings": "الإعدادات",
    "format": "تنسيق",
    "convert": "تحويل",
    "compress": "ضغط",
    "generate": "توليد",
    "search": "بحث",
    "delete": "حذف",
    "edit": "تعديل",
    "add": "إضافة",
    "remove": "إزالة",
    "export": "تصدير",
    "import": "استيراد",
    "start": "ابدأ",
    "stop": "إيقاف",
    "pause": "إيقاف مؤقت",
    "resume": "استئناف",
    "done": "تم",
    "yes": "نعم",
    "no": "لا",
    "comingSoon": "قريباً",
    "new": "جديد"
  },
  "Header": {
    "requestTool": "اطلب أداة",
    "coffee": "ادعمنا بقهوة",
    "openMenu": "فتح قائمة التنقل",
    "github": "زيارة مستودعنا على GitHub",
    "twitter": "تابعنا على X (تويتر)"
  },
  "LanguageSwitcher": {
    "label": "اللغة",
    "en": "English",
    "ar": "العربية"
  },
  "Sidebar": {
    "searchPlaceholder": "ابحث عن الأدوات...",
    "logoAlt": "بروزري تولز"
  },
  "Home": {
    "hero": "أدوات إنتاجية متكاملة تعمل في المتصفح",
    "subtitle": "بدون خوادم. خصوصية تامة. كل شيء يعمل داخل متصفحك.",
    "searchPlaceholder": "ابحث في أكثر من 80 أداة...",
    "newBadge": "جديد",
    "viewAll": "عرض جميع الأدوات"
  },
  "ToolsConfig": {
    "categories": {
      "imageTools": "أدوات الصور",
      "fileTools": "أدوات الملفات",
      "mediaTools": "الوسائط والفيديو",
      "textLanguage": "النص واللغة",
      "dataTools": "البيانات والتحويل",
      "mathFinance": "الرياضيات والمالية",
      "productivity": "الإنتاجية",
      "securityDev": "الأمان والتطوير",
      "designTools": "التصميم والمرئيات"
    },
    "tools": {
      "bg-removal": { "name": "إزالة الخلفية", "description": "أزل خلفية صورك فورياً باستخدام الذكاء الاصطناعي. يدعم PNG وJPG. بدون علامة مائية، مجاني تماماً." },
      "phone-mockups": { "name": "قوالب الهاتف", "description": "ضع لقطات الشاشة داخل إطارات أجهزة iPhone وAndroid. ارفع الصورة، اختر الإطار، وصدّر." },
      "image-compression": { "name": "ضغط الصور", "description": "اضغط الصور لتقليل حجم الملف مع الحفاظ على الجودة. يدعم JPG وPNG وWebP." },
      "image-converter": { "name": "محوّل الصيغ", "description": "حوّل الصور بين JPG وPNG وWebP وGIF وBMP وTIFF وSVG. يدعم التحويل الجماعي." },
      "color-correction": { "name": "تصحيح الألوان", "description": "اضبط الألوان والسطوع والتباين والتشبع والصبغة في الصور." },
      "svg": { "name": "أدوات SVG", "description": "حرّر وعدّل ملفات SVG المتجهة. قم بالتحجيم وتعديل الألوان وتحسين المسارات." },
      "color-converter": { "name": "محوّل الألوان", "description": "حوّل بين HEX وRGB وHSL مع معاينة مباشرة." },
      "pdf": { "name": "أدوات PDF", "description": "دمج وتقسيم وضغط وتعديل ملفات PDF. استخراج النص وتدوير الصفحات." },
      "zip": { "name": "أدوات ZIP", "description": "إنشاء واستخراج وإدارة ملفات ZIP. يدعم الحماية بكلمة مرور." },
      "spreadsheet": { "name": "عارض جداول البيانات", "description": "عرض وتعديل ملفات جداول البيانات (XLSX وCSV) في متصفحك." },
      "file-converter": { "name": "محوّل الملفات", "description": "حوّل الملفات بين صيغ مختلفة. يدعم المستندات والصور والمزيد." },
      "video": { "name": "محرر الفيديو", "description": "حرّر مقاطع الفيديو في متصفحك. قص ودمج وإضافة تأثيرات." },
      "audio": { "name": "محرر الصوت", "description": "حرّر ملفات الصوت. قص ودمج وضبط مستوى الصوت." },
      "mic-camera": { "name": "اختبار الميكروفون والكاميرا", "description": "اختبر ميكروفونك وكاميرتك بدون أي تطبيق." },
      "compress-video": { "name": "ضاغط الفيديو", "description": "اضغط ملفات الفيديو لتقليل الحجم مع الحفاظ على الجودة." },
      "text-case": { "name": "محوّل حالة النص", "description": "حوّل النص بين حالات مختلفة: كبير وصغير وعنوان وكامل هامبير وغيرها." },
      "text-counter": { "name": "عداد النص", "description": "عدّ الأحرف والكلمات والجمل والفقرات في نصك." },
      "text-diff": { "name": "مقارنة النصوص", "description": "قارن نصين وأبرز الاختلافات." },
      "text-sorter": { "name": "ترتيب النصوص", "description": "رتّب أسطر النص أبجدياً أو رقمياً أو حسب الطول." },
      "text-binary": { "name": "النص إلى ثنائي", "description": "حوّل النص إلى ثنائي والثنائي إلى نص." },
      "text-repeater": { "name": "مكرر النص", "description": "كرّر النص عدداً محدداً من المرات مع فواصل مخصصة." },
      "morse-code": { "name": "شيفرة مورس", "description": "رمّز وفكّ رموز شيفرة مورس. حوّل النص إلى نقاط وشرطات." },
      "markdown-editor": { "name": "محرر Markdown", "description": "اكتب وشاهد Markdown في الوقت الفعلي." },
      "markdown-html": { "name": "Markdown إلى HTML", "description": "حوّل Markdown إلى HTML فورياً." },
      "html-formatter": { "name": "منسّق HTML", "description": "نسّق وجمّل كود HTML لتحسين القراءة." },
      "code-format": { "name": "منسّق الكود", "description": "نسّق الكود بلغات متعددة: JavaScript وPython وCSS والمزيد." },
      "css-minifier": { "name": "مضغوط CSS", "description": "اضغط كود CSS لتقليل حجم الملف." },
      "sql-formatter": { "name": "منسّق SQL", "description": "نسّق وجمّل استعلامات SQL." },
      "word-frequency": { "name": "تكرار الكلمات", "description": "حلّل تكرار الكلمات في النص." },
      "notepad": { "name": "المفكرة", "description": "مفكرة بسيطة في المتصفح تحفظ نصك تلقائياً." },
      "json-formatter": { "name": "منسّق JSON", "description": "نسّق وتحقق وضغط JSON مع تمييز بالألوان." },
      "json-csv": { "name": "JSON ↔ CSV", "description": "حوّل بين صيغتي JSON وCSV." },
      "base64": { "name": "محوّل Base64", "description": "شفّر وفكّ تشفير نصوص Base64." },
      "qr-generator": { "name": "مولّد رمز QR", "description": "أنشئ رموز QR من نصوص أو روابط أو أي بيانات." },
      "qr-scanner": { "name": "قارئ رمز QR", "description": "امسح وفكّ رموز QR من الكاميرا أو الصور المرفوعة." },
      "barcode-generator": { "name": "مولّد الباركود", "description": "أنشئ باركودات بصيغ متعددة: EAN وUPC وCode128 والمزيد." },
      "barcode-scanner": { "name": "قارئ الباركود", "description": "امسح وفكّ الباركودات من الكاميرا أو الصور." },
      "charts": { "name": "منشئ الرسوم البيانية", "description": "أنشئ رسوماً بيانية شريطية وخطية ودائرية ومساحية من بياناتك." },
      "yaml-json": { "name": "YAML ↔ JSON", "description": "حوّل بين صيغتي YAML وJSON." },
      "url-encoder": { "name": "ترميز/فك ترميز URL", "description": "شفّر وفكّ تشفير روابط URL ومعاملات الاستعلام." },
      "fake-data": { "name": "مولّد بيانات وهمية", "description": "أنشئ بيانات وهمية واقعية: أسماء وبريد إلكتروني وعناوين والمزيد." },
      "lorem-ipsum": { "name": "مولّد Lorem Ipsum", "description": "أنشئ نصوص Lorem Ipsum بأشكال متعددة." },
      "calculator": { "name": "الآلة الحاسبة", "description": "آلة حاسبة علمية متكاملة." },
      "unit-converter": { "name": "محوّل الوحدات", "description": "حوّل بين وحدات الطول والوزن ودرجة الحرارة والمزيد." },
      "loan-calculator": { "name": "حاسبة القروض", "description": "احسب الأقساط الشهرية والفائدة والتكلفة الإجمالية للقروض." },
      "percentage-calculator": { "name": "حاسبة النسبة المئوية", "description": "احسب النسب المئوية والتغيير النسبي والنسب." },
      "aspect-ratio": { "name": "حاسبة نسبة العرض إلى الارتفاع", "description": "احسب وحافظ على نسب العرض إلى الارتفاع للصور والفيديوهات." },
      "expense-tracker": { "name": "متتبع المصروفات", "description": "تتبع مصروفاتك الشخصية بفئات ورسوم بيانية." },
      "invoice": { "name": "مولّد الفواتير", "description": "أنشئ وصدّر فواتير احترافية بصيغة PDF." },
      "bmi-calculator": { "name": "حاسبة مؤشر كتلة الجسم", "description": "احسب مؤشر كتلة جسمك وفئتك الصحية." },
      "tip-calculator": { "name": "حاسبة الإكراميات", "description": "احسب مبالغ الإكراميات وقسّم الفاتورة." },
      "roman-numeral": { "name": "محوّل الأرقام الرومانية", "description": "حوّل بين الأرقام الرومانية والأعداد العشرية." },
      "currency-converter": { "name": "محوّل العملات", "description": "حوّل بين عملات العالم بأسعار صرف فورية." },
      "number-base-converter": { "name": "محوّل قواعد الأرقام", "description": "حوّل الأرقام بين الثنائية والثمانية والعشرية والسادس عشري." },
      "todo": { "name": "قائمة المهام", "description": "أدر مهامك بقائمة مهام دائمة." },
      "timer": { "name": "المؤقت", "description": "مؤقت عد تنازلي بسيط مع منبه." },
      "pomodoro": { "name": "مؤقت بومودورو", "description": "حافظ على تركيزك بتقنية بومودورو للإنتاجية." },
      "world-clock": { "name": "ساعة العالم", "description": "شاهد الوقت الحالي في مدن حول العالم." },
      "stopwatch": { "name": "ساعة الإيقاف", "description": "ساعة إيقاف دقيقة مع تتبع الأوقات." },
      "habit-tracker": { "name": "متتبع العادات", "description": "ابنِ وتتبع العادات اليومية مع الاستمرارية." },
      "password-generator": { "name": "مولّد كلمات المرور", "description": "أنشئ كلمات مرور قوية وآمنة بقواعد مخصصة." },
      "jwt-decoder": { "name": "فكّ تشفير JWT", "description": "فكّ وفحص رموز JSON Web Tokens بدون تحقق." },
      "hash-generator": { "name": "مولّد الهاش", "description": "أنشئ هاشات MD5 وSHA-1 وSHA-256 وغيرها." },
      "regex-tester": { "name": "مختبر Regex", "description": "اختبر وصحّح التعبيرات النمطية مع مطابقة فورية." },
      "cron-parser": { "name": "محلّل Cron", "description": "حلّل واشرح تعبيرات Cron بلغة بسيطة." },
      "password-strength": { "name": "قوة كلمة المرور", "description": "حلّل قوة كلمات مرورك." },
      "text-encryption": { "name": "تشفير النص", "description": "شفّر وفكّ تشفير النصوص باستخدام AES وخوارزميات أخرى." },
      "http-status": { "name": "رموز HTTP", "description": "دليل مرجعي لجميع رموز حالة HTTP مع الأوصاف." },
      "uuid-generator": { "name": "مولّد UUID", "description": "أنشئ معرفات UUID v4 وإصدارات أخرى فورياً." },
      "css-gradient": { "name": "مولّد تدرج CSS", "description": "أنشئ تدرجات CSS جميلة بصرياً." },
      "color-palette": { "name": "مولّد لوحة الألوان", "description": "أنشئ لوحات ألوان من الصور أو أنشئ لوحات مخصصة." },
      "image-resizer": { "name": "تغيير حجم الصور", "description": "غيّر حجم الصور إلى أبعاد محددة مع الحفاظ على الجودة." },
      "contrast-checker": { "name": "فاحص التباين", "description": "افحص نسب تباين الألوان لامتثال إمكانية الوصول WCAG." },
      "color-blindness": { "name": "محاكي عمى الألوان", "description": "احاكِ كيف تبدو تصاميمك للمستخدمين ذوي ضعف رؤية الألوان." },
      "exif-viewer": { "name": "عارض EXIF", "description": "اعرض البيانات الوصفية EXIF المضمنة في الصور." },
      "emoji-picker": { "name": "منتقي الرموز التعبيرية", "description": "تصفح وانسخ الرموز التعبيرية مع بحث وتصنيفات." },
      "screen-recorder": { "name": "مسجّل الشاشة", "description": "سجّل شاشتك مباشرة في المتصفح. لا يحتاج تطبيق." },
      "rich-editor": { "name": "محرر النص الغني", "description": "محرر نص غني متكامل مع أدوات التنسيق." },
      "typing-test": { "name": "اختبار الكتابة", "description": "اختبر وحسّن سرعة كتابتك ودقتها." },
      "timezone-converter": { "name": "محوّل المناطق الزمنية", "description": "حوّل الأوقات بين مناطق زمنية مختلفة." },
      "age-calculator": { "name": "حاسبة العمر", "description": "احسب العمر الدقيق من تاريخ الميلاد." },
      "unix-timestamp": { "name": "Unix Timestamp", "description": "حوّل بين طوابع Unix الزمنية والتواريخ المقروءة." },
      "svg-png": { "name": "SVG إلى PNG", "description": "حوّل ملفات SVG إلى صور PNG." }
    }
  }
}
```

---

### Step 6: Create `src/providers/language-provider.tsx`

```typescript
"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { useEffect, useRef } from "react";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

const messages = { en: enMessages, ar: arMessages } as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir, setLocale } = useLanguageStore();
  const initialized = useRef(false);

  // Detect browser language on first visit (no stored preference)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const stored = localStorage.getItem("browsery-locale");
      if (!stored) {
        const browserLang = navigator.language || "";
        if (browserLang.startsWith("ar")) {
          setLocale("ar");
        }
      }
    }
  }, [setLocale]);

  // Keep html dir/lang in sync
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
```

---

### Step 7: Create `src/components/language-switcher.tsx`

```typescript
"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore, type Locale } from "@/store/language-store";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "outline" | "ghost";
  className?: string;
}

const LOCALES: { locale: Locale; nativeLabel: string }[] = [
  { locale: "en", nativeLabel: "English" },
  { locale: "ar", nativeLabel: "العربية" },
];

export function LanguageSwitcher({
  variant = "ghost",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguageStore();
  const t = useTranslations("LanguageSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn("h-8 px-2 gap-1", className)}
          aria-label={t("label")}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium hidden sm:inline">
            {locale === "ar" ? "عر" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(({ locale: l, nativeLabel }) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={cn(locale === l && "font-semibold")}
          >
            {nativeLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Step 8: Update `src/app/globals.css`

Add after the existing CSS variables block:

```css
/* Arabic font activation */
html[lang="ar"] {
  font-family: var(--font-arabic), "IBM Plex Sans Arabic", sans-serif;
}

/* RTL number display — use Arabic-Indic numerals for Arabic locale */
html[lang="ar"] input[type="number"] {
  direction: ltr; /* Keep number inputs LTR for usability */
}
```

---

### Step 9: Update `src/app/layout.tsx`

Replace the entire file with:

```typescript
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers/providers";

const geist = Geist({ subsets: ["latin"] });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrowseryTools - Essential Browser-Based Productivity Tools",
    template: "%s | BrowseryTools",
  },
  description:
    "Essential browser-based tools for productivity. No servers. Full privacy. Convert files, compress images, generate passwords, format code, and more - all in your browser. أدوات متصفح مجانية للإنتاجية.",
  keywords: [
    "browser tools",
    "productivity tools",
    "free online tools",
    "privacy-focused",
    "client-side tools",
    "أدوات متصفح",
    "أدوات مجانية",
    "أدوات إنتاجية",
    "أدوات بدون خوادم",
    "خصوصية تامة",
  ],
  authors: [{ name: "aghyadev" }],
  creator: "aghyadev",
  publisher: "aghyadev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://browserytools.com"),
  alternates: {
    canonical: "/",
    languages: {
      "x-default": "https://browserytools.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://browserytools.com",
    title: "BrowseryTools - Essential Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy.",
    siteName: "BrowseryTools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrowseryTools - Essential Browser-Based Productivity Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowseryTools - Essential Browser-Based Productivity Tools",
    description:
      "Essential browser-based tools for productivity. No servers. Full privacy.",
    images: ["/og-image.png"],
    creator: "@aghyadev",
    site: "@aghyadev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Productivity Tools",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BrowseryTools",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    github: "https://github.com/aghyad97",
    x: "https://twitter.com/aghyadev",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${geist.className} ${ibmPlexArabic.variable}`}>
        <Script
          id="lang-dir-init"
          strategy="beforeInteractive"
        >{`(function(){try{var s=localStorage.getItem('browsery-locale');var lang=s||(navigator.language&&navigator.language.startsWith('ar')?'ar':'en');if(lang==='ar'){document.documentElement.setAttribute('lang','ar');document.documentElement.setAttribute('dir','rtl');}else{document.documentElement.setAttribute('lang','en');document.documentElement.setAttribute('dir','ltr');}}catch(e){}})();`}</Script>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
```

---

### Step 10: Update `src/providers/providers.tsx`

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "./language-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
      <Analytics />
    </NextThemesProvider>
  );
}
```

---

### Step 11: Update `src/components/header.tsx`

Add LanguageSwitcher import and component. In the `<div className="flex items-center gap-2 sm:gap-4">` section, add `<LanguageSwitcher />` and `<LanguageSwitcher className="sm:hidden" variant="outline" />` alongside the ThemeSwitcher.

Also translate the "Request a tool" button text and "Buy me a coffee" text using `useTranslations('Header')`.

Exact changes to `header.tsx`:

1. Add import at top:
```typescript
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";
```

2. Inside the component, add after the `usePathname` and store lines:
```typescript
const t = useTranslations("Header");
```

3. Replace `"Request a tool"` with `{t("requestTool")}`

4. Replace `"Buy me a coffee"` with `{t("coffee")}`

5. Replace `aria-label="Open navigation menu"` with `aria-label={t("openMenu")}`

6. Replace `aria-label="Visit our GitHub repository"` (both instances) with `aria-label={t("github")}`

7. Replace `aria-label="Follow us on X (Twitter)"` (all instances) with `aria-label={t("twitter")}`

8. In the desktop links section (`hidden sm:flex`), after `<ThemeSwitcher />` add:
```tsx
<LanguageSwitcher />
```

9. Replace `<ThemeSwitcher className="sm:hidden" variant="outline" />` section to also include a mobile language switcher:
```tsx
<ThemeSwitcher className="sm:hidden" variant="outline" />
<LanguageSwitcher className="sm:hidden" variant="outline" />
```

---

### Step 12: Update `src/components/sidebar.tsx`

Add translations for category names, tool names, and search placeholder.

1. Add imports:
```typescript
import { useTranslations } from "next-intl";
```

2. Inside `Sidebar` component, add:
```typescript
const t = useTranslations("Sidebar");
const tc = useTranslations("ToolsConfig");
```

3. Change the search Input placeholder:
```tsx
placeholder={t("searchPlaceholder")}
```

4. Change the category heading:
```tsx
<h3 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
  {tc(`categories.${category.id}` as any)}
</h3>
```

5. Change the tool name display:
```tsx
<span className="truncate">
  {tc(`tools.${tool.href.replace('/tools/', '')}.name` as any)}
</span>
```

6. Change the "Coming Soon" tooltip:
```tsx
<p>{t("comingSoon", { ns: "Common" })}</p>
```
Actually use:
```typescript
const tCommon = useTranslations("Common");
// ...
<p>{tCommon("comingSoon")}</p>
```

---

### Step 13: Set up next-intl TypeScript types

Create `src/i18n.d.ts`:

```typescript
import en from "../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en;
  }
}
```

---

### Step 14: Verify the build

```bash
bun run build
```

Expected: Clean build, no TypeScript errors. If you see missing translation key errors, fix them in `messages/en.json`.

---

### Step 15: Commit Task 1

```bash
git add -A
git commit -m "feat(i18n): add core infrastructure — next-intl, language store, RTL, IBM Plex Arabic"
```

---

## Tasks 2–10: Tool Localization (PARALLEL after Task 1)

**These all follow the same pattern.** Read carefully and apply it to every component in your assigned group.

### The Translation Pattern (read this once, apply everywhere)

For each tool component:

1. **Add import** at the top of the component:
```typescript
import { useTranslations } from "next-intl";
```

2. **Create a namespace** in `messages/en.json` for this tool, under `"Tools"`:
```json
"Tools": {
  "MyTool": {
    "title": "My Tool",
    "placeholder": "Enter text here...",
    "buttonLabel": "Process",
    "errorMessage": "Invalid input"
  }
}
```

3. **Add matching Arabic** in `messages/ar.json` under `"Tools"`:
```json
"Tools": {
  "MyTool": {
    "title": "أداتي",
    "placeholder": "أدخل النص هنا...",
    "buttonLabel": "معالجة",
    "errorMessage": "مدخل غير صالح"
  }
}
```

4. **Use in component** (component must be `"use client"`):
```typescript
const t = useTranslations("Tools.MyTool");
const tCommon = useTranslations("Common");

// Replace hardcoded strings:
// "Copy" → {tCommon("copy")}
// "Download" → {tCommon("download")}
// "Reset" → {tCommon("reset")}
// "Search..." → {t("searchPlaceholder")}
// etc.
```

5. **Add RTL layout** classes. For every directional class, add the RTL counterpart:
```tsx
// Space/margin:
className="ml-2 rtl:ml-0 rtl:mr-2"
// OR use logical properties:
className="ms-2"  // margin-inline-start (auto-flips in RTL)

// Flex row direction:
className="flex flex-row rtl:flex-row-reverse"

// Text alignment:
className="text-left rtl:text-right"

// Icon-before-text pattern:
<Icon className="mr-2 rtl:mr-0 rtl:ml-2" />

// Absolute positioned icons (like search):
className="left-3 rtl:left-auto rtl:right-3"
```

6. **Commit after each tool group** with message:
```
feat(i18n): translate [ToolName] to Arabic + RTL support
```

---

### Task 2: Image Tools

**Assignment:** Translate these 7 components + add to `messages/en.json` and `messages/ar.json`:

| Component | File |
|-----------|------|
| Background Removal | `src/components/BgRemoval.tsx` (find exact name) |
| Phone Mockups | `src/components/PhoneMockups.tsx` |
| Image Compression | `src/components/ImageCompression.tsx` |
| Format Converter | `src/components/ImageConverter.tsx` |
| Color Correction | `src/components/ColorCorrection.tsx` |
| SVG Tools | `src/components/SVGTools.tsx` |
| Color Converter | `src/components/ColorConverter.tsx` |

**Steps for each component:**
1. Read the component file — identify ALL hardcoded English strings (buttons, labels, placeholders, error messages, tooltips, headings, option labels)
2. Add namespace to `messages/en.json` under `Tools.<ComponentName>`
3. Add Arabic translations to `messages/ar.json` under `Tools.<ComponentName>`
4. Update component to use `useTranslations`
5. Add RTL classes to any directional layout elements
6. Verify: `bun run build` should complete without errors

**Commit:** `feat(i18n): translate image tools to Arabic + RTL support`

---

### Task 3: File & Media Tools

**Assignment:** Translate these 8 components:

| Component | Slug |
|-----------|------|
| PDF Tools | pdf |
| Zip Tools | zip |
| Spreadsheet Viewer | spreadsheet |
| File Converter | file-converter |
| Video Editor | video |
| Audio Editor | audio |
| Mic & Camera Tester | mic-camera |
| Video Compressor | compress-video |

Follow the Translation Pattern exactly. Commit: `feat(i18n): translate file & media tools to Arabic + RTL support`

---

### Task 4: Text Tools I

**Assignment:** Translate these 7 components:

| Slug | Notes |
|------|-------|
| text-case | Has multiple case option buttons — all need labels |
| text-counter | Shows stats like "Characters", "Words" |
| text-diff | Has "Original" / "Modified" labels |
| text-sorter | Sort direction options |
| text-binary | Two-direction conversion |
| text-repeater | "Repetitions", "Separator" labels |
| morse-code | "Encode" / "Decode" labels |

Commit: `feat(i18n): translate text tools I to Arabic + RTL support`

---

### Task 5: Text Tools II

**Assignment:** Translate these 8 components:

| Slug |
|------|
| markdown-editor |
| markdown-html |
| html-formatter |
| code-format |
| css-minifier |
| sql-formatter |
| word-frequency |
| notepad |

Commit: `feat(i18n): translate text tools II to Arabic + RTL support`

---

### Task 6: Data Tools

**Assignment:** Translate these 12 components:

| Slug |
|------|
| json-formatter |
| json-csv |
| base64 |
| qr-generator |
| qr-scanner |
| barcode-generator |
| barcode-scanner |
| charts |
| yaml-json |
| url-encoder |
| fake-data |
| lorem-ipsum |

Commit: `feat(i18n): translate data tools to Arabic + RTL support`

---

### Task 7: Math & Finance Tools

**Assignment:** Translate these 12 components:

| Slug |
|------|
| calculator |
| unit-converter |
| loan-calculator |
| percentage-calculator |
| aspect-ratio |
| expense-tracker |
| invoice |
| bmi-calculator |
| tip-calculator |
| roman-numeral |
| currency-converter |
| number-base-converter |

**Special note for calculator:** Ensure digit buttons stay LTR even in RTL mode. Wrap the calculator keypad in `dir="ltr"` explicitly.

Commit: `feat(i18n): translate math & finance tools to Arabic + RTL support`

---

### Task 8: Productivity & Navigation

**Assignment:** Translate these 6 components + sidebar navigation:

| Slug |
|------|
| todo |
| timer |
| pomodoro |
| world-clock |
| stopwatch |
| habit-tracker |

**Also update `src/components/sidebar.tsx`** (if Task 1 agent left any hardcoded strings) to ensure category names and tool names pull from translations.

**Special notes:**
- World clock: time displays should remain LTR format (numerals)
- Stopwatch: digit display stays LTR
- Habit tracker: day names should be translated

Commit: `feat(i18n): translate productivity tools + sidebar to Arabic + RTL support`

---

### Task 9: Security & Dev Tools

**Assignment:** Translate these 9 components:

| Slug |
|------|
| password-generator |
| jwt-decoder |
| hash-generator |
| regex-tester |
| cron-parser |
| password-strength |
| text-encryption |
| http-status |
| uuid-generator |

**Special note for jwt-decoder:** The JWT token input/output must stay LTR even in RTL mode — wrap in `dir="ltr"`.

Commit: `feat(i18n): translate security & dev tools to Arabic + RTL support`

---

### Task 10: Design Tools, SEO & Homepage

**Assignment:** Translate these 8 components:

| Slug |
|------|
| css-gradient |
| color-palette |
| image-resizer |
| contrast-checker |
| color-blindness |
| exif-viewer |
| emoji-picker |
| screen-recorder |

**Also update these non-tool files:**

**1. `src/components/HomePage.tsx` (or equivalent):**
- Find the homepage component (imported by `src/app/(home)/page.tsx`)
- Add `useTranslations("Home")` and translate hero text, subtitle, search placeholder

**2. `src/lib/metadata.ts`:**
Add Arabic bilingual keywords to `generateToolMetadata`:
```typescript
// After the existing English keywords array, add Arabic keywords:
"أداة مجانية",
"بدون إعلانات",
"بدون تسجيل",
"خصوصية تامة",
"يعمل في المتصفح",
// + Arabic equivalent of tool.name from the ar.json translations
```

Add `hreflang` to alternates in `generateToolMetadata`:
```typescript
alternates: {
  canonical: toolUrl,
  languages: {
    "x-default": toolUrl,
  },
},
```

Commit: `feat(i18n): translate design tools + homepage + bilingual SEO`

---

## Task 11: Verification Pass

Run after ALL Tasks 2–10 are complete.

### Step 1: Check for untranslated hardcoded strings

```bash
# Find English strings in JSX that were missed (common patterns)
grep -r 'className=' src/components --include="*.tsx" -l | head -5  # sanity check

# Search for common English patterns that should be translated
grep -rn '"Copy"' src/components --include="*.tsx"
grep -rn '"Download"' src/components --include="*.tsx"
grep -rn '"Reset"' src/components --include="*.tsx"
grep -rn '"Cancel"' src/components --include="*.tsx"
grep -rn '"Loading"' src/components --include="*.tsx"
grep -rn 'placeholder="' src/components --include="*.tsx"
```

For each match found: check if it's already wrapped in `t()`. If not, add to `Common` namespace and replace.

### Step 2: Build verification

```bash
bun run build
```

Expected: Zero TypeScript errors. Zero missing translation key warnings.

### Step 3: RTL layout check

Open the app in dev mode:
```bash
bun run dev
```

Using browser DevTools:
1. Set `localStorage.setItem('browsery-locale', 'ar')` in console
2. Reload the page
3. Verify: `<html dir="rtl" lang="ar">` is set
4. Check that the header layout mirrors correctly (logo on right, nav on left)
5. Check that the sidebar opens from the right in mobile
6. Spot-check 5 tools for correct RTL layout

### Step 4: Language toggle test

1. Click the language switcher → select العربية
2. Verify page switches to Arabic immediately (no reload needed)
3. Reload page — verify Arabic persists
4. Switch back to English — verify it switches back
5. Clear localStorage, reload — verify browser language detection works (if browser is set to Arabic, should default to Arabic)

### Step 5: Font verification

In Arabic mode, inspect any text element — `font-family` in DevTools should show IBM Plex Sans Arabic as the computed font.

### Step 6: Commit verification pass

```bash
git add -A
git commit -m "fix(i18n): verification pass — untranslated strings and RTL fixes"
```

---

## Task 12: Final Cleanup & Plan Completion

### Step 1: Run existing tests

```bash
bun run test
```

Tests may need minor updates if any test was checking for hardcoded English strings. Fix as needed.

### Step 2: Final build

```bash
bun run build
```

### Step 3: Save to Obsidian

Save a note to the Obsidian vault:
```bash
obsidian vault="Aghyad-Vault" append file="Memory/MEMORY" content="\n## i18n (Arabic Localization)\n- next-intl non-routing mode, messages/ at project root\n- language-store.ts: Zustand persist, key 'browsery-locale'\n- LanguageProvider wraps NextIntlClientProvider\n- FOUC prevention: Script beforeInteractive in layout.tsx\n- IBM Plex Sans Arabic: loaded in layout, activated via html[lang='ar'] CSS\n- Adding new language: add messages/<locale>.json + update Locale type + add LanguageSwitcher option"
```

### Step 4: Final commit

```bash
git add -A
git commit -m "feat(i18n): complete Arabic localization with RTL support"
```

---

## Adding Future Languages (Reference)

1. Create `messages/<locale>.json` (copy en.json structure, translate values)
2. In `src/store/language-store.ts`: change `type Locale = "en" | "ar"` to add new locale
3. In `src/providers/language-provider.tsx`: add to the `messages` object
4. In `src/components/language-switcher.tsx`: add to `LOCALES` array
5. Done — no routing changes, no infrastructure changes
