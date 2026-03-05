# AI Tools Category Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new "AI Tools" category with 14 browser-only tools for AI practitioners (devs + power users).

**Architecture:** Each tool follows the existing BrowseryTools pattern — a `page.tsx` wrapper + a `"use client"` component + entries in `tools-config.ts` + translations in `messages/en.json` and `messages/ar.json`. No servers, no API keys, no external calls. All computation happens in the browser.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind, Radix UI / shadcn, `next-intl` for i18n, Zustand (only for tools needing persistence), `gpt-tokenizer` npm package for token counting.

---

## Rules (apply to EVERY tool)

1. **RTL support**: Every component must handle RTL. Use `dir="auto"` on text inputs and `text-right` for Arabic. BrowseryTools uses `next-intl` — locale is provided by the language store. Wrap Arabic strings in RTL-aware containers where needed.
2. **Translations**: Every user-facing string MUST use `useTranslations("Tools.<ComponentName>")`. Never hardcode English text in components.
3. **SEO**: The `page.tsx` always exports `export const metadata = generateToolMetadata("/tools/<slug>");`. This is automatic once the tool exists in `tools-config.ts`.
4. **Pattern**: `page.tsx` is a 4-line server component. All logic is in `src/components/<Name>.tsx` which starts with `"use client"`.
5. **Date**: Use `creationDate: "2026-03-05"` for all new tools.

---

## Pattern Reference

**`src/app/tools/<slug>/page.tsx`:**
```tsx
import ComponentName from "@/components/ComponentName";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/<slug>");

export default function Page() {
  return <ComponentName />;
}
```

**`src/components/ComponentName.tsx`:**
```tsx
"use client";

import { useTranslations } from "next-intl";
// ... other imports

export default function ComponentName() {
  const t = useTranslations("Tools.ComponentName");
  const tCommon = useTranslations("Common");

  // All logic here
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* UI */}
    </div>
  );
}
```

---

## Task 1: Infrastructure (MUST BE DONE FIRST)

**Files:**
- Modify: `src/lib/tools-config.ts` — add AI Tools category
- Create: `src/lib/ai-models.ts` — static model data
- Modify: `messages/en.json` — add all 14 tool translation keys
- Modify: `messages/ar.json` — add all 14 tool translation keys in Arabic

### Step 1: Add AI Tools category to `src/lib/tools-config.ts`

Add this import at the top of the file with the other lucide icons:
```ts
import { BrainIcon } from "lucide-react";
```

Add this category BEFORE the closing `];` of the `tools` array (order: 10):
```ts
  {
    category: "AI Tools",
    id: "aiTools",
    order: 10,
    items: [
      {
        name: "Token Counter",
        href: "/tools/token-counter",
        icon: BrainIcon,
        available: true,
        order: 1,
        creationDate: "2026-03-05",
        description:
          "Count tokens for any text across popular AI models: GPT-4o, Claude, Llama 3, and more. Instantly see token usage before sending to an API. No API key needed.",
      },
      {
        name: "Context Window Calculator",
        href: "/tools/context-window",
        icon: BrainIcon,
        available: true,
        order: 2,
        creationDate: "2026-03-05",
        description:
          "Calculate how much of a model's context window your text uses. See tokens used, percentage filled, tokens remaining, and estimated API cost for major models.",
      },
      {
        name: "AI Cost Calculator",
        href: "/tools/ai-cost-calculator",
        icon: BrainIcon,
        available: true,
        order: 3,
        creationDate: "2026-03-05",
        description:
          "Estimate your AI API costs by entering token counts and selecting a model. Supports GPT-4o, Claude 3.5, Gemini, Llama, and more with up-to-date pricing.",
      },
      {
        name: "Model Comparison",
        href: "/tools/model-comparison",
        icon: BrainIcon,
        available: true,
        order: 4,
        creationDate: "2026-03-05",
        description:
          "Compare AI language models side by side: context window size, pricing, capabilities, speed, and provider. Filter and sort to find the best model for your use case.",
      },
      {
        name: "System Prompt Builder",
        href: "/tools/system-prompt-builder",
        icon: BrainIcon,
        available: true,
        order: 5,
        creationDate: "2026-03-05",
        description:
          "Build structured system prompts for AI models using a guided form. Set role, tone, constraints, output format, and examples. Export as plain text or Claude XML tags.",
      },
      {
        name: "Prompt Library",
        href: "/tools/prompt-library",
        icon: BrainIcon,
        available: true,
        order: 6,
        creationDate: "2026-03-05",
        description:
          "Save, organize, and search your AI prompts locally in the browser. Tag prompts by category, copy with one click, and export or import your entire library as JSON.",
      },
      {
        name: "CLAUDE.md Generator",
        href: "/tools/claude-md-generator",
        icon: BrainIcon,
        available: true,
        order: 7,
        creationDate: "2026-03-05",
        description:
          "Generate CLAUDE.md files for your projects using a structured form. Define tech stack, conventions, commands, do/don't rules, and coding standards. Copy or download.",
      },
      {
        name: "AI Rules Generator",
        href: "/tools/ai-rules-generator",
        icon: BrainIcon,
        available: true,
        order: 8,
        creationDate: "2026-03-05",
        description:
          "Generate .cursorrules, .windsurfrules, and GitHub Copilot instruction files for your IDE. Fill in your stack and preferences, get a ready-to-use AI rules file.",
      },
      {
        name: "JSON Schema Builder",
        href: "/tools/json-schema-builder",
        icon: BrainIcon,
        available: true,
        order: 9,
        creationDate: "2026-03-05",
        description:
          "Build JSON schemas for LLM tool calls and function calling using a visual form. Outputs OpenAI and Anthropic tool format. Perfect for structured AI output definitions.",
      },
      {
        name: "MCP Config Generator",
        href: "/tools/mcp-config",
        icon: BrainIcon,
        available: true,
        order: 10,
        creationDate: "2026-03-05",
        description:
          "Generate Model Context Protocol (MCP) configuration files for Claude Desktop and other MCP clients. Add servers, configure transports, and export valid JSON config.",
      },
      {
        name: "Prompt Formatter",
        href: "/tools/prompt-formatter",
        icon: BrainIcon,
        available: true,
        order: 11,
        creationDate: "2026-03-05",
        description:
          "Convert prompts between different AI formats: ChatML, Llama 3 Instruct, Claude XML tags, and plain text. Preview the formatted output instantly.",
      },
      {
        name: "Skill / Agent Builder",
        href: "/tools/skill-builder",
        icon: BrainIcon,
        available: true,
        order: 12,
        creationDate: "2026-03-05",
        description:
          "Scaffold AI agent skill files with a guided form. Set name, description, trigger phrases, and instructions. Outputs a ready-to-use YAML/Markdown skill file.",
      },
      {
        name: "AI Instruction Diff",
        href: "/tools/ai-instruction-diff",
        icon: BrainIcon,
        available: true,
        order: 13,
        creationDate: "2026-03-05",
        description:
          "Compare two system prompts, CLAUDE.md files, or AI instruction sets side by side. Highlights additions, deletions, and changes to track prompt evolution.",
      },
      {
        name: "Text Similarity",
        href: "/tools/text-similarity",
        icon: BrainIcon,
        available: true,
        order: 14,
        creationDate: "2026-03-05",
        description:
          "Measure semantic similarity between texts using TF-IDF cosine similarity, all in the browser. Useful for comparing prompts, outputs, or any text pairs.",
      },
    ],
  },
```

