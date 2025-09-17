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
  ResponsiveContainer,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};

    // Get data keys (excluding the first key which is usually the category)
    const dataKeys = Object.keys(data[0] || {}).slice(1);

    dataKeys.forEach((key, index) => {
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
  }, [data, settings]);

  const dataKeys = useMemo(() => {
    return Object.keys(data[0] || {}).slice(1);
  }, [data]);

  const renderAreaChart = () => (
    <RechartsAreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={Object.keys(data[0] || {})[0]} />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      {settings.showLegend && <ChartLegend content={<ChartLegendContent />} />}
      {dataKeys.map((key, index) => (
        <Area
          key={key}
          type={settings.areaSettings?.smooth ? "monotone" : "linear"}
          dataKey={key}
          stroke={chartConfig[key]?.color}
          fill={chartConfig[key]?.color}
          fillOpacity={settings.areaSettings?.fillOpacity || 0.6}
          strokeWidth={settings.areaSettings?.strokeWidth || 2}
        />
      ))}
    </RechartsAreaChart>
  );

  const renderBarChart = () => (
    <RechartsBarChart
      data={data}
      layout={settings.barSettings?.horizontal ? "horizontal" : "vertical"}
    >
      <CartesianGrid strokeDasharray="3 3" />
      {settings.barSettings?.horizontal ? (
        <>
          <XAxis type="number" />
          <YAxis dataKey={Object.keys(data[0] || {})[0]} type="category" />
        </>
      ) : (
        <>
          <XAxis dataKey={Object.keys(data[0] || {})[0]} />
          <YAxis />
        </>
      )}
      <ChartTooltip content={<ChartTooltipContent />} />
      {settings.showLegend && <ChartLegend content={<ChartLegendContent />} />}
      {dataKeys.map((key, index) => (
        <Bar
          key={key}
          dataKey={key}
          fill={chartConfig[key]?.color}
          maxBarSize={settings.barSettings?.barWidth || 20}
        />
      ))}
    </RechartsBarChart>
  );

  const renderLineChart = () => (
    <RechartsLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={Object.keys(data[0] || {})[0]} />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      {settings.showLegend && <ChartLegend content={<ChartLegendContent />} />}
      {dataKeys.map((key, index) => (
        <Line
          key={key}
          type={settings.lineSettings?.smooth ? "monotone" : "linear"}
          dataKey={key}
          stroke={chartConfig[key]?.color}
          strokeWidth={settings.lineSettings?.strokeWidth || 2}
          dot={
            settings.lineSettings?.showDots
              ? { r: settings.lineSettings?.dotSize || 4 }
              : false
          }
        />
      ))}
    </RechartsLineChart>
  );

  const renderPieChart = () => {
    const pieData = data.map((item, index) => ({
      ...item,
      fill:
        chartConfig[dataKeys[0]]?.color ||
        `hsl(var(--chart-${(index % 5) + 1}))`,
    }));

    return (
      <RechartsPieChart>
        <Pie
          data={pieData}
          dataKey={dataKeys[0]}
          nameKey={Object.keys(data[0] || {})[0]}
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
      <PolarAngleAxis dataKey={Object.keys(data[0] || {})[0]} />
      <PolarRadiusAxis
        angle={90}
        domain={settings.radarSettings?.domain || [0, 100]}
        tickCount={settings.radarSettings?.ticks || 5}
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      {settings.showLegend && <ChartLegend content={<ChartLegendContent />} />}
      {dataKeys.map((key, index) => (
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
    const radialData = data.map((item, index) => ({
      ...item,
      fill:
        chartConfig[dataKeys[0]]?.color ||
        `hsl(var(--chart-${(index % 5) + 1}))`,
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
          dataKey={dataKeys[0]}
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
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              Please add some data to create your chart
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{settings.title}</CardTitle>
        {settings.subtitle && (
          <p className="text-center text-muted-foreground">
            {settings.subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="w-full"
          style={{
            height: `${settings.height}px`,
            width: `${settings.width}px`,
            maxWidth: "100%",
          }}
        >
          <ChartContainer config={chartConfig} className="w-full h-full">
            {renderChart()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
