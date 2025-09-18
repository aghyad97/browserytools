"use client";

import { useState, useRef } from "react";
import {
  ChartType,
  ChartDataPoint,
  ChartSettings,
  DEFAULT_CHART_SETTINGS,
  SAMPLE_DATA,
} from "@/types/chart";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { ChartDataEditor } from "./ChartDataEditor";
import { ChartCustomizationPanel } from "./ChartCustomizationPanel";
import { ChartRenderer } from "./ChartRenderer";
import { ChartExport } from "./ChartExport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Settings,
  Download,
  RotateCcw,
  Eye,
  Code,
} from "lucide-react";

export function Charts() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [data, setData] = useState<ChartDataPoint[]>(SAMPLE_DATA.bar);
  const [settings, setSettings] = useState<ChartSettings>(
    DEFAULT_CHART_SETTINGS
  );
  const [activeTab, setActiveTab] = useState("preview");
  const chartRef = useRef<HTMLDivElement>(null);

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    // deep copy to avoid reference reuse issues
    const sample = JSON.parse(JSON.stringify(SAMPLE_DATA[type]));
    setData(sample);
  };

  const handleDataChange = (newData: ChartDataPoint[]) => {
    setData(newData);
  };

  const handleSettingsChange = (newSettings: ChartSettings) => {
    setSettings(newSettings);
  };

  const resetToDefaults = () => {
    setChartType("bar");
    setData(SAMPLE_DATA.bar);
    setSettings(DEFAULT_CHART_SETTINGS);
  };

  const getDataKeys = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).slice(1);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-4 min-h-screen">
        {/* Left Sidebar - Controls */}
        <div className="w-full lg:w-[40%] overflow-y-auto space-y-4 pr-4 scrollbar-hide max-h-screen">
          {/* Chart Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Chart Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartTypeSelector
                selectedType={chartType}
                onTypeChange={handleChartTypeChange}
              />
            </CardContent>
          </Card>

          {/* Data Editor */}
          <Card>
            <CardContent>
              <ChartDataEditor
                chartType={chartType}
                data={data}
                onDataChange={handleDataChange}
              />
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartCustomizationPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                dataKeys={getDataKeys()}
                chartType={chartType}
              />
            </CardContent>
          </Card>

          {/* Export Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartExport
                chartRef={chartRef}
                data={data}
                settings={settings}
                chartType={chartType}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Chart Preview */}
        <div className="w-full lg:w-[60%] lg:sticky lg:top-4 lg:self-start">
          <Card className="h-fit max-h-[calc(100vh-2rem)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Chart Preview
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create beautiful, customizable charts with full control over
                    every detail
                  </p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="preview" className="space-y-4">
                  <div ref={chartRef}>
                    <ChartRenderer
                      chartType={chartType}
                      data={data}
                      settings={settings}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Chart Configuration</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON.stringify(settings, null, 2)}</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Chart Data</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON.stringify(data, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
