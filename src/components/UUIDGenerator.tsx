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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Download, Hash, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UUIDFormat {
  value: string;
  label: string;
  description: string;
}

export default function UUIDGenerator() {
  const t = useTranslations("Tools.UUIDGenerator");
  const [count, setCount] = useState<number>(1);
  const [format, setFormat] = useState<string>("v4");
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [customNamespace, setCustomNamespace] = useState<string>("");
  const [customName, setCustomName] = useState<string>("");

  const formats: UUIDFormat[] = [
    {
      value: "v4",
      label: t("formatV4Label"),
      description: t("formatV4Desc"),
    },
    {
      value: "v1",
      label: t("formatV1Label"),
      description: t("formatV1Desc"),
    },
    {
      value: "v3",
      label: t("formatV3Label"),
      description: t("formatV3Desc"),
    },
    {
      value: "v5",
      label: t("formatV5Label"),
      description: t("formatV5Desc"),
    },
    {
      value: "nil",
      label: t("formatNilLabel"),
      description: t("formatNilDesc"),
    },
  ];

  const generateUUIDv4 = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const generateUUIDv1 = (): string => {
    // Simplified v1 implementation - in real world, you'd use a proper library
    const timestamp = Date.now();
    const random1 = Math.random().toString(16).substring(2, 10);
    const random2 = Math.random().toString(16).substring(2, 6);
    const random3 = Math.random().toString(16).substring(2, 6);
    const random4 = Math.random().toString(16).substring(2, 14);

    return `${random1}-${random2}-1${random3.substring(1)}-${random4.substring(
      0,
      4
    )}-${random4.substring(4)}`;
  };

  const generateUUIDv3 = (namespace: string, name: string): string => {
    // Simplified v3 implementation using a basic hash
    const input = namespace + name;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-3${hex.substring(
      12,
      15
    )}-${hex.substring(15, 19)}-${hex.substring(19, 31).padEnd(12, "0")}`;
  };

  const generateUUIDv5 = (namespace: string, name: string): string => {
    // Simplified v5 implementation using a basic hash
    const input = namespace + name + "v5";
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-5${hex.substring(
      12,
      15
    )}-${hex.substring(15, 19)}-${hex.substring(19, 31).padEnd(12, "0")}`;
  };

  const generateNilUUID = (): string => {
    return "00000000-0000-0000-0000-000000000000";
  };

  const generateUUID = (): string => {
    switch (format) {
      case "v4":
        return generateUUIDv4();
      case "v1":
        return generateUUIDv1();
      case "v3":
        return generateUUIDv3(
          customNamespace || "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          customName
        );
      case "v5":
        return generateUUIDv5(
          customNamespace || "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          customName
        );
      case "nil":
        return generateNilUUID();
      default:
        return generateUUIDv4();
    }
  };

  const generateUUIDs = () => {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      uuids.push(generateUUID());
    }
    setGeneratedUUIDs(uuids);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
    }
  };

  const copyAllToClipboard = async () => {
    const allUUIDs = generatedUUIDs.join("\n");
    try {
      await navigator.clipboard.writeText(allUUIDs);
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
    }
  };

  const downloadUUIDs = () => {
    const content = generatedUUIDs.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${format}-${count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearUUIDs = () => {
    setGeneratedUUIDs([]);
  };

  const validateUUID = (uuid: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const getUUIDVersion = (uuid: string): string => {
    if (uuid === "00000000-0000-0000-0000-000000000000") return "Nil";
    const version = uuid.charAt(14);
    switch (version) {
      case "1":
        return "v1";
      case "3":
        return "v3";
      case "4":
        return "v4";
      case "5":
        return "v5";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              {t("generatorSettingsTitle")}
            </CardTitle>
            <CardDescription>{t("generatorSettingsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("uuidVersionLabel")}</Label>
              <div className="grid grid-cols-1 gap-2">
                {formats.map((fmt) => (
                  <div
                    key={fmt.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      format === fmt.value
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setFormat(fmt.value)}
                  >
                    <div className="font-medium">{fmt.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {fmt.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("uuidCountLabel", { count })}</Label>
              <Slider
                value={[count]}
                onValueChange={(value) => setCount(value[0])}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>100</span>
              </div>
            </div>

            {(format === "v3" || format === "v5") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="namespace">{t("namespaceLabel")}</Label>
                  <Input
                    id="namespace"
                    value={customNamespace}
                    onChange={(e) => setCustomNamespace(e.target.value)}
                    placeholder={t("namespacePlaceholder")}
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("namespaceHint")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("nameLabel")}</Label>
                  <Input
                    id="name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                  />
                </div>
              </div>
            )}

            <Button onClick={generateUUIDs} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("generateUUIDs")}
            </Button>
          </CardContent>
        </Card>

        {/* Generated UUIDs */}
        <Card>
          <CardHeader>
            <CardTitle>{t("generatedUUIDsTitle")}</CardTitle>
            <CardDescription>
              {generatedUUIDs.length > 0
                ? t("uuidsGenerated", { count: generatedUUIDs.length })
                : t("noUUIDsYet")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedUUIDs.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Textarea
                    value={generatedUUIDs.join("\n")}
                    readOnly
                    dir="ltr"
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={copyAllToClipboard}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t("copyAll")}
                  </Button>
                  <Button onClick={downloadUUIDs} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t("download")}
                  </Button>
                  <Button onClick={clearUUIDs} variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("clear")}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">{t("individualUUIDs")}</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {generatedUUIDs.map((uuid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <div className="font-mono text-sm" dir="ltr">{uuid}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getUUIDVersion(uuid)}
                            </Badge>
                            {validateUUID(uuid) ? (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-500"
                              >
                                {t("valid")}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                {t("invalid")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(uuid)}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Hash className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>{t("clickToGenerate")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* UUID Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("uuidInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">{t("uuidVersionsTitle")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>v1:</strong> {t("versionV1").replace("v1: ", "")}</li>
                <li><strong>v3:</strong> {t("versionV3").replace("v3: ", "")}</li>
                <li><strong>v4:</strong> {t("versionV4").replace("v4: ", "")}</li>
                <li><strong>v5:</strong> {t("versionV5").replace("v5: ", "")}</li>
                <li><strong>Nil:</strong> {t("versionNil").replace("Nil: ", "")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("commonUseCasesTitle")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t("useCase1")}</li>
                <li>• {t("useCase2")}</li>
                <li>• {t("useCase3")}</li>
                <li>• {t("useCase4")}</li>
                <li>• {t("useCase5")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
