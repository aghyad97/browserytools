export type ChartType = "area" | "bar" | "line" | "pie" | "radar" | "radial";

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
    theme?: {
      light: string;
      dark: string;
    };
  };
}

export interface ChartSettings {
  // General settings
  title: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  width: number;
  height: number;
  showLegend: boolean;
  showTooltip: boolean;
  showGrid: boolean;
  gridColor?: string;

  // Data mapping
  categoryKey?: string;
  seriesKeys?: string[];
  colorColumn?: string; // optional column in data containing color values (e.g., for pie/radial)

  // Axis settings
  showXAxis: boolean;
  showYAxis: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;

  // Colors and themes
  colorScheme: "default" | "custom" | "preset";
  customColors: string[];
  themePreset: string;

  // Chart specific settings
  areaSettings?: {
    fillOpacity: number;
    strokeWidth: number;
    smooth: boolean;
  };

  barSettings?: {
    barWidth: number;
    barGap: number;
    horizontal: boolean;
  };

  lineSettings?: {
    strokeWidth: number;
    smooth: boolean;
    showDots: boolean;
    dotSize: number;
  };

  pieSettings?: {
    innerRadius: number;
    outerRadius: number;
    showLabels: boolean;
    labelPosition: "inside" | "outside" | "center";
  };

  radarSettings?: {
    domain: [number, number];
    ticks: number;
    showDots: boolean;
  };

  radialSettings?: {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    showLabels: boolean;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  colors: string[];
  description?: string;
}

export interface ExportOptions {
  format: "png" | "svg" | "pdf" | "json";
  quality?: number;
  filename?: string;
  includeData?: boolean;
  includeConfig?: boolean;
}

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  title: "My Chart",
  subtitle: "",
  titleColor: "",
  subtitleColor: "",
  width: 800,
  height: 400,
  showLegend: true,
  showTooltip: true,
  showGrid: true,
  gridColor: "",
  categoryKey: undefined,
  seriesKeys: undefined,
  colorColumn: undefined,
  showXAxis: true,
  showYAxis: true,
  xAxisLabel: "",
  yAxisLabel: "",
  colorScheme: "default",
  customColors: [],
  themePreset: "default",
  areaSettings: {
    fillOpacity: 0.6,
    strokeWidth: 2,
    smooth: true,
  },
  barSettings: {
    barWidth: 20,
    barGap: 4,
    horizontal: true,
  },
  lineSettings: {
    strokeWidth: 2,
    smooth: true,
    showDots: true,
    dotSize: 4,
  },
  pieSettings: {
    innerRadius: 0,
    outerRadius: 80,
    showLabels: true,
    labelPosition: "outside",
  },
  radarSettings: {
    domain: [0, 100],
    ticks: 5,
    showDots: true,
  },
  radialSettings: {
    innerRadius: 0,
    outerRadius: 80,
    startAngle: 0,
    endAngle: 360,
    showLabels: true,
  },
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default",
    name: "Default",
    colors: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ],
    description: "Default shadcn/ui colors",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
    ],
    description: "Bright and energetic colors",
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#E6B3FF",
      "#FFB3E6",
    ],
    description: "Soft and gentle pastel tones",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#1a1a1a", "#4a4a4a", "#7a7a7a", "#aaaaaa", "#dadada", "#f0f0f0"],
    description: "Elegant grayscale palette",
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
    ],
    description: "Deep ocean blues and teals",
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: [
      "#ff9a9e",
      "#fecfef",
      "#fecfef",
      "#ffecd2",
      "#fcb69f",
      "#ff8a80",
      "#ffab91",
    ],
    description: "Warm sunset colors",
  },
  {
    id: "forest",
    name: "Forest",
    colors: [
      "#134e5e",
      "#71b280",
      "#a8e6cf",
      "#dcedc1",
      "#ffd3a5",
      "#fd9853",
      "#a8e6cf",
    ],
    description: "Natural forest greens and earth tones",
  },
  {
    id: "neon",
    name: "Neon",
    colors: [
      "#ff0080",
      "#00ff80",
      "#8000ff",
      "#ff8000",
      "#0080ff",
      "#ffff00",
      "#ff0080",
    ],
    description: "Bright neon colors for modern charts",
  },
];

export const SAMPLE_DATA: Record<ChartType, ChartDataPoint[]> = {
  area: [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ],
  bar: [
    { name: "Jan", desktop: 186, mobile: 80 },
    { name: "Feb", desktop: 305, mobile: 200 },
    { name: "Mar", desktop: 237, mobile: 120 },
    { name: "Apr", desktop: 73, mobile: 190 },
    { name: "May", desktop: 209, mobile: 130 },
    { name: "Jun", desktop: 214, mobile: 140 },
  ],
  line: [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ],
  pie: [
    { name: "Desktop", value: 186, fill: "hsl(var(--chart-1))" },
    { name: "Mobile", value: 80, fill: "hsl(var(--chart-2))" },
    { name: "Tablet", value: 120, fill: "hsl(var(--chart-3))" },
  ],
  radar: [
    { subject: "Math", A: 120, B: 110, fullMark: 150 },
    { subject: "Chinese", A: 98, B: 130, fullMark: 150 },
    { subject: "English", A: 86, B: 130, fullMark: 150 },
    { subject: "Geography", A: 99, B: 100, fullMark: 150 },
    { subject: "Physics", A: 85, B: 90, fullMark: 150 },
    { subject: "History", A: 65, B: 85, fullMark: 150 },
  ],
  radial: [
    { name: "Desktop", value: 186, fill: "hsl(var(--chart-1))" },
    { name: "Mobile", value: 80, fill: "hsl(var(--chart-2))" },
    { name: "Tablet", value: 120, fill: "hsl(var(--chart-3))" },
  ],
};