### Step 2: Create `src/lib/ai-models.ts`

```ts
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number; // tokens
  inputPricePer1M: number; // USD per 1M tokens
  outputPricePer1M: number; // USD per 1M tokens
  tier: "flagship" | "balanced" | "fast" | "open";
  multimodal: boolean;
  notes?: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 2.5,
    outputPricePer1M: 10.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "o1",
    name: "o1",
    provider: "OpenAI",
    contextWindow: 200000,
    inputPricePer1M: 15.0,
    outputPricePer1M: 60.0,
    tier: "flagship",
    multimodal: false,
    notes: "Reasoning model",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    contextWindow: 200000,
    inputPricePer1M: 1.1,
    outputPricePer1M: 4.4,
    tier: "fast",
    multimodal: false,
    notes: "Fast reasoning model",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 15.0,
    outputPricePer1M: 75.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
    tier: "balanced",
    multimodal: true,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 0.8,
    outputPricePer1M: 4.0,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputPricePer1M: 0.1,
    outputPricePer1M: 0.4,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "gemini-2-0-pro",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta (via Groq)",
    contextWindow: 128000,
    inputPricePer1M: 0.59,
    outputPricePer1M: 0.79,
    tier: "open",
    multimodal: false,
  },
  {
    id: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta (via Together)",
    contextWindow: 128000,
    inputPricePer1M: 3.5,
    outputPricePer1M: 3.5,
    tier: "open",
    multimodal: false,
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    contextWindow: 128000,
    inputPricePer1M: 2.0,
    outputPricePer1M: 6.0,
    tier: "balanced",
    multimodal: false,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextWindow: 64000,
    inputPricePer1M: 0.27,
    outputPricePer1M: 1.1,
    tier: "balanced",
    multimodal: false,
  },
];

export const PROVIDERS = [...new Set(AI_MODELS.map((m) => m.provider))];
export const TIERS = ["flagship", "balanced", "fast", "open"] as const;
```

### Step 3: Add translations to `messages/en.json`

Inside the `"Tools"` object, add the following keys (anywhere, e.g. at the end of the Tools object):

