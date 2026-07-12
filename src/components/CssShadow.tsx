"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";
import { OutputPanel } from "@/components/shared/OutputPanel";

interface ShadowLayer { id: number; h: number; v: number; blur: number; spread: number; color: string; opacity: number; inset: boolean }

// content value: default shadow color, independent of app theme.
const DEFAULT: Omit<ShadowLayer, "id"> = { h: 4, v: 4, blur: 10, spread: 0, color: "#000000", opacity: 25, inset: false };
let nextId = 1;

function layerToCss(l: ShadowLayer): string {
  const alpha = Math.round((l.opacity / 100) * 255).toString(16).padStart(2, "0");
  return `${l.inset ? "inset " : ""}${l.h}px ${l.v}px ${l.blur}px ${l.spread}px ${l.color}${alpha}`;
}

export default function CssShadow() {
  const t = useTranslations("Tools.CssShadow");
  const tc = useTranslations("ToolsConfig");
  const [layers, setLayers] = useState<ShadowLayer[]>([{ id: nextId++, ...DEFAULT }]);
  const [active, setActive] = useState(0);
  const layer = layers[active];

  const cssValue = layers.map(layerToCss).join(",\n  ");
  const cssOutput = `box-shadow: ${cssValue};`;

  const update = (patch: Partial<ShadowLayer>) =>
    setLayers((prev) => prev.map((l, i) => (i === active ? { ...l, ...patch } : l)));

  return (
    <ToolShell
      slug="css-shadow"
      title={tc("tools.css-shadow.name")}
      sub={tc("tools.css-shadow.description")}
    >
      <div className="max-w-4xl mx-auto space-y-4">
      <SettingsCard>
          {/* Layer switcher: dynamic add/remove list, no existing translation
              key fits ModePicker's required aria-label — kept bespoke (same
              rationale as SvgBlobGenerator's mode toggle). */}
          <div className="flex gap-2 flex-wrap">
            {layers.map((l, i) => (
              <button key={l.id} onClick={() => setActive(i)}
                className={`px-3 py-1 rounded text-sm border transition-colors ${i === active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}>
                Layer {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => { setLayers(p => [...p, { id: nextId++, ...DEFAULT }]); setActive(layers.length); }}>{t("addShadow")}</Button>
            {layers.length > 1 && <Button variant="outline" size="sm" onClick={() => { setLayers(p => p.filter((_, i) => i !== active)); setActive(Math.min(active, layers.length - 2)); }}>{t("removeShadow")}</Button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SliderRow label={t("horizontalOffset")} value={layer.h} display={<>{layer.h}px</>} min={-50} max={50} onChange={(v) => update({ h: v })} />
              <SliderRow label={t("verticalOffset")} value={layer.v} display={<>{layer.v}px</>} min={-50} max={50} onChange={(v) => update({ v: v })} />
              <SliderRow label={t("blurRadius")} value={layer.blur} display={<>{layer.blur}px</>} min={0} max={100} onChange={(v) => update({ blur: v })} />
              <SliderRow label={t("spreadRadius")} value={layer.spread} display={<>{layer.spread}px</>} min={-50} max={50} onChange={(v) => update({ spread: v })} />
              <SliderRow label="Opacity" value={layer.opacity} display={<>{layer.opacity}%</>} min={0} max={100} onChange={(v) => update({ opacity: v })} />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("shadowColor")}</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={layer.color} onChange={(e) => update({ color: e.target.value })} className="h-10 w-20 rounded cursor-pointer border" />
                  <span className="font-mono text-sm">{layer.color}</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={layer.inset} onChange={(e) => update({ inset: e.target.checked })} className="rounded" />
                {t("inset")}
              </label>
            </div>
          </div>
      </SettingsCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{t("preview")}</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <div className="w-32 h-32 bg-card rounded-lg border" style={{ boxShadow: layers.map(layerToCss).join(", ") }} />
          </CardContent>
        </Card>
        <OutputPanel title={t("cssOutput")} text={cssOutput} copyLabel={t("copyCSS")} copySuccessMessage={t("copied")} />
      </div>
      </div>
    </ToolShell>
  );
}
