"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import hljs from "highlight.js";
import "@/styles/hljs-theme.css";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { TwoPane } from "@/components/shared/TwoPane";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "php", label: "PHP" },
];

const SAMPLE_CODE = {
  javascript: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function processData(data) {
    return data
        .filter(item => item.active)
        .map(item => ({
            id: item.id,
            name: item.name.toUpperCase(),
            timestamp: new Date(item.createdAt)
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
}

class DataProcessor {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
    }
    
    async process(input) {
        if (this.cache.has(input)) {
            return this.cache.get(input);
        }
        
        const result = await this.transform(input);
        this.cache.set(input, result);
        return result;
    }
    
    transform(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data.map(x => x * 2));
            }, 100);
        });
    }
}`,
  python: `def hello(name):
    print(f"Hello, {name}!")
    return True`,
  java: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  // Add more samples for other languages
};

export default function CodeHighlighter() {
  const t = useTranslations("Tools.CodeHighlighter");
  const tc = useTranslations("ToolsConfig");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    SAMPLE_CODE[language as keyof typeof SAMPLE_CODE] || ""
  );
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    if (code) {
      const highlighted = hljs.highlight(code, { language }).value;
      setHighlighted(highlighted);
    }
  }, [code, language]);

  const resetCode = () => {
    const sampleCode = SAMPLE_CODE[language as keyof typeof SAMPLE_CODE] || "";
    setCode(sampleCode);
    toast.info(t("resetToSample"));
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const sampleCode = SAMPLE_CODE[value as keyof typeof SAMPLE_CODE] || "";
    setCode(sampleCode);
  };

  return (
    <ToolShell
      slug="code-format"
      title={tc("tools.code-format.name")}
      sub={tc("tools.code-format.description")}
      controls={
        <>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetCode} size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <CopyButton
            text={code}
            size="icon"
            successMessage={t("copiedToClipboard")}
          />
        </>
      }
    >
      <div className="space-y-4 min-h-[600px]">
          <TwoPane
            start={
              <Card className="flex flex-col">
                <div className="p-2 bg-muted font-medium text-sm border-b">
                  {t("inputLabel")}
                </div>
                <div className="flex-1 p-4">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[500px] font-mono text-sm resize-none text-left rtl:text-left"
                    placeholder={t("codePlaceholder")}
                  />
                </div>
              </Card>
            }
            end={
              <Card className="flex flex-col">
                <div className="p-2 bg-muted font-medium text-sm border-b">
                  {t("outputLabel")}
                </div>
                {/* Theme-aware highlight.js palette (src/styles/hljs-theme.css)
                    follows next-themes' .dark class; bg-muted rides the same
                    --bt-fill token so the panel matches the app's theme. */}
                <div className="flex-1 p-4 bg-muted overflow-auto max-h-[500px]">
                  <pre className="whitespace-pre-wrap">
                    <code
                      className={`language-${language} hljs`}
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  </pre>
                </div>
              </Card>
            }
          />
      </div>
    </ToolShell>
  );
}
