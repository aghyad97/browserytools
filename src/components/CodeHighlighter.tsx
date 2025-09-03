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
import "highlight.js/styles/github-dark.css";
import { Copy, RotateCcw, Check, Code2 } from "lucide-react";

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
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    SAMPLE_CODE[language as keyof typeof SAMPLE_CODE] || ""
  );
  const [highlighted, setHighlighted] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      const highlighted = hljs.highlight(code, { language }).value;
      setHighlighted(highlighted);
    }
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const resetCode = () => {
    const sampleCode = SAMPLE_CODE[language as keyof typeof SAMPLE_CODE] || "";
    setCode(sampleCode);
    toast.info("Reset to sample code");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const sampleCode = SAMPLE_CODE[value as keyof typeof SAMPLE_CODE] || "";
    setCode(sampleCode);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={resetCode} size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={copyToClipboard} size="icon">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[600px]">
            <Card className="flex flex-col">
              <div className="p-2 bg-muted font-medium text-sm border-b">
                Input
              </div>
              <div className="flex-1 p-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[500px] font-mono text-sm resize-none"
                  placeholder="Enter your code here..."
                />
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-2 bg-muted font-medium text-sm border-b">
                Output
              </div>
              <div className="flex-1 p-4 bg-[#0d1117] overflow-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap">
                  <code
                    className={`language-${language} hljs`}
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
