"use client";

import { useState, useEffect } from "react";
import { ChartDataPoint, ChartType, SAMPLE_DATA } from "@/types/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, RotateCcw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ChartDataEditorProps {
  chartType: ChartType;
  data: ChartDataPoint[];
  onDataChange: (data: ChartDataPoint[]) => void;
}

export function ChartDataEditor({
  chartType,
  data,
  onDataChange,
}: ChartDataEditorProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [tableData, setTableData] = useState<ChartDataPoint[]>(data);
  const [headers, setHeaders] = useState<string[]>([]);

  // Initialize data when chart type changes
  useEffect(() => {
    const sampleData = SAMPLE_DATA[chartType];
    onDataChange(sampleData);
    setTableData(sampleData);
    setJsonInput(JSON.stringify(sampleData, null, 2));
    setCsvInput(convertToCSV(sampleData));
    setHeaders(Object.keys(sampleData[0] || {}));
  }, [chartType, onDataChange]);

  // Update table data when data prop changes
  useEffect(() => {
    setTableData(data);
    setJsonInput(JSON.stringify(data, null, 2));
    setCsvInput(convertToCSV(data));
    if (data.length > 0) {
      setHeaders(Object.keys(data[0]));
    }
  }, [data]);

  const convertToCSV = (data: ChartDataPoint[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  const parseCSV = (csv: string): ChartDataPoint[] => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: ChartDataPoint = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        // Try to parse as number, otherwise keep as string
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      return row;
    });
    return rows;
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onDataChange(parsed);
        setTableData(parsed);
        setCsvInput(convertToCSV(parsed));
        setHeaders(Object.keys(parsed[0]));
        toast.success("Data updated successfully");
      } else {
        toast.error("Invalid JSON format. Expected an array of objects.");
      }
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleCsvSubmit = () => {
    try {
      const parsed = parseCSV(csvInput);
      if (parsed.length > 0) {
        onDataChange(parsed);
        setTableData(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
        setHeaders(Object.keys(parsed[0]));
        toast.success("Data updated successfully");
      } else {
        toast.error("Invalid CSV format");
      }
    } catch (error) {
      toast.error("Invalid CSV format");
    }
  };

  const handleTableDataChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const newData = [...tableData];
    newData[index] = { ...newData[index], [key]: value };
    setTableData(newData);
    onDataChange(newData);
  };

  const addRow = () => {
    const newRow: ChartDataPoint = {};
    headers.forEach((header) => {
      newRow[header] = "";
    });
    const newData = [...tableData, newRow];
    setTableData(newData);
    onDataChange(newData);
  };

  const removeRow = (index: number) => {
    if (tableData.length > 1) {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
      onDataChange(newData);
    }
  };

  const addColumn = () => {
    const columnName = prompt("Enter column name:");
    if (columnName && !headers.includes(columnName)) {
      const newHeaders = [...headers, columnName];
      const newData = tableData.map((row) => ({
        ...row,
        [columnName]: "",
      }));
      setHeaders(newHeaders);
      setTableData(newData);
      onDataChange(newData);
    }
  };

  const removeColumn = (columnName: string) => {
    if (headers.length > 1) {
      const newHeaders = headers.filter((h) => h !== columnName);
      const newData = tableData.map((row) => {
        const newRow = { ...row };
        delete newRow[columnName];
        return newRow;
      });
      setHeaders(newHeaders);
      setTableData(newData);
      onDataChange(newData);
    }
  };

  const loadSampleData = () => {
    const sampleData = SAMPLE_DATA[chartType];
    onDataChange(sampleData);
    setTableData(sampleData);
    setJsonInput(JSON.stringify(sampleData, null, 2));
    setCsvInput(convertToCSV(sampleData));
    setHeaders(Object.keys(sampleData[0] || {}));
    toast.success("Sample data loaded");
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Chart Data</h3>
        <p className="text-sm text-muted-foreground">
          Input your data using the table, JSON, or CSV format
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={loadSampleData}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Data Table</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addRow}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Row
                  </Button>
                  <Button size="sm" variant="outline" onClick={addColumn}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Column
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {headers.map((header, index) => (
                        <th key={index} className="text-left p-2 border-r">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {header}
                            </span>
                            {headers.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeColumn(header)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="p-2 border-r">
                            <Input
                              value={row[header] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const numValue = parseFloat(value);
                                handleTableDataChange(
                                  rowIndex,
                                  header,
                                  isNaN(numValue) ? value : numValue
                                );
                              }}
                              className="h-8"
                            />
                          </td>
                        ))}
                        <td className="p-2">
                          {tableData.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeRow(rowIndex)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">JSON Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="json-input">JSON Data</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Enter JSON data..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleJsonSubmit} className="w-full">
                Update Chart Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">CSV Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-input">CSV Data</Label>
                <Textarea
                  id="csv-input"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Enter CSV data..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <Button onClick={handleCsvSubmit} className="w-full">
                Update Chart Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {data.length === 0 && (
        <Alert>
          <AlertDescription>
            No data available. Please add some data to create your chart.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
