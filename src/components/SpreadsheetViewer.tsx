"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as TableIcon,
  Search,
  BarChart3,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataRow {
  [key: string]: string | number;
}

interface Column {
  key: string;
  type: "string" | "number";
  sortable: boolean;
}

export default function SpreadsheetViewer() {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [search, setSearch] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      let parsedData: DataRow[] = [];

      if (file.name.endsWith(".csv")) {
        // Parse CSV
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        parsedData = result.data as DataRow[];
      } else {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        parsedData = XLSX.utils.sheet_to_json(worksheet);
      }

      // Detect column types
      const cols: Column[] = Object.keys(parsedData[0]).map((key) => ({
        key,
        type: typeof parsedData[0][key] === "number" ? "number" : "string",
        sortable: true,
      }));

      setColumns(cols);
      setData(parsedData);
      setFilteredData(parsedData);
      setSelectedColumn(cols[0].key);
      toast.success("File loaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error loading file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row) =>
      Object.values(row).some((cell) =>
        String(cell).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleSort = (key: string) => {
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;

    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] === b[key]) return 0;
      if (direction === "asc") {
        return a[key] < b[key] ? -1 : 1;
      } else {
        return a[key] > b[key] ? -1 : 1;
      }
    });

    setFilteredData(sorted);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const prepareChartData = () => {
    if (!selectedColumn) return [];

    const column = columns.find((col) => col.key === selectedColumn);
    if (column?.type !== "number") {
      // For string columns, count occurrences
      const counts: { [key: string]: number } = {};
      filteredData.forEach((row) => {
        const value = String(row[selectedColumn]);
        counts[value] = (counts[value] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    } else {
      // For number columns, use values directly
      return filteredData.map((row) => ({
        name: row[Object.keys(row)[0]], // Use first column as label
        value: row[selectedColumn],
      }));
    }
  };

  const chartData = prepareChartData();

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-end items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {data.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowChart(!showChart)}>
              <BarChart3 className="w-4 h-4 mr-2" />
              {showChart ? "Hide Chart" : "Show Chart"}
            </Button>
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {!data.length ? (
            <Card className="p-6">
              <div
                {...getRootProps()}
                className={`
                  h-48 rounded-lg border-2 border-dashed
                  flex flex-col items-center justify-center space-y-4 p-8
                  cursor-pointer transition-all duration-200
                  ${
                    isDragActive
                      ? "border-primary bg-primary/10 scale-[0.99]"
                      : "border-muted-foreground hover:border-primary hover:bg-primary/5"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <TableIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      Drop spreadsheet here or click to select
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports CSV, XLSX, and XLS files
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search in data..."
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  {showChart && (
                    <Select
                      value={selectedColumn || ""}
                      onValueChange={setSelectedColumn}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select column for chart" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.key} value={column.key}>
                            {column.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </Card>

              {showChart && selectedColumn && (
                <Card className="p-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              <Card>
                <div className="max-h-[600px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column.key}
                            className={
                              column.sortable
                                ? "cursor-pointer hover:bg-muted"
                                : ""
                            }
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center space-x-2">
                              <span>{column.key}</span>
                              {column.sortable && (
                                <ArrowUpDown className="w-4 h-4" />
                              )}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column.key}>
                              {String(row[column.key])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
