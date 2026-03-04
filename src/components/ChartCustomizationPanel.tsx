"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChartSettings, THEME_PRESETS } from "@/types/chart";
import type { ChartType } from "@/types/chart";
// No inner cards here; this component is rendered inside an outer Card
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Settings, Type, Layout } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

interface ChartCustomizationPanelProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
  dataKeys: string[];
  chartType: ChartType;
}

export function ChartCustomizationPanel({
  settings,
  onSettingsChange,
  dataKeys,
  chartType,
}: ChartCustomizationPanelProps) {
  const t = useTranslations("Tools.Charts");
  const [customColor, setCustomColor] = useState("#3b82f6");

  const updateSetting = <K extends keyof ChartSettings>(
    key: K,
    value: ChartSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const updateNestedSetting = <K extends keyof ChartSettings>(
    key: K,
    nestedKey: string,
    value: any
  ) => {
    const nestedSettings = settings[key] as any;
    onSettingsChange({
      ...settings,
      [key]: {
        ...nestedSettings,
        [nestedKey]: value,
      },
    });
  };

  const addCustomColor = () => {
    if (customColor && !settings.customColors.includes(customColor)) {
      const newColors = [...settings.customColors, customColor];
      updateSetting("customColors", newColors);
      toast.success(t("colorAddedToPalette"));
    }
  };

  const removeCustomColor = (color: string) => {
    const newColors = settings.customColors.filter((c) => c !== color);
    updateSetting("customColors", newColors);
  };

  const applyThemePreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    // Apply all related changes in ONE update to avoid clobbering previous updates
    onSettingsChange({
      ...settings,
      colorScheme: "preset",
      themePreset: presetId,
      // keep customColors in sync for display purposes
      customColors: preset.colors,
    });
    toast.success(t("appliedTheme", { name: preset.name }));
  };

  const getColorForDataKey = (key: string, index: number): string => {
    if (settings.colorScheme === "custom" && settings.customColors.length > 0) {
      return settings.customColors[index % settings.customColors.length];
    }

    if (settings.colorScheme === "preset") {
      const preset = THEME_PRESETS.find((p) => p.id === settings.themePreset);
      if (preset) {
        return preset.colors[index % preset.colors.length];
      }
    }

    // Default colors
    const defaultColors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];
    return defaultColors[index % defaultColors.length];
  };

  const applyThemeOrderToCustom = () => {
    const preset =
      THEME_PRESETS.find((p) => p.id === settings.themePreset) ||
      THEME_PRESETS[0];
    const newColors = [...preset.colors];
    onSettingsChange({
      ...settings,
      colorScheme: "custom",
      customColors: newColors,
    });
    toast.success(t("appliedThemeInOrder"));
  };

  const applyThemeRandomToCustom = () => {
    const preset =
      THEME_PRESETS.find((p) => p.id === settings.themePreset) ||
      THEME_PRESETS[0];
    const shuffled = [...preset.colors].sort(() => Math.random() - 0.5);
    onSettingsChange({
      ...settings,
      colorScheme: "custom",
      customColors: shuffled,
    });
    toast.success(t("appliedThemeRandomized"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t("customizationHeading")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("customizationSubtitle")}
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            {t("tabGeneral")}
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            {t("tabColors")}
          </TabsTrigger>
          <TabsTrigger value="text">
            <Type className="h-4 w-4 mr-2" />
            {t("tabText")}
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            {t("tabLayout")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">{t("chartTitleLabel")}</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => updateSetting("title", e.target.value)}
                  placeholder={t("chartTitlePlaceholder")}
                />
                <div className="mt-2">
                  <Label>{t("titleColor")}</Label>
                  <Input
                    type="color"
                    value={settings.titleColor || "#000000"}
                    onChange={(e) =>
                      updateSetting("titleColor", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subtitle">{t("subtitleLabel")}</Label>
                <Input
                  id="subtitle"
                  value={settings.subtitle || ""}
                  onChange={(e) => updateSetting("subtitle", e.target.value)}
                  placeholder={t("subtitlePlaceholder")}
                />
                <div className="mt-2">
                  <Label>{t("subtitleColor")}</Label>
                  <Input
                    type="color"
                    value={settings.subtitleColor || "#666666"}
                    onChange={(e) =>
                      updateSetting("subtitleColor", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">{t("widthPx")}</Label>
                <Input
                  id="width"
                  type="number"
                  value={settings.width}
                  onChange={(e) =>
                    updateSetting("width", parseInt(e.target.value) || 800)
                  }
                  min="200"
                  max="2000"
                />
              </div>
              <div>
                <Label htmlFor="height">{t("heightPx")}</Label>
                <Input
                  id="height"
                  type="number"
                  value={settings.height}
                  onChange={(e) =>
                    updateSetting("height", parseInt(e.target.value) || 400)
                  }
                  min="200"
                  max="2000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-legend">{t("showLegend")}</Label>
                <Switch
                  id="show-legend"
                  checked={settings.showLegend}
                  onCheckedChange={(checked) =>
                    updateSetting("showLegend", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-tooltip">{t("showTooltip")}</Label>
                <Switch
                  id="show-tooltip"
                  checked={settings.showTooltip}
                  onCheckedChange={(checked) =>
                    updateSetting("showTooltip", checked)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid">{t("showGrid")}</Label>
                  <Switch
                    id="show-grid"
                    checked={settings.showGrid}
                    onCheckedChange={(checked) =>
                      updateSetting("showGrid", checked)
                    }
                  />
                </div>
                <div
                  className={
                    !settings.showGrid ? "opacity-50 pointer-events-none" : ""
                  }
                >
                  <Label>{t("gridColor")}</Label>
                  <Input
                    type="color"
                    value={settings.gridColor || "#e5e7eb"}
                    onChange={(e) => updateSetting("gridColor", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>{t("colorScheme")}</Label>
              <Select
                value={settings.colorScheme}
                onValueChange={(value: "default" | "custom" | "preset") =>
                  updateSetting("colorScheme", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("colorSchemeDefault")}</SelectItem>
                  <SelectItem value="preset">{t("colorSchemePreset")}</SelectItem>
                  <SelectItem value="custom">{t("colorSchemeCustom")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.colorScheme === "preset" && (
              <div>
                <Label>{t("themePresets")}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {THEME_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={
                        settings.themePreset === preset.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => applyThemePreset(preset.id)}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {preset.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={applyThemeOrderToCustom}
                  >
                    {t("useInOrder")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={applyThemeRandomToCustom}
                  >
                    {t("randomizeFromTheme")}
                  </Button>
                </div>
              </div>
            )}

            {settings.colorScheme === "custom" && (
              <div className="space-y-4">
                <div>
                  <Label>{t("seriesColors")}</Label>
                  <div className="space-y-2 mt-2">
                    {dataKeys.map((key, index) => {
                      const current =
                        settings.customColors[index] ||
                        getColorForDataKey(key, index);
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm truncate">{key}</span>
                          <Input
                            type="color"
                            value={
                              /^#|rgb|hsl/.test(String(current))
                                ? String(current)
                                : "#000000"
                            }
                            onChange={(e) => {
                              const updated = [...settings.customColors];
                              updated[index] = e.target.value;
                              onSettingsChange({
                                ...settings,
                                colorScheme: "custom",
                                customColors: updated,
                              });
                            }}
                            className="h-6 w-6 p-0 border rounded-md"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Removed duplicate Data Series Colors section */}
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x-axis-label">{t("xAxisLabel")}</Label>
                <Input
                  id="x-axis-label"
                  value={settings.xAxisLabel || ""}
                  onChange={(e) => updateSetting("xAxisLabel", e.target.value)}
                  placeholder={t("xAxisPlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="y-axis-label">{t("yAxisLabel")}</Label>
                <Input
                  id="y-axis-label"
                  value={settings.yAxisLabel || ""}
                  onChange={(e) => updateSetting("yAxisLabel", e.target.value)}
                  placeholder={t("yAxisPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-x-axis">{t("showXAxis")}</Label>
                <Switch
                  id="show-x-axis"
                  checked={settings.showXAxis}
                  onCheckedChange={(checked) =>
                    updateSetting("showXAxis", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-y-axis">{t("showYAxis")}</Label>
                <Switch
                  id="show-y-axis"
                  checked={settings.showYAxis}
                  onCheckedChange={(checked) =>
                    updateSetting("showYAxis", checked)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-4">
            {/* Area Chart Settings */}
            {chartType === "area" && settings.areaSettings && (
              <div>
                <div className="space-y-3">
                  <div>
                    <Label>
                      {t("fillOpacity", { val: settings.areaSettings.fillOpacity })}
                    </Label>
                    <Slider
                      value={[settings.areaSettings.fillOpacity]}
                      onValueChange={([value]) =>
                        updateNestedSetting(
                          "areaSettings",
                          "fillOpacity",
                          value
                        )
                      }
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>
                      {t("strokeWidth", { val: settings.areaSettings.strokeWidth })}
                    </Label>
                    <Slider
                      value={[settings.areaSettings.strokeWidth]}
                      onValueChange={([value]) =>
                        updateNestedSetting(
                          "areaSettings",
                          "strokeWidth",
                          value
                        )
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="area-smooth">{t("smoothCurves")}</Label>
                    <Switch
                      id="area-smooth"
                      checked={settings.areaSettings.smooth}
                      onCheckedChange={(checked) =>
                        updateNestedSetting("areaSettings", "smooth", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bar Chart Settings */}
            {chartType === "bar" && settings.barSettings && (
              <div>
                <h4 className="font-medium mb-3">{t("barChartHeading")}</h4>
                <div className="space-y-3">
                  <div>
                    <Label>{t("barWidth", { val: settings.barSettings.barWidth })}</Label>
                    <Slider
                      value={[settings.barSettings.barWidth]}
                      onValueChange={([value]) =>
                        updateNestedSetting("barSettings", "barWidth", value)
                      }
                      max={100}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("barGap", { val: settings.barSettings.barGap })}</Label>
                    <Slider
                      value={[settings.barSettings.barGap]}
                      onValueChange={([value]) =>
                        updateNestedSetting("barSettings", "barGap", value)
                      }
                      max={50}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Line Chart Settings */}
            {chartType === "line" && settings.lineSettings && (
              <div>
                <h4 className="font-medium mb-3">{t("lineChartHeading")}</h4>
                <div className="space-y-3">
                  <div>
                    <Label>
                      {t("lineStrokeWidth", { val: settings.lineSettings.strokeWidth })}
                    </Label>
                    <Slider
                      value={[settings.lineSettings.strokeWidth]}
                      onValueChange={([value]) =>
                        updateNestedSetting(
                          "lineSettings",
                          "strokeWidth",
                          value
                        )
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("dotSize", { val: settings.lineSettings.dotSize })}</Label>
                    <Slider
                      value={[settings.lineSettings.dotSize]}
                      onValueChange={([value]) =>
                        updateNestedSetting("lineSettings", "dotSize", value)
                      }
                      max={10}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-smooth">{t("smoothLines")}</Label>
                    <Switch
                      id="line-smooth"
                      checked={settings.lineSettings.smooth}
                      onCheckedChange={(checked) =>
                        updateNestedSetting("lineSettings", "smooth", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-dots">{t("showDots")}</Label>
                    <Switch
                      id="line-dots"
                      checked={settings.lineSettings.showDots}
                      onCheckedChange={(checked) =>
                        updateNestedSetting("lineSettings", "showDots", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pie/Radial Settings */}
            {chartType === "pie" && settings.pieSettings && (
              <div>
                <h4 className="font-medium mb-3">{t("pieChartHeading")}</h4>
                <div className="space-y-3">
                  <div>
                    <Label>
                      {t("pieInnerRadius", { val: settings.pieSettings.innerRadius })}
                    </Label>
                    <Slider
                      value={[settings.pieSettings.innerRadius]}
                      onValueChange={([value]) =>
                        updateNestedSetting("pieSettings", "innerRadius", value)
                      }
                      max={80}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>
                      {t("pieOuterRadius", { val: settings.pieSettings.outerRadius })}
                    </Label>
                    <Slider
                      value={[settings.pieSettings.outerRadius]}
                      onValueChange={([value]) =>
                        updateNestedSetting("pieSettings", "outerRadius", value)
                      }
                      max={100}
                      min={20}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("labelPosition")}</Label>
                    <Select
                      value={settings.pieSettings.labelPosition}
                      onValueChange={(value: "inside" | "outside" | "center") =>
                        updateNestedSetting(
                          "pieSettings",
                          "labelPosition",
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside">{t("labelInside")}</SelectItem>
                        <SelectItem value="outside">{t("labelOutside")}</SelectItem>
                        <SelectItem value="center">{t("labelCenter")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pie-labels">{t("showLabels")}</Label>
                    <Switch
                      id="pie-labels"
                      checked={settings.pieSettings.showLabels}
                      onCheckedChange={(checked) =>
                        updateNestedSetting(
                          "pieSettings",
                          "showLabels",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {chartType === "radial" && settings.radialSettings && (
              <div>
                <h4 className="font-medium mb-3">{t("radialChartHeading")}</h4>
                <div className="space-y-3">
                  <div>
                    <Label>
                      {t("radialInnerRadius", { val: settings.radialSettings.innerRadius })}
                    </Label>
                    <Slider
                      value={[settings.radialSettings.innerRadius]}
                      onValueChange={([value]) =>
                        updateNestedSetting(
                          "radialSettings",
                          "innerRadius",
                          value
                        )
                      }
                      max={80}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>
                      {t("radialOuterRadius", { val: settings.radialSettings.outerRadius })}
                    </Label>
                    <Slider
                      value={[settings.radialSettings.outerRadius]}
                      onValueChange={([value]) =>
                        updateNestedSetting(
                          "radialSettings",
                          "outerRadius",
                          value
                        )
                      }
                      max={100}
                      min={20}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("angles")}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Slider
                        value={[settings.radialSettings.startAngle]}
                        onValueChange={([value]) =>
                          updateNestedSetting(
                            "radialSettings",
                            "startAngle",
                            value
                          )
                        }
                        max={360}
                        min={0}
                        step={5}
                      />
                      <Slider
                        value={[settings.radialSettings.endAngle]}
                        onValueChange={([value]) =>
                          updateNestedSetting(
                            "radialSettings",
                            "endAngle",
                            value
                          )
                        }
                        max={360}
                        min={0}
                        step={5}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="radial-labels">{t("showLabels")}</Label>
                    <Switch
                      id="radial-labels"
                      checked={settings.radialSettings.showLabels}
                      onCheckedChange={(checked) =>
                        updateNestedSetting(
                          "radialSettings",
                          "showLabels",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
