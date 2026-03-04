"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, RefreshCw, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Data pools
const FIRST_NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Isabella", "James", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zoe"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Moore", "Young"];
const DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "test.org", "mail.net", "company.io"];
const STREETS = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Elm Blvd", "Birch Way", "Willow Ct"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin"];
const STATES = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "GA", "NC"];
const COMPANIES = ["Acme Corp", "TechStart Inc", "Global Ventures", "Blue Ocean LLC", "Peak Solutions", "Nova Systems", "Bright Ideas Co", "Apex Group"];
const JOB_TITLES = ["Software Engineer", "Product Manager", "Designer", "Marketing Lead", "Data Analyst", "DevOps Engineer", "QA Engineer", "Sales Rep", "Customer Success", "HR Manager"];
const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(" ");

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function loremSentence(words = 8) {
  const w = Array.from({ length: words }, () => pick(LOREM));
  w[0] = w[0].charAt(0).toUpperCase() + w[0].slice(1);
  return w.join(" ") + ".";
}

interface FieldConfig {
  key: string;
  label: string;
  enabled: boolean;
  generate: () => string | number;
}

export default function FakeDataGenerator() {
  const t = useTranslations("Tools.FakeDataGenerator");
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [output, setOutput] = useState("");

  const [fields, setFields] = useState<FieldConfig[]>([
    { key: "id", label: "ID", enabled: true, generate: () => uuid() },
    { key: "firstName", label: "First Name", enabled: true, generate: () => pick(FIRST_NAMES) },
    { key: "lastName", label: "Last Name", enabled: true, generate: () => pick(LAST_NAMES) },
    { key: "email", label: "Email", enabled: true, generate: () => `${pick(FIRST_NAMES).toLowerCase()}.${pick(LAST_NAMES).toLowerCase()}${rand(1, 99)}@${pick(DOMAINS)}` },
    { key: "phone", label: "Phone", enabled: true, generate: () => `+1-${rand(200, 999)}-${rand(100, 999)}-${rand(1000, 9999)}` },
    { key: "age", label: "Age", enabled: false, generate: () => rand(18, 75) },
    { key: "company", label: "Company", enabled: false, generate: () => pick(COMPANIES) },
    { key: "jobTitle", label: "Job Title", enabled: false, generate: () => pick(JOB_TITLES) },
    { key: "city", label: "City", enabled: false, generate: () => pick(CITIES) },
    { key: "state", label: "State", enabled: false, generate: () => pick(STATES) },
    { key: "street", label: "Street Address", enabled: false, generate: () => `${rand(100, 9999)} ${pick(STREETS)}` },
    { key: "zipCode", label: "Zip Code", enabled: false, generate: () => String(rand(10000, 99999)) },
    { key: "website", label: "Website", enabled: false, generate: () => `https://www.${pick(LAST_NAMES).toLowerCase()}.com` },
    { key: "bio", label: "Bio", enabled: false, generate: () => loremSentence(rand(10, 20)) },
    { key: "salary", label: "Salary ($)", enabled: false, generate: () => rand(40000, 200000) },
    { key: "createdAt", label: "Created At", enabled: false, generate: () => new Date(Date.now() - rand(0, 365 * 24 * 3600 * 1000 * 3)).toISOString().slice(0, 10) },
  ]);

  const enabledFields = fields.filter((f) => f.enabled);

  const generate = () => {
    if (enabledFields.length === 0) {
      toast.error(t("selectAtLeastOneField"));
      return;
    }
    const rows = Array.from({ length: Math.max(1, Math.min(count, 1000)) }, () => {
      const row: Record<string, string | number> = {};
      enabledFields.forEach((f) => { row[f.key] = f.generate(); });
      return row;
    });

    if (format === "json") {
      setOutput(JSON.stringify(rows, null, 2));
    } else {
      const headers = enabledFields.map((f) => f.key).join(",");
      const csvRows = rows.map((r) =>
        enabledFields.map((f) => {
          const val = String(r[f.key]);
          return val.includes(",") ? `"${val}"` : val;
        }).join(",")
      );
      setOutput([headers, ...csvRows].join("\n"));
    }
    toast.success(t("generatedRecords", { count: rows.length }));
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const ext = format === "json" ? "json" : "csv";
    const blob = new Blob([output], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-data-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleField = (key: string) => {
    setFields((prev) => prev.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <UserCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">{t("settingsTitle")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{t("numberOfRecords")}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("format")}</Label>
                  <div className="flex gap-2">
                    {(["json", "csv"] as const).map((f) => (
                      <Button
                        key={f}
                        size="sm"
                        variant={format === f ? "default" : "outline"}
                        onClick={() => setFormat(f)}
                        className="flex-1"
                      >
                        {f.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {t("fieldsTitle")}
                  <Badge variant="secondary">{t("selectedCount", { count: enabledFields.length })}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <Checkbox
                      id={field.key}
                      checked={field.enabled}
                      onCheckedChange={() => toggleField(field.key)}
                    />
                    <label htmlFor={field.key} className="text-sm cursor-pointer">{field.label}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={generate} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" /> {t("generateData")}
            </Button>
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {t("outputTitle")}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy} disabled={!output}>
                      <Copy className="w-3.5 h-3.5 me-1.5" /> {t("copy")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownload} disabled={!output}>
                      <Download className="w-3.5 h-3.5 me-1.5" /> {t("download")}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  readOnly
                  value={output}
                  placeholder={t("outputPlaceholder")}
                  className="w-full min-h-[60vh] font-mono text-xs bg-muted/50 rounded-lg p-3 resize-none outline-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
