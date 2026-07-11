# BrowseryTools 🛠️

<p align="center">
  <a href="https://browserytools.com"><img src="https://img.shields.io/website?url=https%3A%2F%2Fbrowserytools.com&label=browserytools.com&style=flat-square" alt="Live site" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/aghyad97/browserytools?style=flat-square&color=blue" alt="License" /></a>
  <a href="https://github.com/aghyad97/browserytools/stargazers"><img src="https://img.shields.io/github/stars/aghyad97/browserytools?style=flat-square" alt="Stars" /></a>
  <a href="https://github.com/aghyad97/browserytools/network/members"><img src="https://img.shields.io/github/forks/aghyad97/browserytools?style=flat-square" alt="Forks" /></a>
  <a href="https://github.com/aghyad97/browserytools/issues"><img src="https://img.shields.io/github/issues/aghyad97/browserytools?style=flat-square" alt="Open issues" /></a>
  <a href="#-contributing"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome" /></a>
  <img src="https://img.shields.io/github/last-commit/aghyad97/browserytools?style=flat-square" alt="Last commit" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Built with Next.js 15" />
</p>

![BrowseryTools](https://github.com/aghyad97/browserytools/blob/main/public/og-image.png?raw=true)

A comprehensive collection of **136+ browser-based tools** built with Next.js, TypeScript, and Tailwind CSS. Every tool runs entirely in your browser — no uploads, no servers, no accounts required. Includes on-device AI tools (transcription, translation, summarization, image upscaling, and more) powered by Transformers.js.

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Supported Languages](#-supported-languages)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [Activity](#-activity)
- [Reporting Issues](#-reporting-issues)
- [Supporting the Project](#-supporting-the-project)
- [Star History](#-star-history)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

### 🖼️ Image Tools

- **Background Removal**: Remove background from your images instantly using AI.
- **Phone Mockups**: Place screenshots into iPhone/Android device frames.
- **Image Compression**: Compress images to reduce file size while maintaining quality.
- **Format Converter**: Convert images between different formats like JPG, PNG, WebP, GIF, BMP, TIFF, and SVG.
- **Color Correction**: Adjust colors, brightness, contrast, saturation, and hue in images.
- **SVG Tools**: Edit and manipulate SVG vector graphics.
- **SVG to PNG**: Convert SVG vector files to PNG images.
- **Photo Censor**: Redact sensitive parts of an image with blur, pixelate, or black-box censoring.
- **Screenshot Beautifier**: Turn plain screenshots into beautiful images.
- **Meme Generator**: Make a meme online for free.
- **Photo Collage**: Combine multiple photos into a collage with grid, strip, and mosaic layouts.
- **EXIF Remover**: Strip EXIF metadata - GPS location, camera model, timestamps - from photos before sharing.
- **ASCII Art Generator**: Convert any image into ASCII art in your browser.
- **Image Upscaler**: Upscale and enhance images 2x with an on-device AI super-resolution model.
- **Image Captioner**: Generate a descriptive caption and ready-to-use alt text for any image with an on-device AI model.
- **Depth Map Generator**: Generate a depth map from any image with an on-device AI model.
- **Object Cutout**: Cut out any object from an image with one click using the Segment Anything (SAM) AI model in your browser.
- **Image Resizer**: Resize images to exact dimensions or by percentage.
- **EXIF Viewer**: View EXIF metadata from photos: camera model, lens, aperture, shutter speed, ISO, GPS coordinates, and more.
- **Favicon Generator**: Create a complete favicon set from an image or a letter/emoji.

### 🤖 AI Tools

- **Token Counter**: Count tokens for any text across popular AI models: GPT-4o, Claude, Llama 3, and more.
- **Context Window Calculator**: Calculate how much of a model's context window your text uses.
- **AI Cost Calculator**: Estimate your AI API costs by entering token counts and selecting a model.
- **Model Comparison**: Compare AI language models side by side: context window size, pricing, capabilities, speed, and provider.
- **System Prompt Builder**: Build structured system prompts for AI models using a guided form.
- **Prompt Library**: Save, organize, and search your AI prompts locally in the browser.
- **CLAUDE.md Generator**: Generate CLAUDE.md files for your projects using a structured form.
- **AI Rules Generator**: Generate .cursorrules, .windsurfrules, and GitHub Copilot instruction files for your IDE.
- **JSON Schema Builder**: Build JSON schemas for LLM tool calls and function calling using a visual form.
- **MCP Config Generator**: Generate Model Context Protocol (MCP) configuration files for Claude Desktop and other MCP clients.
- **Prompt Formatter**: Convert prompts between different AI formats: ChatML, Llama 3 Instruct, Claude XML tags, and plain text.
- **Skill / Agent Builder**: Scaffold AI agent skill files with a guided form.
- **AI Instruction Diff**: Compare two system prompts, CLAUDE.md files, or AI instruction sets side by side.
- **Text Similarity**: Measure semantic similarity between texts using TF-IDF cosine similarity, all in the browser.
- **Sentiment Analyzer**: Detect positive or negative sentiment in text with an on-device AI model.
- **Audio/Video Transcriber**: Transcribe audio or video to text and generate SRT/VTT subtitles with on-device Whisper AI.
- **Text Summarizer**: Summarize long text into a short summary with an on-device AI model.
- **Translator**: Translate text between 15 languages fully on-device with an AI model.
- **PII Detector & Redactor**: Detect and redact personal info - names, emails, phone numbers, locations, credit cards, IPs - with an on-device AI model.
- **Zero-Shot Text Classifier**: Classify any text into your own custom labels with an on-device AI model.

### 📁 File Tools

- **PDF Tools**: Merge PDFs, split or extract pages, and turn images into a PDF.
- **Zip Tools**: Create ZIP archives from your files and extract existing ones.
- **CSV/Excel Viewer**: View CSV and Excel files in your browser: sort, search, chart a column, and export to CSV.
- **Data Format Converter**: Convert data between CSV, TSV, JSON, XML, and YAML.

### 🎵 Media Tools

- **Video Editor**: Trim video clips and turn them into animated GIFs.
- **Audio Editor**: Play audio files with adjustable volume and speed, view the waveform, and download your file.
- **Mic & Camera Tester**: Check your camera preview and test microphone input levels with a live meter.
- **Compress Video**: Compress videos in your browser using ffmpeg.wasm.
- **Screen Recorder**: Record your screen, window, or tab directly in the browser using the Screen Capture API.
- **GIF Maker**: Turn a series of images into an animated GIF. Reorder frames, set speed, loop, and resize.

### 📝 Text & Language Tools

- **Text Case Converter**: Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more.
- **Text Counter**: Count words, characters, lines, and paragraphs in text.
- **Rich Editor**: Edit and preview rich text documents with formatting options.
- **Lorem Ipsum Generator**: Generate placeholder text for designs and mockups.
- **Text Diff Viewer**: Compare two texts and copy a simple patch.
- **Markdown Editor**: Write Markdown with a live split-pane preview.
- **Notepad**: A distraction-free scratch pad that saves your notes automatically to the browser.
- **Text Sorter**: Sort lines of text alphabetically, by length, or numerically.
- **Word Frequency Analyzer**: Analyze word frequency in any text.
- **Markdown to HTML**: Convert Markdown to clean HTML instantly.
- **Text Repeater**: Repeat any text or character N times with a custom separator.
- **Markdown Table Generator**: Build tables in a visual grid editor and export as valid Markdown table syntax.
- **Image to Text (OCR)**: Extract text from images for free with on-device OCR.
- **Text to Speech**: Read text aloud in your browser for free.
- **Live Dictation (mic)**: Convert speech to text online for free.

### 📊 Data Tools

- **JSON to CSV**: Convert JSON data to CSV format for spreadsheet applications.
- **Base64 Tools**: Encode or decode Base64 strings and files.
- **QR Code Generator**: Generate QR codes from text, URLs, contact information, and more.
- **Barcode Generator**: Generate various barcode types including CODE128, EAN-13, UPC-A, CODE39, and more.
- **QR Code Scanner**: Scan QR codes using your camera or upload an image.
- **Barcode Scanner**: Scan barcodes using your camera or upload an image.
- **Charts**: Create beautiful, customizable charts with full control over every detail.
- **YAML ↔ JSON**: Convert between YAML and JSON formats instantly.
- **URL Encoder/Decoder**: Encode or decode URLs and query strings.
- **Fake Data Generator**: Generate realistic fake data for testing and prototyping.
- **Text to Binary**: Convert text to binary, hexadecimal, octal, and decimal representations.
- **JSON → TypeScript**: Paste JSON and instantly get TypeScript interfaces.
- **Mermaid Diagram Viewer**: Write Mermaid markdown and see your diagram rendered live.
- **Morse Code Converter**: Convert text to Morse code and decode Morse code back to text.

### 🧮 Math & Finance Tools

- **Unit Converter**: Convert between different units of measurement including length, weight, temperature, area, volume, and more.
- **Time Zone Converter**: Convert times between different time zones.
- **Calculator**: Advanced calculator with basic, scientific, and graphing modes.
- **Age Calculator**: Calculate your exact age in years, months, and days.
- **Number Base Converter**: Convert between binary, octal, decimal and hexadecimal with live validation.
- **Currency Converter**: Convert between all major currencies in the browser using cached daily rates and animated number display.
- **Loan Calculator**: Calculate monthly payments, total interest, and amortization schedules for mortgages and loans.
- **Percentage Calculator**: Calculate percentages, percentage change, percentage of a number, and reverse percentages.
- **Aspect Ratio Calculator**: Calculate and lock aspect ratios for images and videos.
- **BMI Calculator**: Calculate Body Mass Index (BMI) in metric or imperial units.
- **Tip Calculator**: Calculate tips and split bills between multiple people.
- **Roman Numeral Converter**: Convert numbers to Roman numerals and Roman numerals back to numbers.

### ⚡ Productivity Tools

- **Todo List**: Organize your tasks and stay productive.
- **Timer & Countdown**: Simple timer and countdown with fullscreen mode and completion sound.
- **Pomodoro Timer**: Boost focus with the Pomodoro Technique.
- **World Clock**: View current time in multiple cities and time zones simultaneously.
- **Stopwatch**: Precise stopwatch with lap times and split tracking.
- **Habit Tracker**: Track daily habits and build streaks.
- **Keep Awake**: Prevent your laptop or phone from sleeping.
- **Random Picker**: Generate random numbers, roll dice, flip a coin, or pick a random winner from a list.
- **Mind Map Maker**: Create interactive mind maps in your browser.
- **Signature Maker**: Create an online signature: draw it freehand with adjustable pen color and thickness, or type your name in a handwriting font.

### 🧑‍💻 Developer Tools

- **UUID Generator**: Generate Universally Unique Identifiers (UUIDs) in different versions and formats.
- **Unix Timestamp Converter**: Epoch seconds/milliseconds ↔ human date with timezone.
- **Regex Tester**: Test JavaScript regular expressions with live highlighting and flags.
- **Cron Parser**: Explain cron expressions and list next runs.
- **HTTP Status Codes**: Quick reference for all HTTP status codes with descriptions, use cases, and examples.
- **CSS Minifier**: Minify or beautify CSS code.
- **SQL Formatter**: Format and beautify SQL queries with proper indentation and keyword casing.
- **Chmod Calculator**: Calculate Unix file permissions visually.
- **Meta Tags Generator**: Generate HTML meta tags, Open Graph tags, and Twitter Card tags.
- **cURL Converter**: Convert a curl command into ready-to-run code for JavaScript fetch, Node.js, Python requests, Go, and PHP.
- **Code Formatter**: Format and beautify your code with proper indentation and syntax highlighting.
- **HTML Formatter**: Format, prettify, or minify HTML code.
- **JSON Formatter**: Format, validate, and minify JSON.

### 🔐 Security Tools

- **JWT Decoder**: Decode and validate JSON Web Tokens (JWTs).
- **Password Generator**: Generate secure passwords with custom options including length, character types, and special requirements.
- **Hash Generator**: Generate cryptographic hashes from text input.
- **Password Strength**: Analyze the strength of any password in real time.
- **Text Encryption**: Encrypt and decrypt text using AES-256-GCM via the Web Crypto API.

### 🎨 Design Tools

- **CSS Gradient Generator**: Create beautiful CSS gradients visually.
- **Color Palette Generator**: Generate harmonious color palettes from a base color.
- **Color Converter**: Convert between HEX, RGB, and HSL with live preview.
- **Color Contrast Checker**: Check color contrast ratios for WCAG accessibility compliance.
- **Emoji Picker**: Browse and search all Unicode emojis by name or category.
- **CSS Box Shadow Generator**: Build CSS box shadows visually with sliders for offset, blur, spread, color, and opacity.
- **CSS clip-path Generator**: Visually create CSS clip-path shapes.
- **Cubic-Bezier Easing Editor**: Design CSS easing curves with two draggable control handles, easing presets, numeric inputs, and a live animation preview.
- **Glassmorphism Generator**: Create frosted-glass (glassmorphism) CSS visually.
- **SVG Blob Generator**: Generate random organic blob shapes and smooth SVG wave dividers.
- **Code Screenshot**: Turn code into beautiful, shareable images.
- **OG Image Generator**: Generate 1200x630 Open Graph and social-share images on a canvas.
- **Image Color Picker**: Pick any color from an image.
- **Color Blindness Simulator**: Simulate how images appear to people with different types of color blindness: deuteranopia, protanopia, tritanopia, and achromatopsia.

### 🎮 Tests & Games

- **Typing Test**: Measure your typing speed (WPM) and accuracy with optional mechanical keyboard click sounds.

### 🎓 School & Learning

- **Periodic Table**: Interactive periodic table of all 118 elements in the standard layout.

### 💼 Business

- **Invoice Generator**: Create professional invoices with customizable templates, automatic tax calculations, and PDF export.
- **Expense Tracker**: Track your expenses with detailed categorization, budget management, and comprehensive reports.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn + Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library

## 🌍 Supported Languages

BrowseryTools is fully localized. The entire UI — homepage, all tools, and navigation — is available in:

| Language | Code | Direction |
| --- | --- | --- |
| English | `en` | LTR |
| العربية (Arabic) | `ar` | RTL |
| Español (Spanish) | `es` | LTR |
| Português do Brasil (Portuguese) | `pt-BR` | LTR |
| Français (French) | `fr` | LTR |
| Deutsch (German) | `de` | LTR |
| Русский (Russian) | `ru` | LTR |
| Bahasa Indonesia (Indonesian) | `id` | LTR |
| 简体中文 (Simplified Chinese) | `zh-CN` | LTR |

Language is detected from the browser on first visit and can be changed anytime via the in-app language switcher (preference is remembered).

**Adding a new language** is intentionally simple — all locale wiring derives from one registry:

1. Add an entry to `LOCALES` in [`src/lib/locales.ts`](src/lib/locales.ts).
2. Add a `messages/<code>.json` file (a full translation of `messages/en.json`).
3. Register its import in the messages map in [`src/providers/language-provider.tsx`](src/providers/language-provider.tsx).

The switcher, `<html lang/dir>`, hreflang tags, and OpenGraph locales all update automatically.

## 📋 Prerequisites

- **Node.js** 20.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aghyad97/browserytools.git
cd browserytools
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Run the Development Server

```bash
bun dev
```

Navigate to [http://localhost:3000](http://localhost:3000).

## 🧪 Running Tests

```bash
bun run test          # Run all tests
bun run test:watch    # Watch mode
bun run test:coverage # Coverage report
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page
│   ├── blog/              # Blog listing and posts
│   └── tools/             # Individual tool pages
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn)
│   └── [ToolName].tsx    # Tool-specific components
├── lib/                  # Utility functions
│   ├── tools-config.ts   # Tool registry
│   ├── blog-data.ts      # Blog post metadata
│   └── search-utils.ts   # Fuzzy search
└── store/                # Zustand stores
```

## 🤝 Contributing

### Adding a New Tool

1. Add the tool entry to `src/lib/tools-config.ts`
2. Create the page at `src/app/tools/[tool-name]/page.tsx`
3. Create the component at `src/components/[ToolName].tsx`
4. The tool will automatically appear in the homepage grid and sitemap

### Submitting a Pull Request

1. Fork the repository and create a feature branch
2. Make your changes with TypeScript types
3. Run `bun run test` to ensure nothing is broken
4. Submit a PR with a clear description

## 👥 Contributors

Thanks to everyone who has contributed to BrowseryTools!

<a href="https://github.com/aghyad97/browserytools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aghyad97/browserytools" alt="Contributors" />
</a>

## 📈 Activity

> **One-time setup:** Generate a Repobeats embed at [repobeats.axiom.co](https://repobeats.axiom.co) for `aghyad97/browserytools`, then replace the placeholder URL below with the generated one and remove this note.

<!-- Replace REPLACE_WITH_YOUR_HASH with the hash from your Repobeats embed URL, then uncomment:
![Repobeats analytics](https://repobeats.axiom.co/api/embed/REPLACE_WITH_YOUR_HASH.svg "Repobeats analytics image")
-->

## 🐛 Reporting Issues

Open an issue with a clear description, steps to reproduce, and browser/OS info.

## 💖 Supporting the Project

- ⭐ **Star the repository** on GitHub
- **GitHub Sponsors**: [Sponsor us](https://github.com/sponsors/aghyad97)
- **Ziina**: [One-time donation](https://pay.ziina.com/aghyad)

## ⭐ Star History

<a href="https://www.star-history.com/#aghyad97/browserytools&Date">
  <img src="https://api.star-history.com/svg?repos=aghyad97/browserytools&type=Date" alt="Star History Chart" />
</a>

## 📄 License

Copyright (C) 2026 Aghyad.

Licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — see [LICENSE](LICENSE) for the full text.

In short: BrowseryTools is free and open source. You may use, study, modify, and redistribute it. **If you run a modified version as a network service (e.g. a hosted website or SaaS), you must make your modified source code available** to its users under the same license. This keeps the project and any derivatives open.

## 📞 Contact

- **GitHub Issues**: [Open an issue](https://github.com/aghyad97/browserytools/issues)
- **Twitter**: [@aghyadev](https://twitter.com/aghyadev)

---

Made with ❤️
