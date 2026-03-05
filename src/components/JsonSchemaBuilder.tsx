"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type PropType = "string" | "number" | "boolean" | "array" | "object";
type OutputFormat = "openai" | "anthropic" | "schema";

interface Property {
  id: string;
  name: string;
  type: PropType;
  description: string;
  required: boolean;
}

function buildSchema(name: string, description: string, properties: Property[], format: OutputFormat): string {
  const props: Record<string, object> = {};
  const required: string[] = [];

  properties.forEach(p => {
    if (!p.name) return;
    props[p.name] = { type: p.type, description: p.description || p.name };
    if (p.required) required.push(p.name);
  });

  const schema = {
    type: "object",
    properties: props,
    ...(required.length ? { required } : {}),
  };

  if (format === "openai") {
    return JSON.stringify({
      type: "function",
      function: { name: name || "function_name", description: description || "", parameters: schema }
    }, null, 2);
  }

  if (format === "anthropic") {
    return JSON.stringify({
      name: name || "function_name",
      description: description || "",
      input_schema: schema
    }, null, 2);
  }

  return JSON.stringify(schema, null, 2);
}

export default function JsonSchemaBuilder() {
  const t = useTranslations("Tools.JsonSchemaBuilder");
  const [toolName, setToolName] = useState("");
  const [toolDesc, setToolDesc] = useState("");
  const [properties, setProperties] = useState<Property[]>([
    { id: crypto.randomUUID(), name: "", type: "string", description: "", required: true }
  ]);
  const [format, setFormat] = useState<OutputFormat>("openai");

  const addProperty = () => setProperties(prev => [...prev, { id: crypto.randomUUID(), name: "", type: "string", description: "", required: false }]);
  const removeProperty = (id: string) => setProperties(prev => prev.filter(p => p.id !== id));
  const updateProp = (id: string, field: keyof Property, value: string | boolean) =>
    setProperties(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const output = buildSchema(toolName, toolDesc, properties, format);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("toolName")}</Label>
              <Input dir="auto" value={toolName} onChange={e => setToolName(e.target.value)} placeholder={t("toolNamePlaceholder")} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("toolDescription")}</Label>
              <Input dir="auto" value={toolDesc} onChange={e => setToolDesc(e.target.value)} placeholder={t("toolDescriptionPlaceholder")} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("addProperty")}</Label>
              <Button size="sm" variant="outline" onClick={addProperty}><Plus className="h-4 w-4 mr-1" />{t("addProperty")}</Button>
            </div>
            {properties.map((prop) => (
              <div key={prop.id} className="grid grid-cols-[1fr_auto_1fr_auto_auto] gap-2 items-center border rounded-md p-3">
                <Input dir="auto" value={prop.name} onChange={e => updateProp(prop.id, "name", e.target.value)} placeholder={t("propertyName")} />
                <Select value={prop.type} onValueChange={v => updateProp(prop.id, "type", v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["string", "number", "boolean", "array", "object"] as PropType[]).map(pt => (
                      <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input dir="auto" value={prop.description} onChange={e => updateProp(prop.id, "description", e.target.value)} placeholder={t("propertyDescription")} />
                <div className="flex items-center gap-1">
                  <Checkbox checked={prop.required} onCheckedChange={v => updateProp(prop.id, "required", !!v)} id={`req-${prop.id}`} />
                  <label htmlFor={`req-${prop.id}`} className="text-xs text-muted-foreground cursor-pointer">{t("propertyRequired")}</label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeProperty(prop.id)} disabled={properties.length === 1}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Label>{t("outputFormat")}</Label>
            <select className="border rounded px-2 py-1 text-sm bg-background" value={format} onChange={e => setFormat(e.target.value as OutputFormat)}>
              <option value="openai">{t("formatOpenAI")}</option>
              <option value="anthropic">{t("formatAnthropic")}</option>
              <option value="schema">{t("formatJsonSchema")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("outputFormat")}</CardTitle>
            <Button size="sm" onClick={handleCopy}>{t("copy")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto max-h-[400px] overflow-y-auto">{output}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
