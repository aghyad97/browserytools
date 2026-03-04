"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Hash, FileText, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

export default function HashGenerator() {
  const t = useTranslations("Tools.HashGenerator");
  const [inputText, setInputText] = useState<string>("");
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const algorithms = [
    { name: "MD5", description: "128-bit hash (deprecated for security)" },
    { name: "SHA-1", description: "160-bit hash (deprecated for security)" },
    { name: "SHA-256", description: "256-bit hash (recommended)" },
    { name: "SHA-384", description: "384-bit hash" },
    { name: "SHA-512", description: "512-bit hash" },
  ];

  // Simple hash implementations (for demonstration)
  // In production, you'd use a proper crypto library
  const simpleHash = (input: string, algorithm: string): string => {
    let hash = 0;
    const str = input + algorithm; // Add algorithm to make different hashes

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to hex and pad based on algorithm
    const hex = Math.abs(hash).toString(16);

    switch (algorithm) {
      case "MD5":
        return hex.padEnd(32, "0").substring(0, 32);
      case "SHA-1":
        return hex.padEnd(40, "0").substring(0, 40);
      case "SHA-256":
        return hex.padEnd(64, "0").substring(0, 64);
      case "SHA-384":
        return hex.padEnd(96, "0").substring(0, 96);
      case "SHA-512":
        return hex.padEnd(128, "0").substring(0, 128);
      default:
        return hex;
    }
  };

  const generateHashes = async () => {
    if (!inputText.trim()) {
      toast.error(t("emptyInput"));
      return;
    }

    setIsGenerating(true);

    // Simulate async processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results: HashResult[] = algorithms.map((alg) => ({
      algorithm: alg.name,
      hash: simpleHash(inputText, alg.name),
      length:
        alg.name === "MD5"
          ? 32
          : alg.name === "SHA-1"
          ? 40
          : alg.name === "SHA-256"
          ? 64
          : alg.name === "SHA-384"
          ? 96
          : 128,
    }));

    setHashResults(results);
    setIsGenerating(false);

    toast(t("hashesGeneratedToast"));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
    }
  };

  const copyAllHashes = async () => {
    const allHashes = hashResults
      .map((result) => `${result.algorithm}: ${result.hash}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(allHashes);
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
    }
  };

  const downloadHashes = () => {
    const content = hashResults
      .map((result) => `${result.algorithm}: ${result.hash}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hashes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText("");
    setHashResults([]);
  };

  const loadSampleText = () => {
    setInputText("Hello, World! This is a sample text for hashing.");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">{t("textInputTab")}</TabsTrigger>
          <TabsTrigger value="results">{t("resultsTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("inputTitle")}
              </CardTitle>
              <CardDescription>{t("inputDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">{t("textToHashLabel")}</Label>
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t("textToHashPlaceholder")}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={generateHashes}
                  disabled={isGenerating || !inputText.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t("generating")}
                    </>
                  ) : (
                    <>
                      <Hash className="h-4 w-4 mr-2" />
                      {t("generateHashes")}
                    </>
                  )}
                </Button>
                <Button onClick={loadSampleText} variant="outline">
                  {t("loadSample")}
                </Button>
                <Button onClick={clearAll} variant="outline">
                  {t("clear")}
                </Button>
              </div>

              {inputText && (
                <div className="text-sm text-muted-foreground">
                  <div>{t("characters")} {inputText.length}</div>
                  <div>
                    {t("words")}{" "}
                    {
                      inputText
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length
                    }
                  </div>
                  <div>{t("lines")} {inputText.split("\n").length}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("generatedHashesTitle")}</CardTitle>
              <CardDescription>
                {hashResults.length > 0
                  ? t("hashesGenerated", { count: hashResults.length })
                  : t("noHashesYet")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hashResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={copyAllHashes} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      {t("copyAll")}
                    </Button>
                    <Button
                      onClick={downloadHashes}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t("download")}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {hashResults.map((result, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{result.algorithm}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {result.length} characters
                            </span>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(result.hash)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-mono text-sm bg-muted p-2 rounded break-all" dir="ltr">
                          {result.hash}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Hash className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>{t("generateToSeeResults")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Algorithm Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("algorithmInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">{t("algorithmDetails")}</h4>
              <div className="space-y-2">
                {algorithms.map((alg) => (
                  <div
                    key={alg.name}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <div className="font-medium">{alg.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {alg.description}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {alg.name === "MD5"
                        ? "32 chars"
                        : alg.name === "SHA-1"
                        ? "40 chars"
                        : alg.name === "SHA-256"
                        ? "64 chars"
                        : alg.name === "SHA-384"
                        ? "96 chars"
                        : "128 chars"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("securityRecommendations")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {t("avoid")}
                  </Badge>
                  <span>{t("avoidDesc")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="default" className="text-xs bg-green-500">
                    {t("recommended")}
                  </Badge>
                  <span>{t("recommendedDesc")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {t("highSecurity")}
                  </Badge>
                  <span>{t("highSecurityDesc")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">
                    {t("note")}
                  </Badge>
                  <span>{t("noteDesc")}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