```json
"TokenCounter": {
  "title": "Token Counter",
  "description": "Count tokens for your text across popular AI models",
  "inputLabel": "Input Text",
  "inputPlaceholder": "Paste your text here to count tokens...",
  "modelLabel": "Model",
  "loadSample": "Load Sample",
  "clearAll": "Clear All",
  "totalTokens": "Total Tokens",
  "characters": "Characters",
  "words": "Words",
  "estimatedCost": "Est. Cost",
  "inputCost": "Input Cost",
  "outputCost": "Output Cost",
  "assumingOutputLabel": "Assuming same size output",
  "noText": "Enter text to count tokens",
  "copiedToClipboard": "Token count copied to clipboard"
},
"ContextWindow": {
  "title": "Context Window Calculator",
  "description": "See how much of a model's context window your text fills",
  "inputLabel": "Input Text",
  "inputPlaceholder": "Paste your prompt or conversation here...",
  "modelLabel": "Select Model",
  "tokenCount": "Token Count",
  "contextUsed": "Context Used",
  "tokensRemaining": "Tokens Remaining",
  "contextWindow": "Context Window",
  "percentFilled": "% Filled",
  "loadSample": "Load Sample",
  "clearAll": "Clear All",
  "dangerZone": "Warning: Over 80% full",
  "criticalZone": "Critical: Over 95% full"
},
"AICostCalculator": {
  "title": "AI Cost Calculator",
  "description": "Estimate your AI API costs before you build",
  "modelLabel": "Model",
  "inputTokensLabel": "Input Tokens",
  "outputTokensLabel": "Output Tokens",
  "requestsLabel": "Number of Requests",
  "inputCost": "Input Cost",
  "outputCost": "Output Cost",
  "totalCost": "Total Cost",
  "perRequest": "Per Request",
  "totalForRequests": "Total for all requests",
  "inputPrice": "Input Price",
  "outputPrice": "Output Price",
  "per1MTokens": "per 1M tokens",
  "calculate": "Calculate",
  "resetAll": "Reset All",
  "placeholder": "0"
},
"ModelComparison": {
  "title": "Model Comparison",
  "description": "Compare AI language models side by side",
  "searchPlaceholder": "Search models...",
  "filterProvider": "Provider",
  "filterTier": "Tier",
  "allProviders": "All Providers",
  "allTiers": "All Tiers",
  "columnModel": "Model",
  "columnProvider": "Provider",
  "columnContext": "Context Window",
  "columnInputPrice": "Input (1M tokens)",
  "columnOutputPrice": "Output (1M tokens)",
  "columnTier": "Tier",
  "columnMultimodal": "Multimodal",
  "yes": "Yes",
  "no": "No",
  "tokens": "tokens",
  "flagship": "Flagship",
  "balanced": "Balanced",
  "fast": "Fast",
  "open": "Open Source"
},
"SystemPromptBuilder": {
  "title": "System Prompt Builder",
  "description": "Build structured system prompts for AI models",
  "roleLabel": "Role / Persona",
  "rolePlaceholder": "e.g. You are a senior software engineer specializing in TypeScript...",
  "toneLabel": "Tone & Style",
  "tonePlaceholder": "e.g. Concise, direct, no filler words, use code examples when helpful",
  "constraintsLabel": "Constraints / Rules",
  "constraintsPlaceholder": "e.g. Never write untested code. Always explain your reasoning...",
  "outputFormatLabel": "Output Format",
  "outputFormatPlaceholder": "e.g. Respond in markdown. Use bullet points for lists.",
  "examplesLabel": "Examples (optional)",
  "examplesPlaceholder": "e.g. User: How do I sort? Assistant: Use Array.sort()...",
  "exportFormat": "Export Format",
  "formatPlain": "Plain Text",
  "formatXml": "Claude XML Tags",
  "formatJson": "JSON (ChatML)",
  "preview": "Preview",
  "copyPrompt": "Copy Prompt",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "emptyPreview": "Fill in the fields above to preview your system prompt"
},
"PromptLibrary": {
  "title": "Prompt Library",
  "description": "Save and organize your AI prompts locally",
  "addPrompt": "Add Prompt",
  "searchPlaceholder": "Search prompts...",
  "filterByTag": "Filter by tag",
  "allTags": "All Tags",
  "promptTitle": "Title",
  "promptContent": "Prompt",
  "promptTags": "Tags",
  "titlePlaceholder": "e.g. Code Review Prompt",
  "contentPlaceholder": "Enter your prompt here...",
  "tagsPlaceholder": "e.g. coding, review, typescript (comma-separated)",
  "save": "Save",
  "cancel": "Cancel",
  "edit": "Edit",
  "delete": "Delete",
  "copy": "Copy",
  "copied": "Copied!",
  "export": "Export JSON",
  "import": "Import JSON",
  "noPrompts": "No prompts yet. Add your first prompt!",
  "noResults": "No prompts match your search",
  "deleteConfirm": "Delete this prompt?",
  "imported": "Prompts imported successfully",
  "importError": "Invalid JSON file"
},
"ClaudeMdGenerator": {
  "title": "CLAUDE.md Generator",
  "description": "Generate CLAUDE.md files for your AI-assisted projects",
  "projectNameLabel": "Project Name",
  "projectNamePlaceholder": "e.g. my-saas-app",
  "descriptionLabel": "Project Description",
  "descriptionPlaceholder": "e.g. A SaaS app for managing invoices built with Next.js and Supabase",
  "techStackLabel": "Tech Stack",
  "techStackPlaceholder": "e.g. Next.js 15, TypeScript, Tailwind, Supabase, Prisma",
  "commandsLabel": "Key Commands",
  "commandsPlaceholder": "e.g. bun dev, bun test, bun build",
  "conventionsLabel": "Coding Conventions",
  "conventionsPlaceholder": "e.g. Use kebab-case for files, PascalCase for components, always use TypeScript strict mode",
  "doLabel": "Do (always)",
  "doPlaceholder": "e.g. Write tests before code. Use Zod for validation.",
  "dontLabel": "Don't (never)",
  "dontPlaceholder": "e.g. Never use any type. Don't commit .env files.",
  "preview": "Preview",
  "copy": "Copy",
  "download": "Download",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "downloaded": "Downloaded!",
  "emptyPreview": "Fill in the fields above to generate your CLAUDE.md"
},
"AIRulesGenerator": {
  "title": "AI Rules Generator",
  "description": "Generate IDE AI coding rules files for Cursor, Windsurf, and GitHub Copilot",
  "targetLabel": "Target IDE / Tool",
  "cursor": "Cursor (.cursorrules)",
  "windsurf": "Windsurf (.windsurfrules)",
  "copilot": "GitHub Copilot (.github/copilot-instructions.md)",
  "languageLabel": "Primary Language",
  "frameworkLabel": "Framework / Stack",
  "frameworkPlaceholder": "e.g. Next.js 15, React 18, Tailwind CSS",
  "styleLabel": "Code Style Preferences",
  "stylePlaceholder": "e.g. Functional components, no class components, prefer const arrow functions",
  "doLabel": "Always Do",
  "doPlaceholder": "e.g. Write TypeScript strict mode, add JSDoc to public APIs",
  "dontLabel": "Never Do",
  "dontPlaceholder": "e.g. Never use var, avoid any type, no inline styles",
  "preview": "Preview",
  "copy": "Copy",
  "download": "Download",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "emptyPreview": "Fill in the fields to generate your rules file"
},
"JsonSchemaBuilder": {
  "title": "JSON Schema Builder",
  "description": "Build JSON schemas for LLM tool calls and function calling",
  "toolName": "Tool / Function Name",
  "toolNamePlaceholder": "e.g. get_weather",
  "toolDescription": "Description",
  "toolDescriptionPlaceholder": "e.g. Get the current weather for a location",
  "addProperty": "Add Property",
  "propertyName": "Property Name",
  "propertyType": "Type",
  "propertyDescription": "Description",
  "propertyRequired": "Required",
  "removeProperty": "Remove",
  "outputFormat": "Output Format",
  "formatOpenAI": "OpenAI Tool Format",
  "formatAnthropic": "Anthropic Tool Format",
  "formatJsonSchema": "Raw JSON Schema",
  "copy": "Copy",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "noProperties": "Add properties to build your schema"
},
"McpConfig": {
  "title": "MCP Config Generator",
  "description": "Generate MCP configuration files for Claude Desktop and other clients",
  "addServer": "Add Server",
  "serverName": "Server Name",
  "serverNamePlaceholder": "e.g. filesystem",
  "transport": "Transport",
  "transportStdio": "stdio",
  "transportSse": "SSE",
  "command": "Command",
  "commandPlaceholder": "e.g. npx",
  "args": "Arguments",
  "argsPlaceholder": "e.g. -y @modelcontextprotocol/server-filesystem /path",
  "envVars": "Environment Variables",
  "addEnvVar": "Add Variable",
  "envKey": "Key",
  "envValue": "Value",
  "removeServer": "Remove Server",
  "removeEnvVar": "Remove",
  "copy": "Copy JSON",
  "download": "Download",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "noServers": "Add a server to get started",
  "preview": "Preview"
},
"PromptFormatter": {
  "title": "Prompt Formatter",
  "description": "Convert prompts between AI model formats",
  "inputLabel": "Input",
  "systemLabel": "System Message",
  "systemPlaceholder": "Enter system message...",
  "userLabel": "User Message",
  "userPlaceholder": "Enter user message...",
  "assistantLabel": "Assistant Message (optional)",
  "assistantPlaceholder": "Enter assistant response to continue...",
  "fromFormat": "From Format",
  "toFormat": "To Format",
  "formatPlain": "Plain Text",
  "formatChatML": "ChatML",
  "formatLlama3": "Llama 3 Instruct",
  "formatClaudeXml": "Claude XML Tags",
  "formatOpenAI": "OpenAI API JSON",
  "convert": "Convert",
  "copy": "Copy",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "output": "Output"
},
"SkillBuilder": {
  "title": "Skill / Agent Builder",
  "description": "Scaffold AI agent skill files with a guided form",
  "nameLabel": "Skill Name",
  "namePlaceholder": "e.g. code-reviewer",
  "descriptionLabel": "Description",
  "descriptionPlaceholder": "Describe what this skill does and when to use it...",
  "triggersLabel": "Trigger Phrases",
  "triggersPlaceholder": "e.g. review my code, check this implementation (comma-separated)",
  "instructionsLabel": "Instructions",
  "instructionsPlaceholder": "Detailed instructions for the agent: what to do, how to respond, what tools to use...",
  "outputFormat": "Output Format",
  "formatMarkdown": "Markdown Skill File",
  "formatYaml": "YAML",
  "formatJson": "JSON",
  "preview": "Preview",
  "copy": "Copy",
  "download": "Download",
  "clearAll": "Clear All",
  "copied": "Copied!",
  "emptyPreview": "Fill in the fields to preview your skill file"
},
"AIInstructionDiff": {
  "title": "AI Instruction Diff",
  "description": "Compare two system prompts or AI instruction files",
  "leftLabel": "Original",
  "rightLabel": "Modified",
  "leftPlaceholder": "Paste your original system prompt or CLAUDE.md here...",
  "rightPlaceholder": "Paste your updated version here...",
  "compare": "Compare",
  "clearAll": "Clear All",
  "additions": "Additions",
  "deletions": "Deletions",
  "unchanged": "Unchanged",
  "noChanges": "No differences found — the texts are identical",
  "emptyInputs": "Enter text in both fields to compare",
  "loadSampleLeft": "Load Sample (v1)",
  "loadSampleRight": "Load Sample (v2)"
},
"TextSimilarity": {
  "title": "Text Similarity",
  "description": "Measure cosine similarity between texts using TF-IDF",
  "text1Label": "Text A",
  "text2Label": "Text B",
  "text1Placeholder": "Enter first text or prompt...",
  "text2Placeholder": "Enter second text or prompt...",
  "addComparison": "Add Another Text",
  "removeComparison": "Remove",
  "calculate": "Calculate Similarity",
  "similarityScore": "Similarity Score",
  "highSimilarity": "High Similarity",
  "mediumSimilarity": "Medium Similarity",
  "lowSimilarity": "Low Similarity",
  "clearAll": "Clear All",
  "noInput": "Enter at least two texts to compare",
  "pairLabel": "Pair"
}
```

