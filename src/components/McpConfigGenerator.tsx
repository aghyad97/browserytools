"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Transport = "stdio" | "sse";

interface EnvVar { id: string; key: string; value: string; }
interface McpServer {
  id: string;
  name: string;
  transport: Transport;
  command: string;
  args: string;
  envVars: EnvVar[];
}

function buildConfig(servers: McpServer[]): string {
  const mcpServers: Record<string, object> = {};
  servers.forEach(s => {
    if (!s.name) return;
    const env: Record<string, string> = {};
    s.envVars.forEach(ev => { if (ev.key) env[ev.key] = ev.value; });

    if (s.transport === "sse") {
      mcpServers[s.name] = { url: s.command, transport: "sse", ...(Object.keys(env).length ? { env } : {}) };
    } else {
      const args = s.args.trim() ? s.args.trim().split(/\s+/) : [];
      mcpServers[s.name] = {
        command: s.command,
        ...(args.length ? { args } : {}),
        ...(Object.keys(env).length ? { env } : {}),
      };
    }
  });
  return JSON.stringify({ mcpServers }, null, 2);
}

export default function McpConfigGenerator() {
  const t = useTranslations("Tools.McpConfig");
  const [servers, setServers] = useState<McpServer[]>([{
    id: crypto.randomUUID(), name: "", transport: "stdio", command: "", args: "", envVars: []
  }]);

  const updateServer = (id: string, field: keyof McpServer, value: string) =>
    setServers(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addServer = () => setServers(prev => [...prev, {
    id: crypto.randomUUID(), name: "", transport: "stdio", command: "", args: "", envVars: []
  }]);

  const removeServer = (id: string) => setServers(prev => prev.filter(s => s.id !== id));

  const addEnvVar = (serverId: string) => setServers(prev => prev.map(s =>
    s.id === serverId ? { ...s, envVars: [...s.envVars, { id: crypto.randomUUID(), key: "", value: "" }] } : s
  ));

  const updateEnvVar = (serverId: string, envId: string, field: "key" | "value", value: string) =>
    setServers(prev => prev.map(s =>
      s.id === serverId ? { ...s, envVars: s.envVars.map(ev => ev.id === envId ? { ...ev, [field]: value } : ev) } : s
    ));

  const removeEnvVar = (serverId: string, envId: string) =>
    setServers(prev => prev.map(s =>
      s.id === serverId ? { ...s, envVars: s.envVars.filter(ev => ev.id !== envId) } : s
    ));

  const output = buildConfig(servers);

  const handleCopy = () => { navigator.clipboard.writeText(output); toast.success(t("copied")); };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "claude_desktop_config.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm" onClick={addServer}><Plus className="h-4 w-4 mr-1" />{t("addServer")}</Button>
        </CardContent>
      </Card>

      {servers.map((server, idx) => (
        <Card key={server.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("serverName")} {idx + 1}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeServer(server.id)} disabled={servers.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("serverName")}</Label>
                <Input dir="auto" value={server.name} onChange={e => updateServer(server.id, "name", e.target.value)} placeholder={t("serverNamePlaceholder")} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("transport")}</Label>
                <select className="w-full border rounded px-3 py-2 text-sm bg-background" value={server.transport} onChange={e => updateServer(server.id, "transport", e.target.value)}>
                  <option value="stdio">{t("transportStdio")}</option>
                  <option value="sse">{t("transportSse")}</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{server.transport === "sse" ? "URL" : t("command")}</Label>
              <Input dir="auto" value={server.command} onChange={e => updateServer(server.id, "command", e.target.value)} placeholder={t("commandPlaceholder")} className="font-mono text-sm" />
            </div>
            {server.transport === "stdio" && (
              <div className="space-y-1.5">
                <Label>{t("args")}</Label>
                <Input dir="auto" value={server.args} onChange={e => updateServer(server.id, "args", e.target.value)} placeholder={t("argsPlaceholder")} className="font-mono text-sm" />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("envVars")}</Label>
                <Button size="sm" variant="outline" onClick={() => addEnvVar(server.id)}><Plus className="h-3 w-3 mr-1" />{t("addEnvVar")}</Button>
              </div>
              {server.envVars.map(ev => (
                <div key={ev.id} className="flex gap-2 items-center">
                  <Input dir="auto" value={ev.key} onChange={e => updateEnvVar(server.id, ev.id, "key", e.target.value)} placeholder={t("envKey")} className="font-mono text-sm" />
                  <Input dir="auto" value={ev.value} onChange={e => updateEnvVar(server.id, ev.id, "value", e.target.value)} placeholder={t("envValue")} className="font-mono text-sm" />
                  <Button variant="ghost" size="icon" onClick={() => removeEnvVar(server.id, ev.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{t("preview")}</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy}>{t("copy")}</Button>
              <Button size="sm" onClick={handleDownload}>{t("download")}</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted rounded-md p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto max-h-[400px] overflow-y-auto">{output}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
