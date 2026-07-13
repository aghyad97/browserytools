"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";
import { OutputPanel } from "@/components/shared/OutputPanel";

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

  const PermRow = ({ value, onChange }: { value: Perms; onChange: (p: Perms) => void }) => (
    <div className="flex items-center gap-4 flex-wrap">
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
      <SettingsCard>
        <OptionRow label={t("owner")}>
          <PermRow value={owner} onChange={setOwner} />
        </OptionRow>
        <OptionRow label={t("group")}>
          <PermRow value={group} onChange={setGroup} />
        </OptionRow>
        <OptionRow label={t("others")}>
          <PermRow value={others} onChange={setOthers} />
        </OptionRow>
      </SettingsCard>

      <StatStrip items={[
        { label: t("octal"), value: octal },
        { label: t("symbolic"), value: symbolic },
      ]} />

      <OutputPanel
        title={t("command")}
        text={command}
        copyLabel={t("copyCommand")}
        copySuccessMessage={t("copied")}
      />

      <SettingsCard>
        <OptionRow label="Enter octal:" htmlFor="chmod-octal-entry">
          <input id="chmod-octal-entry" type="text" maxLength={3} defaultValue={octal} onChange={(e) => handleOctalInput(e.target.value)}
            className="font-mono text-xl w-16 text-center border rounded px-2 py-1 bg-background" placeholder="644" />
        </OptionRow>
      </SettingsCard>
      </div>
    </ToolShell>
  );
}
