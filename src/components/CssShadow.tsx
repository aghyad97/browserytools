"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ShadowLayer { id: number; h: number; v: number; blur: number; spread: number; color: string; opacity: number; inset: boolean }

const DEFAULT: Omit<ShadowLayer, "id"> = { h: 4, v: 4, blur: 10, spread: 0, color: "#000000", opacity: 25, inset: false };
let nextId = 1;

function layerToCss(l: ShadowLayer): string {
  const alpha = Math.round((l.opacity / 100) * 255).toString(16).padStart(2, "0");
  return `${l.inset ? "inset " : ""}${l.h}px ${l.v}px ${l.blur}px ${l.spread}px ${l.color}${alpha}`;
}

export default function CssShadow() {
  const t = useTranslations("Tools.CssShadow");
  const [layers, setLayers] = useState<ShadowLayer[]>([{ id: nextId++, ...DEFAULT }]);
  const [active, setActive] = useState(0);
  const layer = layers[active];

  const cssValue = layers.map(layerToCss).join(",\n  ");
  const cssOutput = `box-shadow: ${cssValue};`;

  const update = (patch: Partial<ShadowLayer>) =>
    setLayers((prev) => prev.map((l, i) => (i === active ? { ...l, ...patch } : l)));

  const SR = ({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-muted-foreground tabular-nums">{value}px</span>
      </div>
      <Slider min={min} max={max} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <SR label={t("horizontalOffset")} value={layer.h} min={-50} max={50} onChange={(v) => update({ h: v })} />
              <SR label={t("verticalOffset")} value={layer.v} min={-50} max={50} onChange={(v) => update({ v: v })} />
              <SR label={t("blurRadius")} value={layer.blur} min={0} max={100} onChange={(v) => update({ blur: v })} />
              <SR label={t("spreadRadius")} value={layer.spread} min={-50} max={50} onChange={(v) => update({ spread: v })} />
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><Label>Opacity</Label><span className="text-muted-foreground tabular-nums">{layer.opacity}%</span></div>
                <Slider min={0} max={100} value={[layer.opacity]} onValueChange={([v]) => update({ opacity: v })} />
              </div>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{t("preview")}</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <div className="w-32 h-32 bg-card rounded-lg border" style={{ boxShadow: layers.map(layerToCss).join(", ") }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{t("cssOutput")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{cssOutput}</pre>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(cssOutput); toast.success(t("copied")); }}>{t("copyCSS")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
