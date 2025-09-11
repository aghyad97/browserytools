# Browser Tools 🛠️

![BrowseryTools](https://github.com/aghyad97/browserytools/blob/main/public/og-image.png?raw=true)

A comprehensive collection of browser-based tools and utilities built with Next.js, TypeScript, and Tailwind CSS. This project provides a wide range of practical tools that work entirely in your browser without requiring any server-side processing.

## 🚀 Features

### 🖼️ Image Tools

- **Background Removal**: AI-powered background removal for images
- **Phone Mockups**: Place screenshots into iPhone/Android device frames
- **Image Compression**: Compress images to reduce file size while maintaining quality
- **Format Converter**: Convert images between different formats (JPG, PNG, WebP, GIF, BMP, TIFF, SVG)
- **Color Correction**: Adjust colors, brightness, contrast, saturation, and hue in images
- **Color Converter**: Convert between HEX, RGB, and HSL with live preview
- **SVG Tools**: Edit and manipulate SVG vector graphics _(Coming Soon)_

### 📁 File Tools

- **PDF Tools**: Merge, split, compress, and manipulate PDF files
- **Zip Tools**: Create, extract, and manage ZIP archives
- **CSV/Excel Viewer**: View and edit CSV and Excel files in your browser
- **File Converter**: Convert files between different formats including documents, images, audio, and video _(Coming Soon)_

### 🎵 Media Tools

- **Video Editor**: Trim, convert, and edit video files
- **Audio Editor**: Edit and process audio files
- **Mic & Camera Tester**: Check your camera preview and test microphone input levels

### 📝 Text & Language Tools

- **Text Case Converter**: Convert text between different cases (uppercase, lowercase, title case, camelCase, snake_case)
- **Text Counter**: Count words, characters, lines, and paragraphs in text
- **Code Formatter**: Format and beautify your code with proper indentation and syntax highlighting
- **Rich Editor**: Edit and preview rich text documents with formatting options
- **Lorem Ipsum Generator**: Generate placeholder text for designs and mockups
- **Typing Test**: Measure your typing speed (WPM) and accuracy
- **Text Diff Viewer**: Compare two texts and copy a simple patch

### 📊 Data Tools

- **JSON to CSV**: Convert JSON data to CSV format for spreadsheet applications
- **Base64 Tools**: Encode or decode Base64 strings and files
- **QR Code Generator**: Generate QR codes from text, URLs, contact information, and more
- **Barcode Generator**: Generate various barcode types including CODE128, EAN-13, UPC-A, CODE39
- **QR Code Scanner**: Scan QR codes using your camera or upload an image
- **Barcode Scanner**: Scan barcodes using your camera or upload an image

### 🧮 Math & Finance Tools

- **Invoice Generator**: Create professional invoices with customizable templates
- **Unit Converter**: Convert between different units of measurement
- **Calculator**: Advanced calculator with both basic and scientific modes
- **Time Zone Converter**: Convert times between different time zones
- **Age Calculator**: Calculate your exact age in years, months, and days
- **Number Base Converter**: Convert between binary, octal, decimal and hexadecimal

### ⚡ Productivity Tools

- **Todo List**: Organize your tasks and stay productive
- **Timer & Countdown**: Simple timer and countdown with fullscreen mode

### 🔐 Security & Development Tools

- **UUID Generator**: Generate Universally Unique Identifiers (UUIDs)
- **JWT Decoder**: Decode and validate JSON Web Tokens (JWTs)
- **Hash Generator**: Generate cryptographic hashes from text input
- **Password Generator**: Generate secure passwords with custom options
- **Unix Timestamp Converter**: Epoch seconds/milliseconds ↔ human date with timezone
- **Regex Tester**: Test JavaScript regular expressions with live highlighting and flags
- **Cron Parser**: Explain cron expressions and list next runs

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn + Radix UI + Custom components
- **State Management**: Zustand
- **Icons**: Lucide React + Phosphor Icons
- **Animations**: Framer Motion
- **Build Tool**: Turbopack (for development)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.0 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aghyad97/browserytools.git
cd browserytools
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

### 4. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page layout and content
│   ├── tools/             # Individual tool pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [tool-components] # Tool-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── providers/            # React context providers
└── store/                # Zustand state stores
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Submitting a Pull Request

1. **Fork the Repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/aghyad97/browserytools.git
   cd browserytools
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**

   - Write clean, readable code
   - Follow the existing code style
   - Add TypeScript types where needed
   - Test your changes thoroughly

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new tool for [description]"
   # or
   git commit -m "fix: resolve issue with [description]"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes
   - Reference any related issues

### Pull Request Guidelines

- **Title**: Use clear, descriptive titles
- **Description**: Explain what your PR does and why
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Note any breaking changes
- **Screenshots**: Include screenshots for UI changes

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement proper error handling
- Add comments for complex logic

### Adding New Tools

1. Create a new page in `src/app/tools/[tool-name]/page.tsx`
2. Create the tool component in `src/components/[ToolName].tsx`
3. Add the tool to the sidebar navigation
4. Update the tool store if needed
5. Add proper TypeScript types

## 🐛 Reporting Issues

Found a bug or have a feature request? Please open an issue with:

- **Clear description** of the problem or feature
- **Steps to reproduce** (for bugs)
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Browser and OS information**

## 💖 Supporting the Project

This project is maintained by passionate developers who believe in creating useful, free tools for the community. If you find Browser Tools helpful, consider supporting the project:

### 💰 Donation Options

- **GitHub Sponsors**: [Sponsor us on GitHub](https://github.com/sponsors/aghyad97)
- **Ziina**: [One-time donation via Ziina](https://pay.ziina.com/aghyad)

### How Donations Help

Your support helps us:

- 🚀 Maintain and improve existing tools
- 🆕 Develop new tools and features
- 🐛 Fix bugs and issues faster
- 📚 Create better documentation
- 🌐 Keep the project free and accessible

### Other Ways to Support

- ⭐ **Star the repository** on GitHub
- 🐦 **Share on social media** to help others discover the tools
- 🐛 **Report bugs** and suggest improvements
- 💻 **Contribute code** through pull requests
- 📖 **Improve documentation** and help others

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Built with amazing open-source tools and libraries
- Inspired by the developer community's need for practical browser tools

## 📞 Contact

- **GitHub Issues**: [Open an issue](https://github.com/aghyad97/browserytools/issues)
- **Twitter**: [@aghyadev](https://twitter.com/aghyadev)

---

Made with ❤️
