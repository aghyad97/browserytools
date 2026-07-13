"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/\.?0+$/, "");
}

interface CalcSection {
  title: string;
  inputs: { label: string; key: string; placeholder: string }[];
  calculate: (vals: Record<string, number>) => { label: string; value: string }[];
}

export default function PercentageCalculator() {
  const t = useTranslations("Tools.PercentageCalculator");
  const tc = useTranslations("ToolsConfig");
  const [vals, setVals] = useState<Record<string, string>>({});

  const get = (key: string) => parseFloat(vals[key] ?? "") || 0;
  const set = (key: string, value: string) => setVals((prev) => ({ ...prev, [key]: value }));

  const sections: CalcSection[] = [
    {
      title: t("sections.whatIsXofY"),
      inputs: [
        { label: t("inputs.percentageX"), key: "pct1_x", placeholder: "25" },
        { label: t("inputs.numberY"), key: "pct1_y", placeholder: "200" },
      ],
      calculate: () => [{ label: t("result"), value: fmt((get("pct1_x") / 100) * get("pct1_y")) }],
    },
    {
      title: t("sections.xIsWhatPctOfY"),
      inputs: [
        { label: t("inputs.numberX"), key: "pct2_x", placeholder: "50" },
        { label: t("inputs.numberY"), key: "pct2_y", placeholder: "200" },
      ],
      calculate: () => [
        { label: t("percentage"), value: fmt(get("pct2_y") !== 0 ? (get("pct2_x") / get("pct2_y")) * 100 : Infinity) + "%" },
      ],
    },
    {
      title: t("sections.percentageChange"),
      inputs: [
        { label: t("inputs.originalValue"), key: "chg_from", placeholder: "100" },
        { label: t("inputs.newValue"), key: "chg_to", placeholder: "125" },
      ],
      calculate: () => {
        const from = get("chg_from");
        const to = get("chg_to");
        const pct = from !== 0 ? ((to - from) / Math.abs(from)) * 100 : Infinity;
        return [
          { label: pct >= 0 ? t("increase") : t("decrease"), value: fmt(Math.abs(pct)) + "%" },
          { label: t("difference"), value: fmt(to - from) },
        ];
      },
    },
    {
      title: t("sections.addSubtractPct"),
      inputs: [
        { label: t("inputs.baseNumber"), key: "add_base", placeholder: "100" },
        { label: t("percentage"), key: "add_pct", placeholder: "20" },
      ],
      calculate: () => {
        const base = get("add_base");
        const pct = get("add_pct");
        const inc = base * (1 + pct / 100);
        const dec = base * (1 - pct / 100);
        return [
          { label: `${t("after")} +${fmt(pct)}%`, value: fmt(inc) },
          { label: `${t("after")} -${fmt(pct)}%`, value: fmt(dec) },
        ];
      },
    },
    {
      title: t("sections.reversePct"),
      inputs: [
        { label: t("inputs.finalValue"), key: "rev_final", placeholder: "120" },
        { label: t("inputs.percentageAdded"), key: "rev_pct", placeholder: "20" },
      ],
      calculate: () => {
        const final = get("rev_final");
        const pct = get("rev_pct");
        return [{ label: t("inputs.originalValue"), value: fmt(final / (1 + pct / 100)) }];
      },
    },
  ];

  return (
    <ToolShell
      slug="percentage-calculator"
      title={tc("tools.percentage-calculator.name")}
      sub={tc("tools.percentage-calculator.description")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const results = section.calculate({});
          return (
            <SettingsCard key={section.title} title={section.title}>
              {section.inputs.map((input) => (
                <OptionRow key={input.key} label={input.label} htmlFor={input.key}>
                  <Input
                    id={input.key}
                    type="number"
                    placeholder={input.placeholder}
                    value={vals[input.key] ?? ""}
                    onChange={(e) => set(input.key, e.target.value)}
                    dir="ltr"
                  />
                </OptionRow>
              ))}
              <StatStrip items={results.map((r) => ({ label: r.label, value: r.value }))} />
            </SettingsCard>
          );
        })}
      </div>
    </ToolShell>
  );
}
