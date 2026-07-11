"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";

interface Perms { r: boolean; w: boolean; x: boolean }
function toBits(p: Perms) { return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0); }
function toSymbolic(p: Perms) { return `${p.r ? "r" : "-"}${p.w ? "w" : "-"}${p.x ? "x" : "-"}`; }

export default function ChmodCalculator() {
  const t = useTranslations("Tools.ChmodCalculator");
  const tc = useTranslations("ToolsConfig");
  const [owner, setOwner] = useState<Perms>({ r: true, w: true, x: false });
  const [group, setGroup] = useState<Perms>({ r: true, w: false, x: false });
  const [others, setOthers] = useState<Perms>({ r: true, w: false, x: false });

  const octal = `${toBits(owner)}${toBits(group)}${toBits(others)}`;
  const symbolic = `${toSymbolic(owner)}${toSymbolic(group)}${toSymbolic(others)}`;
  const command = `chmod ${octal} filename`;

  const handleOctalInput = (val: string) => {
    if (!/^[0-7]{3}$/.test(val)) return;
    const parse = (n: number): Perms => ({ r: !!(n & 4), w: !!(n & 2), x: !!(n & 1) });
    setOwner(parse(+val[0])); setGroup(parse(+val[1])); setOthers(parse(+val[2]));
  };

  const PermRow = ({ label, value, onChange }: { label: string; value: Perms; onChange: (p: Perms) => void }) => (
    <div className="flex items-center gap-4 py-3 border-b last:border-0">
      <span className="w-24 text-sm font-medium shrink-0">{label}</span>
      {(["r", "w", "x"] as const).map((bit) => (
        <label key={bit} className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={value[bit]} onChange={(e) => onChange({ ...value, [bit]: e.target.checked })} className="rounded" />
          <span className="font-mono">{bit === "r" ? t("read") : bit === "w" ? t("write") : t("execute")}</span>
          <span className="text-muted-foreground text-xs hidden sm:inline">({bit === "r" ? 4 : bit === "w" ? 2 : 1})</span>
        </label>
      ))}
      <span className="ms-auto font-mono font-bold text-lg w-6 text-center">{toBits(value)}</span>
    </div>
  );

  return (
    <ToolShell
      slug="chmod"
      title={tc("tools.chmod.name")}
      sub={tc("tools.chmod.description")}
    >
      <div className="max-w-3xl mx-auto space-y-4">
      <Card>
        <CardContent className="pt-6">
          <PermRow label={t("owner")} value={owner} onChange={setOwner} />
          <PermRow label={t("group")} value={group} onChange={setGroup} />
          <PermRow label={t("others")} value={others} onChange={setOthers} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center space-y-1">
          <p className="text-xs text-muted-foreground">{t("octal")}</p>
          <p className="text-4xl font-bold font-mono">{octal}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center space-y-1">
          <p className="text-xs text-muted-foreground">{t("symbolic")}</p>
          <p className="text-2xl font-bold font-mono">{symbolic}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6 space-y-2">
          <p className="text-xs text-muted-foreground">{t("command")}</p>
          <p className="font-mono text-sm bg-muted rounded px-2 py-1 break-all">{command}</p>
          <CopyButton text={command} label={t("copyCommand")} successMessage={t("copied")} />
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Enter octal:</span>
          <input type="text" maxLength={3} defaultValue={octal} onChange={(e) => handleOctalInput(e.target.value)}
            className="font-mono text-xl w-16 text-center border rounded px-2 py-1 bg-background" placeholder="644" />
        </CardContent>
      </Card>
      </div>
    </ToolShell>
  );
}
