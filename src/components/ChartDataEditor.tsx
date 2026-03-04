"use client";

import { useState, useEffect } from "react";
import {
  ChartDataPoint,
  ChartType,
  SAMPLE_DATA,
  ChartSettings,
} from "@/types/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, RotateCcw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Tools.Charts");
  const [jsonInput, setJsonInput] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [tableData, setTableData] = useState<ChartDataPoint[]>(data);
  const [headers, setHeaders] = useState<string[]>([]);
  const [headerEdits, setHeaderEdits] = useState<Record<string, string>>({});

  // Determine category key (first string column or first column)
  const getCategoryKey = (data: ChartDataPoint[]): string => {
    if (!data.length) return "";
    const first = data[0];
    const keys = Object.keys(first);
    const stringKey = keys.find((k) => typeof first[k] === "string");
    return stringKey || keys[0] || "";
  };

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
    const categoryKey = headers[0]; // Assume first column is category

    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: ChartDataPoint = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        // Keep category as string, try to parse others as numbers
        if (header === categoryKey) {
          row[header] = value;
        } else {
          const numValue = parseFloat(value);
          row[header] = isNaN(numValue) ? (value === "" ? 0 : value) : numValue;
        }
      });
      return row;
    });
    return rows;
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Validate and clean the data
        const cleanedData = cleanAndValidateData(parsed);
        onDataChange(cleanedData);
        setTableData(cleanedData);
        setCsvInput(convertToCSV(cleanedData));
        setHeaders(Object.keys(cleanedData[0]));
        toast.success(t("dataUpdated"));
      } else {
        toast.error(t("invalidJsonFormat"));
      }
    } catch (error) {
      toast.error(t("invalidJsonSimple"));
    }
  };

  const handleCsvSubmit = () => {
    try {
      const parsed = parseCSV(csvInput);
      if (parsed.length > 0) {
        const cleanedData = cleanAndValidateData(parsed);
        onDataChange(cleanedData);
        setTableData(cleanedData);
        setJsonInput(JSON.stringify(cleanedData, null, 2));
        setHeaders(Object.keys(cleanedData[0]));
        toast.success(t("dataUpdated"));
      } else {
        toast.error(t("invalidCsvFormat"));
      }
    } catch (error) {
      toast.error(t("invalidCsvFormat"));
    }
  };

  // Clean and validate data to ensure proper types
  const cleanAndValidateData = (data: ChartDataPoint[]): ChartDataPoint[] => {
    if (!data.length) return data;

    const categoryKey = getCategoryKey(data);

    return data.map((row) => {
      const cleanedRow: ChartDataPoint = {};
      Object.keys(row).forEach((key) => {
        const value = row[key];

        if (key === categoryKey) {
          // Category should be string
          cleanedRow[key] = String(value || "");
        } else {
          // Other columns should be numbers for charts
          if (value === "" || value === null || value === undefined) {
            cleanedRow[key] = 0;
          } else {
            const numValue = parseFloat(String(value));
            cleanedRow[key] = isNaN(numValue) ? 0 : numValue;
          }
        }
      });
      return cleanedRow;
    });
  };

  const handleTableDataChange = (index: number, key: string, value: string) => {
    const categoryKey = getCategoryKey(tableData);
    const newData = [...tableData];

    // Determine proper value type
    let processedValue: string | number;
    if (key === categoryKey) {
      // Category column stays as string
      processedValue = value;
    } else {
      // Numeric columns
      if (value === "") {
        processedValue = 0;
      } else {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? 0 : numValue;
      }
    }

    newData[index] = { ...newData[index], [key]: processedValue };
    setTableData(newData);
    onDataChange(newData);
  };

  const addRow = () => {
    const categoryKey = getCategoryKey(tableData);
    const newRow: ChartDataPoint = {};

    headers.forEach((header) => {
      if (header === categoryKey) {
        newRow[header] = `Item ${tableData.length + 1}`;
      } else {
        newRow[header] = 0;
      }
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
    const base = "value";
    let name = base;
    let counter = 1;
    while (headers.includes(name)) {
      name = `${base}_${counter++}`;
    }

    const newHeaders = [...headers, name];
    const newData = tableData.map((row) => ({
      ...row,
      [name]: 0, // Default to 0 for new numeric columns
    }));

    setHeaders(newHeaders);
    setTableData(newData);
    onDataChange(newData);
  };

  const removeColumn = (columnName: string) => {
    if (headers.length > 2) {
      // Keep at least category + one value column
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

  const renameColumn = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) {
      setHeaderEdits((prev) => {
        const { [oldName]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    if (headers.includes(trimmed)) {
      toast.error(t("columnExists"));
      setHeaderEdits((prev) => {
        const { [oldName]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    const newHeaders = headers.map((h) => (h === oldName ? trimmed : h));
    const newData = tableData.map((row) => {
      const value = row[oldName];
      const { [oldName]: _omit, ...rest } = row;
      return { ...rest, [trimmed]: value };
    });
    setHeaders(newHeaders);
    setTableData(newData);
    onDataChange(newData);
    setHeaderEdits((prev) => {
      const { [oldName]: _, ...rest } = prev;
      return rest;
    });
  };

  const loadSampleData = () => {
    const sampleData = JSON.parse(JSON.stringify(SAMPLE_DATA[chartType]));
    const cleanedData = cleanAndValidateData(sampleData);
    onDataChange(cleanedData);
    setTableData(cleanedData);
    setJsonInput(JSON.stringify(cleanedData, null, 2));
    setCsvInput(convertToCSV(cleanedData));
    setHeaders(Object.keys(cleanedData[0] || {}));
    toast.success(t("sampleDataLoaded"));
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
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{t("chartDataTitle")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("chartDataDesc")}
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={loadSampleData}>
            <RotateCcw className="h-4 w-4 me-2" />
            {t("loadSample")}
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 me-2" />
            {t("export")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">{t("tableTab")}</TabsTrigger>
          <TabsTrigger value="json">{t("jsonTab")}</TabsTrigger>
          <TabsTrigger value="csv">{t("csvTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button size="sm" onClick={addRow}>
                  <Plus className="h-4 w-4 me-1" />
                  {t("addRow")}
                </Button>
                <Button size="sm" variant="outline" onClick={addColumn}>
                  <Plus className="h-4 w-4 me-1" />
                  {t("addColumn")}
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {headers.map((header, index) => (
                      <th key={index} className="text-start p-2 border-r">
                        <div className="flex items-center gap-2">
                          <Input
                            value={headerEdits[header] ?? header}
                            onChange={(e) =>
                              setHeaderEdits((prev) => ({
                                ...prev,
                                [header]: e.target.value,
                              }))
                            }
                            onBlur={(e) => renameColumn(header, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                            className="h-8 py-1 px-2 text-sm"
                          />
                          {headers.length > 2 && (
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
                    <th className="text-start p-2">{t("actions")}</th>
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
                              handleTableDataChange(
                                rowIndex,
                                header,
                                e.target.value
                              );
                            }}
                            className="h-8"
                            type={
                              getCategoryKey(tableData) === header
                                ? "text"
                                : "number"
                            }
                            step="any"
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
          </div>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("jsonTab")} Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="json-input">{t("jsonData")}</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={t("jsonPlaceholder")}
                  className="min-h-[200px] font-mono text-sm"
                  dir="ltr"
                />
              </div>
              <Button onClick={handleJsonSubmit} className="w-full">
                {t("updateChartData")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("csvTab")} Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-input">{t("csvData")}</Label>
                <Textarea
                  id="csv-input"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={t("csvPlaceholder")}
                  className="min-h-[200px] font-mono text-sm"
                  dir="ltr"
                />
              </div>
              <Button onClick={handleCsvSubmit} className="w-full">
                {t("updateChartData")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {data.length === 0 && (
        <Alert>
          <AlertDescription>
            {t("noDataAlert")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
