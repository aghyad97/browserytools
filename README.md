# BrowseryTools 🛠️

![BrowseryTools](https://github.com/aghyad97/browserytools/blob/main/public/og-image.png?raw=true)

A comprehensive collection of **80+ browser-based tools** built with Next.js, TypeScript, and Tailwind CSS. Every tool runs entirely in your browser — no uploads, no servers, no accounts required.

## 🚀 Features

### 🖼️ Image Tools

- **Background Removal**: AI-powered background removal using ONNX Runtime Web
- **Phone Mockups**: Place screenshots into iPhone/Android device frames
- **Image Compression**: Compress images while maintaining quality
- **Format Converter**: Convert between JPG, PNG, WebP, GIF, BMP, TIFF, SVG
- **Color Correction**: Adjust brightness, contrast, saturation, hue, and more
- **Color Converter**: Convert between HEX, RGB, and HSL with live preview
- **SVG Tools**: Edit and manipulate SVG vector graphics

### 📁 File Tools

- **PDF Tools**: Merge, split, compress, and manipulate PDF files
- **Zip Tools**: Create, extract, and manage ZIP archives
- **CSV/Excel Viewer**: View and edit CSV and Excel files
- **File Converter**: Convert between CSV, TSV, JSON, XML, and YAML

### 🎵 Media Tools

- **Video Editor**: Trim, convert, and edit video files
- **Audio Editor**: Edit and process audio files
- **Mic & Camera Tester**: Check your camera preview and test microphone levels

### 📝 Text & Language Tools

- **Text Case Converter**: Convert between uppercase, lowercase, camelCase, snake_case, kebab-case, and more
- **Text Counter**: Count words, characters, lines, and paragraphs
- **Code Formatter**: Format and beautify code with syntax highlighting
- **Rich Editor**: WYSIWYG rich text editing
- **Lorem Ipsum Generator**: Generate placeholder text
- **Typing Test**: Measure your WPM and accuracy
- **Text Diff Viewer**: Compare two texts and highlight changes
- **Markdown Editor**: Live split-pane Markdown preview
- **HTML Formatter**: Prettify or minify HTML code
- **Notepad**: Auto-saving scratchpad stored locally
- **Text Sorter**: Sort, deduplicate, shuffle, and filter lines of text
- **Morse Code Converter**: Encode and decode Morse code
- **Word Frequency Analyzer**: Analyze word frequency with CSV export
- **Markdown to HTML**: Convert Markdown to clean HTML output
- **Text Repeater**: Repeat any text N times with a custom separator

### 📊 Data Tools

- **JSON Formatter**: Format, validate, minify, and sort JSON
- **YAML ↔ JSON**: Convert between YAML and JSON formats
- **URL Encoder/Decoder**: Percent-encode and decode URLs
- **Text to Binary**: Convert text to binary, hex, octal, and decimal
- **JSON to CSV**: Convert JSON arrays to CSV format
- **Base64 Tools**: Encode or decode Base64 strings and files
- **QR Code Generator**: Generate QR codes for URLs, text, WiFi, and vCards
- **Barcode Generator**: Generate CODE128, EAN-13, UPC-A, CODE39 barcodes
- **QR Code Scanner**: Scan QR codes via camera or image upload
- **Barcode Scanner**: Scan barcodes via camera or image upload
- **Charts**: Create bar, line, pie, and other chart types
- **Fake Data Generator**: Generate realistic JSON/CSV test data (names, emails, addresses, and more)

### 🧮 Math & Finance Tools

- **Invoice Generator**: Create professional invoices
- **Unit Converter**: Convert between measurement units
- **Calculator**: Basic and scientific calculator modes
- **Time Zone Converter**: Convert times between time zones
- **Age Calculator**: Calculate exact age in years, months, and days
- **Number Base Converter**: Convert between binary, octal, decimal, and hex
- **Expense Tracker**: Track expenses with budgets and category reports
- **Currency Converter**: Convert between major currencies with cached daily rates
- **Loan Calculator**: Monthly payment and amortization schedule calculator
- **Percentage Calculator**: Five calculation modes for percentage math
- **Aspect Ratio Calculator**: Calculate and scale aspect ratios
- **BMI Calculator**: Body Mass Index in metric or imperial with healthy range
- **Tip Calculator**: Bill splitting and tip calculation per person

### ⚡ Productivity Tools

- **Todo List**: Organize tasks with filters and completion tracking
- **Timer & Countdown**: Timer with fullscreen mode
- **Pomodoro Timer**: Focus sessions with break tracking and daily stats
- **World Clock**: Real-time clocks for multiple cities and time zones
- **Stopwatch**: Precision stopwatch with lap tracking and CSV export
- **Habit Tracker**: Daily habit tracking with streaks, stored locally

### 🔐 Security & Development Tools

- **UUID Generator**: Generate UUID v4 identifiers
- **JWT Decoder**: Decode and inspect JSON Web Tokens
- **Hash Generator**: Generate MD5, SHA-256, SHA-512 hashes
- **Password Generator**: Generate secure passwords with custom rules
- **Password Strength**: Analyze password entropy and crack time
- **Text Encryption**: AES-256-GCM encryption via the Web Crypto API
- **HTTP Status Codes**: Reference for all 1xx–5xx status codes
- **Unix Timestamp Converter**: Epoch ↔ human-readable date
- **Regex Tester**: Test regular expressions with live match highlighting
- **Cron Parser**: Parse cron expressions and show next scheduled runs
- **CSS Minifier**: Minify or beautify CSS code
- **SQL Formatter**: Format and beautify SQL queries

### 🎨 Design Tools

- **CSS Gradient Generator**: Visual linear, radial, and conic gradient builder
- **Color Palette Generator**: Generate harmonious palettes from a base color
- **Image Resizer**: Resize to exact dimensions, percentage, or preset sizes
- **Screen Recorder**: Record your screen, window, or tab — no extensions needed
- **Color Contrast Checker**: WCAG AA/AAA accessibility contrast ratio checker
- **Color Blindness Simulator**: Preview images as seen with deuteranopia, protanopia, tritanopia, and achromatopsia
- **EXIF Viewer**: View camera metadata, GPS coordinates, and shooting settings
- **Emoji Picker**: Browse, search, and copy Unicode emojis

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn + Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library

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

## 🐛 Reporting Issues

Open an issue with a clear description, steps to reproduce, and browser/OS info.

## 💖 Supporting the Project

- ⭐ **Star the repository** on GitHub
- **GitHub Sponsors**: [Sponsor us](https://github.com/sponsors/aghyad97)
- **Ziina**: [One-time donation](https://pay.ziina.com/aghyad)

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 📞 Contact

- **GitHub Issues**: [Open an issue](https://github.com/aghyad97/browserytools/issues)
- **Twitter**: [@aghyadev](https://twitter.com/aghyadev)

---

Made with ❤️
