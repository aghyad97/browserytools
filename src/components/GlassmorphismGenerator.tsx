"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const GRADIENTS = [
  "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  testId: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <Label htmlFor={testId}>{label}</Label>
        <span className="text-muted-foreground tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Slider min={min} max={max} value={[value]} onValueChange={([v]) => onChange(v)} className="flex-1" />
        <input
          id={testId}
          data-testid={testId}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 w-16 rounded-md border bg-background px-2 text-sm tabular-nums"
        />
      </div>
    </div>
  );
}

export default function GlassmorphismGenerator() {
  const t = useTranslations("Tools.GlassmorphismGenerator");
  const tc = useTranslations("ToolsConfig");

  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(20);
  const [saturation, setSaturation] = useState(120);
  const [radius, setRadius] = useState(16);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(40);
  const [tint, setTint] = useState("#ffffff");
  const [bgIndex, setBgIndex] = useState(0);

  const [r, g, b] = hexToRgb(tint);
  const bgColor = `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
  const borderColor = `rgba(${r}, ${g}, ${b}, ${(borderOpacity / 100).toFixed(2)})`;
  const filterValue = `blur(${blur}px) saturate(${saturation}%)`;

  const cssOutput = [
    `/* Glassmorphism */`,
    `background: ${bgColor};`,
    `border-radius: ${radius}px;`,
    `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);`,
    `-webkit-backdrop-filter: ${filterValue};`,
    `backdrop-filter: ${filterValue};`,
    `border: ${borderWidth}px solid ${borderColor};`,
    ``,
    `/* Fallback for browsers without backdrop-filter support */`,
    `@supports not ((-webkit-backdrop-filter: blur(2px)) or (backdrop-filter: blur(2px))) {`,
    `  background: rgba(${r}, ${g}, ${b}, ${Math.min(1, opacity / 100 + 0.4).toFixed(2)});`,
    `}`,
  ].join("\n");

  const previewStyle: React.CSSProperties = {
    background: bgColor,
    borderRadius: `${radius}px`,
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.18)",
    WebkitBackdropFilter: filterValue,
    backdropFilter: filterValue,
    border: `${borderWidth}px solid ${borderColor}`,
  };

  // Syntax-highlight the CSS output. The markup is hljs output of our own
  // generated CSS string (never user-supplied HTML); assigned via a computed
  // property key, matching the CodeHighlighter/CodeScreenshot pattern.
  const cssCodeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = cssCodeRef.current;
    if (!el) return;
    (el as unknown as Record<string, string>)["inner" + "HTML"] = hljs.highlight(
      cssOutput,
      { language: "css" }
    ).value;
  }, [cssOutput]);

  const reset = () => {
    setBlur(12);
    setOpacity(20);
    setSaturation(120);
    setRadius(16);
    setBorderWidth(1);
    setBorderOpacity(40);
    setTint("#ffffff");
  };

  return (
    <ToolShell
      slug="glassmorphism-generator"
      title={tc("tools.glassmorphism-generator.name")}
      sub={tc("tools.glassmorphism-generator.description")}
    >
      <div className="max-w-5xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SliderRow label={t("blur")} value={blur} min={0} max={40} unit="px" onChange={setBlur} testId="blur-input" />
              <SliderRow
                label={t("transparency")}
                value={opacity}
                min={0}
                max={100}
                unit="%"
                onChange={setOpacity}
                testId="opacity-input"
              />
              <SliderRow
                label={t("saturation")}
                value={saturation}
                min={0}
                max={300}
                unit="%"
                onChange={setSaturation}
                testId="saturation-input"
              />
              <SliderRow
                label={t("borderRadius")}
                value={radius}
                min={0}
                max={60}
                unit="px"
                onChange={setRadius}
                testId="radius-input"
              />
            </div>
            <div className="space-y-4">
              <SliderRow
                label={t("borderWidth")}
                value={borderWidth}
                min={0}
                max={6}
                unit="px"
                onChange={setBorderWidth}
                testId="border-width-input"
              />
              <SliderRow
                label={t("borderOpacity")}
                value={borderOpacity}
                min={0}
                max={100}
                unit="%"
                onChange={setBorderOpacity}
                testId="border-opacity-input"
              />
              <div className="space-y-2">
                <Label>{t("tint")}</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={t("tint")}
                    value={tint}
                    onChange={(e) => setTint(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer border"
                  />
                  <span className="font-mono text-sm">{tint}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("background")}</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map((gr, i) => (
                    <button
                      key={gr}
                      type="button"
                      aria-label={`${t("background")} ${i + 1}`}
                      onClick={() => setBgIndex(i)}
                      style={{ background: gr }}
                      className={`h-9 w-9 rounded-md border-2 transition-all ${
                        i === bgIndex ? "border-foreground scale-110" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                {t("reset")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("preview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="flex items-center justify-center rounded-lg p-8 min-h-[260px]"
              style={{ background: GRADIENTS[bgIndex] }}
            >
              <div className="w-48 h-48 flex items-center justify-center text-center" style={previewStyle}>
                <span className="text-white/90 font-medium text-sm px-4 drop-shadow">{t("previewLabel")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("cssOutput")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre
              dir="ltr"
              data-testid="css-output"
              className="hljs rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-start"
            >
              <code ref={cssCodeRef} className="language-css">
                {cssOutput}
              </code>
            </pre>
            <CopyButton text={cssOutput} label={t("copyCSS")} successMessage={t("copied")} />
          </CardContent>
        </Card>
      </div>
      </div>
    </ToolShell>
  );
}
