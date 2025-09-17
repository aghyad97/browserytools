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

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

const chartTypes = [
  {
    type: "area" as ChartType,
    name: "Area Chart",
    description: "Shows data trends over time with filled areas",
    icon: AreaChart,
    color: "bg-blue-500",
  },
  {
    type: "bar" as ChartType,
    name: "Bar Chart",
    description: "Compares values across categories",
    icon: BarChart3,
    color: "bg-green-500",
  },
  {
    type: "line" as ChartType,
    name: "Line Chart",
    description: "Displays trends and changes over time",
    icon: LineChart,
    color: "bg-purple-500",
  },
  {
    type: "pie" as ChartType,
    name: "Pie Chart",
    description: "Shows proportions of a whole",
    icon: PieChart,
    color: "bg-orange-500",
  },
  {
    type: "radar" as ChartType,
    name: "Radar Chart",
    description: "Compares multiple variables in a circular format",
    icon: Radar,
    color: "bg-pink-500",
  },
  {
    type: "radial" as ChartType,
    name: "Radial Chart",
    description: "Shows data in a circular bar format",
    icon: CircleDot,
    color: "bg-teal-500",
  },
];

export function ChartTypeSelector({
  selectedType,
  onTypeChange,
}: ChartTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Chart Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of chart you want to create
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
                <div className="flex items-start space-x-3">
                  <div className={cn("p-2 rounded-lg text-white", chart.color)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{chart.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chart.description}
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
