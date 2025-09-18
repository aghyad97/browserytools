"use client";

import { useMemo } from "react";
import {
  ChartType,
  ChartDataPoint,
  ChartSettings,
  THEME_PRESETS,
} from "@/types/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Radar,
  RadarChart as RechartsRadarChart,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface ChartRendererProps {
  chartType: ChartType;
  data: ChartDataPoint[];
  settings: ChartSettings;
}

export function ChartRenderer({
  chartType,
  data,
  settings,
}: ChartRendererProps) {
  // Determine category and numeric series keys to make charts robust to arbitrary data shapes
  const categoryKey = useMemo(() => {
    if (settings.categoryKey && settings.categoryKey in (data[0] || {})) {
      return settings.categoryKey;
    }
    const first = (data[0] || {}) as Record<string, unknown>;
    const keys = Object.keys(first);
    const stringKey = keys.find((k) => typeof (first as any)[k] === "string");
    return stringKey || keys[0];
  }, [data]);

  const seriesKeys = useMemo(() => {
    if (settings.seriesKeys && settings.seriesKeys.length) {
      return settings.seriesKeys.filter((k) => k in (data[0] || {}));
    }
    const first = (data[0] || {}) as Record<string, unknown>;
    const keys = Object.keys(first).filter(
      (k) => k !== categoryKey && typeof (first as any)[k] === "number"
    );
    return keys;
  }, [data, categoryKey, settings.seriesKeys, settings.categoryKey]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};

    seriesKeys.forEach((key, index) => {
      let color: string;

      if (
        settings.colorScheme === "custom" &&
        settings.customColors.length > 0
      ) {
        color = settings.customColors[index % settings.customColors.length];
      } else if (settings.colorScheme === "preset") {
        const preset = THEME_PRESETS.find((p) => p.id === settings.themePreset);
        color =
          preset?.colors[index % preset.colors.length] ||
          `hsl(var(--chart-${(index % 5) + 1}))`;
      } else {
        color = `hsl(var(--chart-${(index % 5) + 1}))`;
      }

      config[key] = {
        label: key,
        color: color,
      };
    });

    return config;
  }, [
    seriesKeys,
    settings.colorScheme,
    settings.customColors,
    settings.themePreset,
  ]);

  const gridStroke =
    settings.gridColor && settings.gridColor !== ""
      ? settings.gridColor
      : undefined;

  const renderAreaChart = () => (
    <ChartContainer config={chartConfig}>
      <RechartsAreaChart data={data}>
        {settings.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        )}
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {settings.showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {seriesKeys.map((key) => (
          <Area
            key={key}
            type={settings.areaSettings?.smooth ? "monotone" : "linear"}
            dataKey={key}
            stroke={`var(--color-${key})`}
            fill={`var(--color-${key})`}
            fillOpacity={settings.areaSettings?.fillOpacity || 0.6}
            strokeWidth={settings.areaSettings?.strokeWidth || 2}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );

  const renderBarChart = () => {
    return (
      <ChartContainer config={chartConfig}>
        <RechartsBarChart
          data={data}
          layout={settings.barSettings?.horizontal ? "horizontal" : "vertical"}
          margin={{
            left: settings.barSettings?.horizontal ? -20 : 0,
            right: 20,
            top: 20,
            bottom: 20,
          }}
          barCategoryGap={settings.barSettings?.barGap || 4}
        >
          {settings.showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          )}
          {settings.barSettings?.horizontal ? (
            <>
              <XAxis type="number" hide />
              <YAxis
                dataKey={categoryKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={categoryKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis type="number" tickLine={false} axisLine={false} />
            </>
          )}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel={settings.barSettings?.horizontal}
              />
            }
          />
          {settings.showLegend && (
            <ChartLegend content={<ChartLegendContent />} />
          )}
          {seriesKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={
                chartConfig[key]?.color ||
                `hsl(var(--chart-${(index % 5) + 1}))`
              }
              radius={5}
              maxBarSize={settings.barSettings?.barWidth || 20}
            />
          ))}
        </RechartsBarChart>
      </ChartContainer>
    );
  };

  const renderLineChart = () => (
    <ChartContainer config={chartConfig}>
      <RechartsLineChart data={data}>
        {settings.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        )}
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {settings.showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {seriesKeys.map((key) => (
          <Line
            key={key}
            type={settings.lineSettings?.smooth ? "monotone" : "linear"}
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={settings.lineSettings?.strokeWidth || 2}
            dot={
              settings.lineSettings?.showDots
                ? { r: settings.lineSettings?.dotSize || 4 }
                : false
            }
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );

  const resolveSeriesColorAtIndex = (index: number): string => {
    if (settings.colorScheme === "custom" && settings.customColors.length > 0) {
      return settings.customColors[index % settings.customColors.length];
    }
    if (settings.colorScheme === "preset") {
      const preset = THEME_PRESETS.find((p) => p.id === settings.themePreset);
      if (preset) return preset.colors[index % preset.colors.length];
    }
    return `hsl(var(--chart-${(index % 5) + 1}))`;
  };

  const renderPieChart = () => {
    const valueKey = seriesKeys[0];
    const pieData = data.map((item, index) => ({
      ...item,
      fill: resolveSeriesColorAtIndex(index),
    }));

    return (
      <RechartsPieChart>
        <Pie
          data={pieData}
          dataKey={valueKey}
          nameKey={categoryKey}
          cx="50%"
          cy="50%"
          innerRadius={settings.pieSettings?.innerRadius || 0}
          outerRadius={settings.pieSettings?.outerRadius || 80}
          label={settings.pieSettings?.showLabels}
          labelLine={settings.pieSettings?.labelPosition === "outside"}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        {settings.showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </RechartsPieChart>
    );
  };

  const renderRadarChart = () => (
    <RechartsRadarChart data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey={categoryKey} />
      <PolarRadiusAxis
        angle={90}
        domain={settings.radarSettings?.domain || [0, 100]}
        tickCount={settings.radarSettings?.ticks || 5}
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      {settings.showLegend && <ChartLegend content={<ChartLegendContent />} />}
      {seriesKeys.map((key) => (
        <Radar
          key={key}
          dataKey={key}
          stroke={chartConfig[key]?.color}
          fill={chartConfig[key]?.color}
          fillOpacity={0.6}
          dot={settings.radarSettings?.showDots}
        />
      ))}
    </RechartsRadarChart>
  );

  const renderRadialChart = () => {
    const valueKey = seriesKeys[0];
    const radialData = data.map((item, index) => ({
      ...item,
      fill: resolveSeriesColorAtIndex(index),
    }));

    return (
      <RechartsRadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={settings.radialSettings?.innerRadius || 0}
        outerRadius={settings.radialSettings?.outerRadius || 80}
        startAngle={settings.radialSettings?.startAngle || 0}
        endAngle={settings.radialSettings?.endAngle || 360}
        data={radialData}
      >
        <RadialBar
          dataKey={valueKey}
          label={settings.radialSettings?.showLabels}
        >
          {radialData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </RadialBar>
        <ChartTooltip content={<ChartTooltipContent />} />
        {settings.showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </RechartsRadialBarChart>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return renderAreaChart();
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      case "radar":
        return renderRadarChart();
      case "radial":
        return renderRadialChart();
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            Please add some data to create your chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        {settings.title && (
          <div
            className="font-semibold"
            style={{ color: settings.titleColor || undefined }}
          >
            {settings.title}
          </div>
        )}
        {settings.subtitle && (
          <div
            className="text-sm"
            style={{ color: settings.subtitleColor || undefined }}
          >
            {settings.subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          maxWidth: "100%",
          width: "100%",
          height: `${Math.max(settings.height, 300)}px`,
          minHeight: "300px",
        }}
      >
        {renderChart()}
      </div>
    </div>
  );
}
