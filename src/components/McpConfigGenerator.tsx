"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";
import { downloadText } from "@/lib/download";
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
  const tc = useTranslations("ToolsConfig");
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

  const handleDownload = () => {
    downloadText(output, "claude_desktop_config.json", "application/json");
  };

  return (
    <ToolShell
      slug="mcp-config"
      title={tc("tools.mcp-config.name")}
      sub={tc("tools.mcp-config.description")}
      width="wide"
      primaryAction={{ label: t("download"), onClick: handleDownload }}
    >
      <div className="space-y-4">
        <div>
          <Button size="sm" onClick={addServer}><Plus className="h-4 w-4 mr-1" />{t("addServer")}</Button>
        </div>

        {servers.map((server, idx) => (
          <SettingsCard
            key={server.id}
            title={`${t("serverName")} ${idx + 1}`}
            action={
              <Button variant="ghost" size="sm" onClick={() => removeServer(server.id)} disabled={servers.length === 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
          >
              <div className="grid sm:grid-cols-2 gap-3">
                <OptionRow label={t("serverName")} htmlFor={`mcp-name-${server.id}`}>
                  <Input id={`mcp-name-${server.id}`} dir="auto" value={server.name} onChange={e => updateServer(server.id, "name", e.target.value)} placeholder={t("serverNamePlaceholder")} />
                </OptionRow>
                <OptionRow label={t("transport")} htmlFor={`mcp-transport-${server.id}`}>
                  <select id={`mcp-transport-${server.id}`} className="w-full border rounded px-3 py-2 text-sm bg-background" value={server.transport} onChange={e => updateServer(server.id, "transport", e.target.value)}>
                    <option value="stdio">{t("transportStdio")}</option>
                    <option value="sse">{t("transportSse")}</option>
                  </select>
                </OptionRow>
              </div>
              <OptionRow label={server.transport === "sse" ? "URL" : t("command")} htmlFor={`mcp-command-${server.id}`}>
                <Input id={`mcp-command-${server.id}`} dir="auto" value={server.command} onChange={e => updateServer(server.id, "command", e.target.value)} placeholder={t("commandPlaceholder")} className="font-mono text-sm" />
              </OptionRow>
              {server.transport === "stdio" && (
                <OptionRow label={t("args")} htmlFor={`mcp-args-${server.id}`}>
                  <Input id={`mcp-args-${server.id}`} dir="auto" value={server.args} onChange={e => updateServer(server.id, "args", e.target.value)} placeholder={t("argsPlaceholder")} className="font-mono text-sm" />
                </OptionRow>
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
          </SettingsCard>
        ))}

        <OutputPanel
          text={output}
          title={t("preview")}
          copyLabel={t("copy")}
          copySuccessMessage={t("copied")}
        />
      </div>
    </ToolShell>
  );
}
