"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";

type BaseKey = "bin" | "oct" | "dec" | "hex";

const baseRadix: Record<BaseKey, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
};

const validators: Record<BaseKey, RegExp> = {
  bin: /^[01]+$/i,
  oct: /^[0-7]+$/i,
  dec: /^-?\d+$/,
  hex: /^[0-9a-f]+$/i,
};

export default function NumberBaseConverter() {
  const t = useTranslations("Tools.NumberBaseConverter");
  const tc = useTranslations("ToolsConfig");
  const [values, setValues] = useState<Record<BaseKey, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });
  const [errorBase, setErrorBase] = useState<BaseKey | null>(null);

  const updateAll = (from: BaseKey, raw: string) => {
    setErrorBase(null);
    if (!raw) {
      setValues({ bin: "", oct: "", dec: "", hex: "" });
      return;
    }

    const cleaned = raw.trim();
    const isValid = validators[from].test(cleaned);
    if (!isValid) {
      setErrorBase(from);
      setValues((prev) => ({ ...prev, [from]: cleaned }));
      return;
    }

    try {
      const num = parseInt(cleaned, baseRadix[from]);
      if (Number.isNaN(num)) throw new Error("Invalid number");

      setValues({
        bin: num.toString(2),
        oct: num.toString(8),
        dec: num.toString(10),
        hex: num.toString(16).toUpperCase(),
      });
    } catch (e) {
      toast.error(t("conversionFailed"));
    }
  };

  const clearAll = () => setValues({ bin: "", oct: "", dec: "", hex: "" });

  return (
    <ToolShell
      slug="number-base-converter"
      title={tc("tools.number-base-converter.name")}
      sub={tc("tools.number-base-converter.description")}
      controls={
        <Button variant="outline" size="sm" onClick={clearAll}>
          {t("clear")}
        </Button>
      }
    >
      <SettingsCard>
        <OptionRow label={t("binary")} htmlFor="bin">
          <Input
            id="bin"
            placeholder="e.g., 101011"
            value={values.bin}
            onChange={(e) => updateAll("bin", e.target.value)}
            className={errorBase === "bin" ? "border-destructive" : ""}
            dir="ltr"
          />
        </OptionRow>
        <OptionRow label={t("octal")} htmlFor="oct">
          <Input
            id="oct"
            placeholder="e.g., 53"
            value={values.oct}
            onChange={(e) => updateAll("oct", e.target.value)}
            className={errorBase === "oct" ? "border-destructive" : ""}
            dir="ltr"
          />
        </OptionRow>
        <OptionRow label={t("decimal")} htmlFor="dec">
          <Input
            id="dec"
            placeholder="e.g., 43"
            value={values.dec}
            onChange={(e) => updateAll("dec", e.target.value)}
            className={errorBase === "dec" ? "border-destructive" : ""}
            dir="ltr"
          />
        </OptionRow>
        <OptionRow label={t("hexadecimal")} htmlFor="hex">
          <Input
            id="hex"
            placeholder="e.g., 2B"
            value={values.hex}
            onChange={(e) => updateAll("hex", e.target.value)}
            className={errorBase === "hex" ? "border-destructive" : ""}
            dir="ltr"
          />
        </OptionRow>
      </SettingsCard>
    </ToolShell>
  );
}