### Step 4: Add translations to `messages/ar.json`

Inside the `"Tools"` object in ar.json, add:

```json
"TokenCounter": {
  "title": "عداد الرموز",
  "description": "احسب رموز النص عبر نماذج الذكاء الاصطناعي الشائعة",
  "inputLabel": "النص المدخل",
  "inputPlaceholder": "الصق نصك هنا لحساب الرموز...",
  "modelLabel": "النموذج",
  "loadSample": "تحميل مثال",
  "clearAll": "مسح الكل",
  "totalTokens": "إجمالي الرموز",
  "characters": "الأحرف",
  "words": "الكلمات",
  "estimatedCost": "التكلفة المقدرة",
  "inputCost": "تكلفة الإدخال",
  "outputCost": "تكلفة الإخراج",
  "assumingOutputLabel": "بافتراض حجم مخرجات مماثل",
  "noText": "أدخل نصًا لحساب الرموز",
  "copiedToClipboard": "تم نسخ عدد الرموز"
},
"ContextWindow": {
  "title": "حاسبة نافذة السياق",
  "description": "احسب مقدار امتلاء نافذة السياق في النموذج",
  "inputLabel": "النص المدخل",
  "inputPlaceholder": "الصق موجهك أو محادثتك هنا...",
  "modelLabel": "اختر النموذج",
  "tokenCount": "عدد الرموز",
  "contextUsed": "السياق المستخدم",
  "tokensRemaining": "الرموز المتبقية",
  "contextWindow": "نافذة السياق",
  "percentFilled": "% ممتلئة",
  "loadSample": "تحميل مثال",
  "clearAll": "مسح الكل",
  "dangerZone": "تحذير: اكتملت بأكثر من 80%",
  "criticalZone": "حرج: اكتملت بأكثر من 95%"
},
"AICostCalculator": {
  "title": "حاسبة تكلفة الذكاء الاصطناعي",
  "description": "احسب تكاليف واجهة برمجة الذكاء الاصطناعي قبل البناء",
  "modelLabel": "النموذج",
  "inputTokensLabel": "رموز الإدخال",
  "outputTokensLabel": "رموز الإخراج",
  "requestsLabel": "عدد الطلبات",
  "inputCost": "تكلفة الإدخال",
  "outputCost": "تكلفة الإخراج",
  "totalCost": "التكلفة الإجمالية",
  "perRequest": "لكل طلب",
  "totalForRequests": "الإجمالي لجميع الطلبات",
  "inputPrice": "سعر الإدخال",
  "outputPrice": "سعر الإخراج",
  "per1MTokens": "لكل مليون رمز",
  "calculate": "احسب",
  "resetAll": "إعادة تعيين",
  "placeholder": "0"
},
"ModelComparison": {
  "title": "مقارنة النماذج",
  "description": "قارن نماذج الذكاء الاصطناعي جنبًا إلى جنب",
  "searchPlaceholder": "ابحث عن النماذج...",
  "filterProvider": "المزود",
  "filterTier": "الفئة",
  "allProviders": "جميع المزودين",
  "allTiers": "جميع الفئات",
  "columnModel": "النموذج",
  "columnProvider": "المزود",
  "columnContext": "نافذة السياق",
  "columnInputPrice": "الإدخال (مليون رمز)",
  "columnOutputPrice": "الإخراج (مليون رمز)",
  "columnTier": "الفئة",
  "columnMultimodal": "متعدد الوسائط",
  "yes": "نعم",
  "no": "لا",
  "tokens": "رمز",
  "flagship": "الرائد",
  "balanced": "متوازن",
  "fast": "سريع",
  "open": "مفتوح المصدر"
},
"SystemPromptBuilder": {
  "title": "منشئ موجه النظام",
  "description": "أنشئ موجهات نظام منظمة لنماذج الذكاء الاصطناعي",
  "roleLabel": "الدور / الشخصية",
  "rolePlaceholder": "مثال: أنت مهندس برمجيات متخصص في TypeScript...",
  "toneLabel": "الأسلوب والنبرة",
  "tonePlaceholder": "مثال: موجز، مباشر، بدون كلام فارغ",
  "constraintsLabel": "القيود والقواعد",
  "constraintsPlaceholder": "مثال: لا تكتب كودًا غير مختبر أبدًا...",
  "outputFormatLabel": "تنسيق الإخراج",
  "outputFormatPlaceholder": "مثال: استجب بـ markdown. استخدم نقاط للقوائم.",
  "examplesLabel": "أمثلة (اختياري)",
  "examplesPlaceholder": "مثال: المستخدم: كيف أرتب؟ المساعد: استخدم Array.sort()",
  "exportFormat": "تنسيق التصدير",
  "formatPlain": "نص عادي",
  "formatXml": "وسوم XML لـ Claude",
  "formatJson": "JSON (ChatML)",
  "preview": "معاينة",
  "copyPrompt": "نسخ الموجه",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "emptyPreview": "املأ الحقول أعلاه لمعاينة موجه النظام"
},
"PromptLibrary": {
  "title": "مكتبة الموجهات",
  "description": "احفظ ونظم موجهات الذكاء الاصطناعي محليًا",
  "addPrompt": "إضافة موجه",
  "searchPlaceholder": "ابحث في الموجهات...",
  "filterByTag": "تصفية بالوسم",
  "allTags": "جميع الوسوم",
  "promptTitle": "العنوان",
  "promptContent": "الموجه",
  "promptTags": "الوسوم",
  "titlePlaceholder": "مثال: موجه مراجعة الكود",
  "contentPlaceholder": "أدخل موجهك هنا...",
  "tagsPlaceholder": "مثال: برمجة، مراجعة (مفصولة بفواصل)",
  "save": "حفظ",
  "cancel": "إلغاء",
  "edit": "تعديل",
  "delete": "حذف",
  "copy": "نسخ",
  "copied": "تم النسخ!",
  "export": "تصدير JSON",
  "import": "استيراد JSON",
  "noPrompts": "لا توجد موجهات بعد. أضف أولى موجهاتك!",
  "noResults": "لا توجد موجهات تطابق بحثك",
  "deleteConfirm": "حذف هذا الموجه؟",
  "imported": "تم استيراد الموجهات بنجاح",
  "importError": "ملف JSON غير صالح"
},
"ClaudeMdGenerator": {
  "title": "منشئ ملف CLAUDE.md",
  "description": "أنشئ ملفات CLAUDE.md لمشاريعك المدعومة بالذكاء الاصطناعي",
  "projectNameLabel": "اسم المشروع",
  "projectNamePlaceholder": "مثال: my-saas-app",
  "descriptionLabel": "وصف المشروع",
  "descriptionPlaceholder": "مثال: تطبيق SaaS لإدارة الفواتير بـ Next.js و Supabase",
  "techStackLabel": "التقنيات المستخدمة",
  "techStackPlaceholder": "مثال: Next.js 15, TypeScript, Tailwind, Supabase",
  "commandsLabel": "الأوامر الرئيسية",
  "commandsPlaceholder": "مثال: bun dev, bun test, bun build",
  "conventionsLabel": "اصطلاحات البرمجة",
  "conventionsPlaceholder": "مثال: استخدم kebab-case للملفات، PascalCase للمكونات",
  "doLabel": "افعل دائمًا",
  "doPlaceholder": "مثال: اكتب الاختبارات قبل الكود",
  "dontLabel": "لا تفعل أبدًا",
  "dontPlaceholder": "مثال: لا تستخدم النوع any. لا ترفع ملفات .env",
  "preview": "معاينة",
  "copy": "نسخ",
  "download": "تنزيل",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "downloaded": "تم التنزيل!",
  "emptyPreview": "املأ الحقول أعلاه لإنشاء ملف CLAUDE.md"
},
"AIRulesGenerator": {
  "title": "منشئ قواعد الذكاء الاصطناعي",
  "description": "أنشئ ملفات قواعد IDE للذكاء الاصطناعي لـ Cursor و Windsurf",
  "targetLabel": "الأداة المستهدفة",
  "cursor": "Cursor (.cursorrules)",
  "windsurf": "Windsurf (.windsurfrules)",
  "copilot": "GitHub Copilot (.github/copilot-instructions.md)",
  "languageLabel": "اللغة الأساسية",
  "frameworkLabel": "الإطار / المكدس",
  "frameworkPlaceholder": "مثال: Next.js 15, React 18, Tailwind CSS",
  "styleLabel": "تفضيلات أسلوب الكود",
  "stylePlaceholder": "مثال: مكونات دالية، لا class components",
  "doLabel": "افعل دائمًا",
  "doPlaceholder": "مثال: اكتب TypeScript strict mode",
  "dontLabel": "لا تفعل أبدًا",
  "dontPlaceholder": "مثال: لا تستخدم var، تجنب النوع any",
  "preview": "معاينة",
  "copy": "نسخ",
  "download": "تنزيل",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "emptyPreview": "املأ الحقول لإنشاء ملف القواعد"
},
"JsonSchemaBuilder": {
  "title": "منشئ مخطط JSON",
  "description": "أنشئ مخططات JSON لاستدعاءات أدوات نماذج الذكاء الاصطناعي",
  "toolName": "اسم الأداة / الدالة",
  "toolNamePlaceholder": "مثال: get_weather",
  "toolDescription": "الوصف",
  "toolDescriptionPlaceholder": "مثال: احصل على الطقس الحالي لموقع ما",
  "addProperty": "إضافة خاصية",
  "propertyName": "اسم الخاصية",
  "propertyType": "النوع",
  "propertyDescription": "الوصف",
  "propertyRequired": "مطلوب",
  "removeProperty": "إزالة",
  "outputFormat": "تنسيق الإخراج",
  "formatOpenAI": "تنسيق أداة OpenAI",
  "formatAnthropic": "تنسيق أداة Anthropic",
  "formatJsonSchema": "مخطط JSON الخام",
  "copy": "نسخ",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "noProperties": "أضف خصائص لبناء مخططك"
},
"McpConfig": {
  "title": "منشئ إعدادات MCP",
  "description": "أنشئ ملفات إعداد MCP لـ Claude Desktop والعملاء الآخرين",
  "addServer": "إضافة خادم",
  "serverName": "اسم الخادم",
  "serverNamePlaceholder": "مثال: filesystem",
  "transport": "بروتوكول النقل",
  "transportStdio": "stdio",
  "transportSse": "SSE",
  "command": "الأمر",
  "commandPlaceholder": "مثال: npx",
  "args": "المعطيات",
  "argsPlaceholder": "مثال: -y @modelcontextprotocol/server-filesystem /path",
  "envVars": "متغيرات البيئة",
  "addEnvVar": "إضافة متغير",
  "envKey": "المفتاح",
  "envValue": "القيمة",
  "removeServer": "إزالة الخادم",
  "removeEnvVar": "إزالة",
  "copy": "نسخ JSON",
  "download": "تنزيل",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "noServers": "أضف خادمًا للبدء",
  "preview": "معاينة"
},
"PromptFormatter": {
  "title": "منسق الموجهات",
  "description": "حوّل الموجهات بين تنسيقات نماذج الذكاء الاصطناعي",
  "inputLabel": "الإدخال",
  "systemLabel": "رسالة النظام",
  "systemPlaceholder": "أدخل رسالة النظام...",
  "userLabel": "رسالة المستخدم",
  "userPlaceholder": "أدخل رسالة المستخدم...",
  "assistantLabel": "رسالة المساعد (اختياري)",
  "assistantPlaceholder": "أدخل رد المساعد للاستمرار...",
  "fromFormat": "من التنسيق",
  "toFormat": "إلى التنسيق",
  "formatPlain": "نص عادي",
  "formatChatML": "ChatML",
  "formatLlama3": "Llama 3 Instruct",
  "formatClaudeXml": "وسوم XML لـ Claude",
  "formatOpenAI": "OpenAI API JSON",
  "convert": "تحويل",
  "copy": "نسخ",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "output": "الإخراج"
},
"SkillBuilder": {
  "title": "منشئ المهارات والوكلاء",
  "description": "أنشئ ملفات مهارات وكلاء الذكاء الاصطناعي بنموذج موجه",
  "nameLabel": "اسم المهارة",
  "namePlaceholder": "مثال: code-reviewer",
  "descriptionLabel": "الوصف",
  "descriptionPlaceholder": "صف ما تفعله هذه المهارة ومتى تستخدمها...",
  "triggersLabel": "عبارات التشغيل",
  "triggersPlaceholder": "مثال: راجع كودي، تحقق من هذا التطبيق (مفصولة بفواصل)",
  "instructionsLabel": "التعليمات",
  "instructionsPlaceholder": "تعليمات مفصلة للوكيل...",
  "outputFormat": "تنسيق الإخراج",
  "formatMarkdown": "ملف Markdown",
  "formatYaml": "YAML",
  "formatJson": "JSON",
  "preview": "معاينة",
  "copy": "نسخ",
  "download": "تنزيل",
  "clearAll": "مسح الكل",
  "copied": "تم النسخ!",
  "emptyPreview": "املأ الحقول لمعاينة ملف المهارة"
},
"AIInstructionDiff": {
  "title": "مقارنة التعليمات",
  "description": "قارن موجهي نظام أو ملفي تعليمات ذكاء اصطناعي",
  "leftLabel": "الأصل",
  "rightLabel": "المعدّل",
  "leftPlaceholder": "الصق موجه نظامك الأصلي أو ملف CLAUDE.md هنا...",
  "rightPlaceholder": "الصق النسخة المحدثة هنا...",
  "compare": "مقارنة",
  "clearAll": "مسح الكل",
  "additions": "الإضافات",
  "deletions": "الحذف",
  "unchanged": "بدون تغيير",
  "noChanges": "لا توجد فروق — النصان متطابقان",
  "emptyInputs": "أدخل نصًا في كلا الحقلين للمقارنة",
  "loadSampleLeft": "تحميل مثال (v1)",
  "loadSampleRight": "تحميل مثال (v2)"
},
"TextSimilarity": {
  "title": "تشابه النصوص",
  "description": "قس التشابه بين النصوص باستخدام TF-IDF",
  "text1Label": "النص أ",
  "text2Label": "النص ب",
  "text1Placeholder": "أدخل النص أو الموجه الأول...",
  "text2Placeholder": "أدخل النص أو الموجه الثاني...",
  "addComparison": "إضافة نص آخر",
  "removeComparison": "إزالة",
  "calculate": "احسب التشابه",
  "similarityScore": "درجة التشابه",
  "highSimilarity": "تشابه عالٍ",
  "mediumSimilarity": "تشابه متوسط",
  "lowSimilarity": "تشابه منخفض",
  "clearAll": "مسح الكل",
  "noInput": "أدخل نصين على الأقل للمقارنة",
  "pairLabel": "زوج"
}
```

