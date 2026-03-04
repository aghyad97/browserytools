"use client";

import { ChartType } from "@/types/chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

const chartTypes = [
  {
    type: "area" as ChartType,
    nameKey: "areaChart" as const,
    descKey: "areaChartDesc" as const,
    icon: AreaChart,
    color: "bg-blue-500",
  },
  {
    type: "bar" as ChartType,
    nameKey: "barChart" as const,
    descKey: "barChartDesc" as const,
    icon: BarChart3,
    color: "bg-green-500",
  },
  {
    type: "line" as ChartType,
    nameKey: "lineChart" as const,
    descKey: "lineChartDesc" as const,
    icon: LineChart,
    color: "bg-purple-500",
  },
  {
    type: "pie" as ChartType,
    nameKey: "pieChart" as const,
    descKey: "pieChartDesc" as const,
    icon: PieChart,
    color: "bg-orange-500",
  },
  {
    type: "radar" as ChartType,
    nameKey: "radarChart" as const,
    descKey: "radarChartDesc" as const,
    icon: Radar,
    color: "bg-pink-500",
  },
  {
    type: "radial" as ChartType,
    nameKey: "radialChart" as const,
    descKey: "radialChartDesc" as const,
    icon: CircleDot,
    color: "bg-teal-500",
  },
];

export function ChartTypeSelector({
  selectedType,
  onTypeChange,
}: ChartTypeSelectorProps) {
  const t = useTranslations("Tools.Charts");
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("chartTypeTitle")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("chartTypeDesc")}
        </p>
      </div>

      <div className="space-y-3">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedType === chart.type;

          return (
            <Card
              key={chart.type}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected && "ring-2 ring-primary shadow-md"
              )}
              onClick={() => onTypeChange(chart.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className={cn("p-2 rounded-lg text-white", chart.color)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{t(chart.nameKey)}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t(chart.descKey)}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