### Step 5: Install `gpt-tokenizer`

```bash
bun add gpt-tokenizer
```

### Step 6: Verify build

```bash
bun run build
```

Expected: No TypeScript errors. If `BrainIcon` is not in your lucide-react version, use `CpuIcon` or `SparklesIcon` instead (check what's already imported at the top of tools-config.ts).

### Step 7: Commit

```bash
git add src/lib/tools-config.ts src/lib/ai-models.ts messages/en.json messages/ar.json
git commit -m "feat(ai-tools): add AI Tools category with 14 tools + translations + model data"
```

---

## Task 2 (Agent A): Token Counter + Context Window Calculator

**Files:**
- Create: `src/app/tools/token-counter/page.tsx`
- Create: `src/components/TokenCounter.tsx`
- Create: `src/app/tools/context-window/page.tsx`
- Create: `src/components/ContextWindowCalculator.tsx`

### Token Counter component logic

Uses `gpt-tokenizer` package. Import: `import { encode } from 'gpt-tokenizer'`.

Models and their approximate token ratios (since gpt-tokenizer uses cl100k_base which works for GPT-4 and is a good approximation for others):

```ts
const MODEL_OPTIONS = [
  { id: "gpt-4o", label: "GPT-4o", multiplier: 1.0 },      // cl100k_base (exact)
  { id: "gpt-4o-mini", label: "GPT-4o mini", multiplier: 1.0 }, // cl100k_base (exact)
  { id: "claude-sonnet", label: "Claude Sonnet 4.6", multiplier: 1.05 }, // approx
  { id: "llama3", label: "Llama 3", multiplier: 1.02 },     // approx
  { id: "gemini", label: "Gemini 2.0", multiplier: 1.0 },   // approx
];
```

Token count: `const tokens = encode(text).length * multiplier`.

Display: token count, character count, word count, and estimated input cost (look up price from `AI_MODELS` in `ai-models.ts`).

Use `Select` from shadcn for model picker. Use `Textarea` for input. Show stats in a grid of stat cards (4 cards: Tokens, Characters, Words, Est. Cost).

### Context Window Calculator component logic

Reuses `encode()` for token counting. Show:
- Tokens used (number)
- Context window size (from `AI_MODELS`)
- % used (color: green <50%, yellow 50-80%, orange 80-95%, red >95%)
- Tokens remaining
- A progress bar visualizing % used

Model picker: use `AI_MODELS` from `ai-models.ts`. Filter to models that have a meaningful context window.

### page.tsx for both (same pattern):
```tsx
import TokenCounter from "@/components/TokenCounter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/token-counter");
export default function Page() { return <TokenCounter />; }
```

---

## Task 3 (Agent B): AI Cost Calculator + Model Comparison

**Files:**
- Create: `src/app/tools/ai-cost-calculator/page.tsx`
- Create: `src/components/AICostCalculator.tsx`
- Create: `src/app/tools/model-comparison/page.tsx`
- Create: `src/components/ModelComparison.tsx`

### AI Cost Calculator logic

Three inputs: model (Select from AI_MODELS), input tokens (number input), output tokens (number input), number of requests (number input, default 1).

Formula:
```ts
const inputCost = (inputTokens / 1_000_000) * model.inputPricePer1M * requests;
const outputCost = (outputTokens / 1_000_000) * model.outputPricePer1M * requests;
const total = inputCost + outputCost;
```

Display: per-request breakdown + total. Format numbers to 6 decimal places for small amounts, 2 for large.

Show the model's pricing (input/output per 1M tokens) below the model picker for reference.

### Model Comparison logic

Renders `AI_MODELS` as a sortable, filterable table. Use `useState` for:
- `search` string filter on model name
- `providerFilter` string (from `PROVIDERS`)
- `tierFilter` string (from `TIERS`)
- `sortColumn` and `sortDir`

Table columns: Model, Provider, Context Window (formatted with `toLocaleString()` + " tokens"), Input Price ($X.XX), Output Price ($X.XX), Tier (badge), Multimodal (yes/no badge).

Make it responsive — on mobile, use a card layout instead of a table.

---

## Task 4 (Agent C): System Prompt Builder + Prompt Library

**Files:**
- Create: `src/app/tools/system-prompt-builder/page.tsx`
- Create: `src/components/SystemPromptBuilder.tsx`
- Create: `src/app/tools/prompt-library/page.tsx`
- Create: `src/components/PromptLibrary.tsx`

### System Prompt Builder logic

Four text inputs: Role, Tone, Constraints, Output Format, Examples (optional).

Export format selector (tabs or select): Plain Text | Claude XML | ChatML JSON.

**Plain text output:**
```
You are {role}.

Tone: {tone}

Rules:
{constraints}

Output format: {outputFormat}

{examples ? `Examples:\n${examples}` : ""}
```

**Claude XML output:**
```xml
<system>
  <role>{role}</role>
  <tone>{tone}</tone>
  <constraints>{constraints}</constraints>
  <output_format>{outputFormat}</output_format>
  {examples && `<examples>{examples}</examples>`}
</system>
```

**ChatML JSON output:**
```json
{"role": "system", "content": "...combined plain text..."}
```

Show live preview (read-only textarea or `<pre>` block with copy button). Copy button copies the preview content.

### Prompt Library logic

Uses **localStorage** for persistence (NOT Zustand, to keep it simple).

Data structure:
```ts
interface Prompt {
  id: string; // crypto.randomUUID()
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
}
```

Load from localStorage on mount:
```ts
const stored = localStorage.getItem("prompt-library");
const prompts: Prompt[] = stored ? JSON.parse(stored) : [];
```

Save to localStorage whenever prompts change.

Features:
- Add/edit/delete prompts via a modal or inline form
- Search by title+content
- Filter by tag
- Copy prompt content with one click
- Export all as JSON (`JSON.stringify(prompts, null, 2)` → blob download)
- Import from JSON file (file input → parse → merge or replace)

---

## Task 5 (Agent D): CLAUDE.md Generator + AI Rules Generator

**Files:**
- Create: `src/app/tools/claude-md-generator/page.tsx`
- Create: `src/components/ClaudeMdGenerator.tsx`
- Create: `src/app/tools/ai-rules-generator/page.tsx`
- Create: `src/components/AIRulesGenerator.tsx`

### CLAUDE.md Generator logic

Form fields: Project Name, Description, Tech Stack, Key Commands (textarea), Coding Conventions (textarea), Do Rules (textarea), Don't Rules (textarea).

Output template (in the preview):
```markdown
# {projectName}

## Project Overview
{description}

## Tech Stack
{techStack}

## Key Commands
```
{commands}
```

## Coding Conventions
{conventions}

## Do
{doRules}

## Don't
{dontRules}
```

Two action buttons: **Copy** (copies preview to clipboard) and **Download** (creates a blob with filename `CLAUDE.md`).

Download implementation:
```ts
const blob = new Blob([output], { type: "text/markdown" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "CLAUDE.md";
a.click();
URL.revokeObjectURL(url);
```

### AI Rules Generator logic

Target selector (tabs): Cursor | Windsurf | GitHub Copilot.

Fields: Language (input), Framework/Stack (textarea), Style Preferences (textarea), Always Do (textarea), Never Do (textarea).

**Output for Cursor / Windsurf (same format, different filename):**
```
# {language} + {framework} Rules

## Code Style
{stylePrefs}

## Always Do
{doRules}

## Never Do
{dontRules}
```

**Output for GitHub Copilot:**
```markdown
# Copilot Instructions

## Stack
{framework}

## Code Style
{stylePrefs}

## Always Do
{doRules}

## Never Do
{dontRules}
```

Download filename: `.cursorrules`, `.windsurfrules`, or `.github/copilot-instructions.md` depending on target.

---

## Task 6 (Agent E): JSON Schema Builder + MCP Config Generator

**Files:**
- Create: `src/app/tools/json-schema-builder/page.tsx`
- Create: `src/components/JsonSchemaBuilder.tsx`
- Create: `src/app/tools/mcp-config/page.tsx`
- Create: `src/components/McpConfigGenerator.tsx`

### JSON Schema Builder logic

State:
```ts
interface Property {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  required: boolean;
}

interface ToolDef {
  name: string;
  description: string;
  properties: Property[];
}
```

Build JSON schema from tool definition. Output format switcher:

**OpenAI format:**
```json
{
  "type": "function",
  "function": {
    "name": "{name}",
    "description": "{description}",
    "parameters": {
      "type": "object",
      "properties": {
        "{propName}": {"type": "{propType}", "description": "{propDesc}"}
      },
      "required": ["{requiredProps}"]
    }
  }
}
```

**Anthropic format:**
```json
{
  "name": "{name}",
  "description": "{description}",
  "input_schema": {
    "type": "object",
    "properties": {...},
    "required": [...]
  }
}
```

**Raw JSON Schema:**
```json
{
  "type": "object",
  "properties": {...},
  "required": [...]
}
```

Show output in a syntax-highlighted `<pre>` block (use `bg-muted font-mono text-sm` class, no external syntax highlighter needed).

### MCP Config Generator logic

State:
```ts
interface EnvVar { key: string; value: string; }
interface McpServer {
  id: string;
  name: string;
  transport: "stdio" | "sse";
  command: string;
  args: string; // space-separated, split on generate
  envVars: EnvVar[];
}
```

Build output JSON:
```json
{
  "mcpServers": {
    "{server.name}": {
      "command": "{server.command}",
      "args": ["{split args}"],
      "env": { "{key}": "{value}" }
    }
  }
}
```

For SSE transport, output:
```json
"{server.name}": {
  "url": "{server.command}",
  "transport": "sse"
}
```

Download as `claude_desktop_config.json`.

---

## Task 7 (Agent F): Prompt Formatter + Skill Builder

**Files:**
- Create: `src/app/tools/prompt-formatter/page.tsx`
- Create: `src/components/PromptFormatter.tsx`
- Create: `src/app/tools/skill-builder/page.tsx`
- Create: `src/components/SkillBuilder.tsx`

### Prompt Formatter logic

Inputs: System message, User message, Assistant message (optional).
Output format selector: Plain Text | ChatML | Llama 3 Instruct | Claude XML Tags | OpenAI API JSON.

**ChatML:**
```
<|im_start|>system
{system}<|im_end|>
<|im_start|>user
{user}<|im_end|>
<|im_start|>assistant
{assistant}<|im_end|>
```

**Llama 3 Instruct:**
```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{system}<|eot_id|><|start_header_id|>user<|end_header_id|>

{user}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{assistant}
```

**Claude XML Tags:** `<system>{system}</system><human>{user}</human><assistant>{assistant}</assistant>`

**OpenAI API JSON:** `[{"role":"system","content":"{system}"},{"role":"user","content":"{user}"}]`

**Plain Text:** `System: {system}\n\nUser: {user}\n\nAssistant: {assistant}`

Show output in a read-only textarea or pre block with copy button.

### Skill Builder logic

Form fields: Name (slug format), Description (textarea), Trigger Phrases (comma-separated), Instructions (large textarea).

Output format selector: Markdown | YAML | JSON.

Markdown output uses YAML frontmatter (`---\nname: {name}\ndescription: ...\n---\n\n# {name}\n\n{instructions}`).

Download button creates file named `{name}.md`, `{name}.yaml`, or `{name}.json`.

---

## Task 8 (Agent G): AI Instruction Diff + Text Similarity

**Files:**
- Create: `src/app/tools/ai-instruction-diff/page.tsx`
- Create: `src/components/AIInstructionDiff.tsx`
- Create: `src/app/tools/text-similarity/page.tsx`
- Create: `src/components/TextSimilarity.tsx`

### AI Instruction Diff logic

Two large textareas: Original and Modified. Install `diff` package first: `bun add diff @types/diff`.

```ts
import { diffLines } from 'diff';
const changes = diffLines(original, modified);
// Each change: { value, added?, removed? }
```

Display colored blocks: green for additions (`bg-green-50 border-l-4 border-green-500`), red for deletions (`bg-red-50 border-l-4 border-red-500`), neutral for unchanged. Show summary: X additions, Y deletions.

Include "Load Sample" buttons with v1/v2 sample system prompts.

### Text Similarity logic

No external model. Use TF-IDF cosine similarity in-browser:

```ts
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\W+/).filter(t => t.length > 1);
}
// Build TF-IDF vectors, compute cosine similarity between all text pairs
// Score >= 0.8: High (green), 0.5-0.8: Medium (yellow), < 0.5: Low (red)
```

UI: 2 text inputs by default, "Add Another Text" button (max 5). "Calculate Similarity" button computes all pairwise scores and shows them as score cards.

---

## Execution Order

1. **Run Task 1 first** (infrastructure - sequential, ~10 min)
2. **Run Tasks 2-8 in parallel** (7 independent agents, ~15-20 min each)
3. After all complete: `bun run build` to verify no errors

## Verification Checklist

- [ ] `bun run build` passes
- [ ] All 14 tools appear under "AI Tools" category on homepage
- [ ] Arabic translations work (switch locale, verify all UI text)
- [ ] RTL layout correct (`dir="auto"` on text inputs)
- [ ] Token Counter shows count on text entry
- [ ] Prompt Library persists to localStorage
- [ ] All copy/download buttons work
- [ ] AI Instruction Diff shows colored diff
- [ ] MCP Config outputs valid JSON

**OpenAI API JSON:**
```json
[
  {"role": "system", "content": "{system}"},
  {"role": "user", "content": "{user}"},
  {"role": "assistant", "content": "{assistant}"}
]
```

**Plain Text:**
```
System: {system}

User: {user}
