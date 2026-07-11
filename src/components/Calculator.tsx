"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CalculatorIcon, ChartLine, Plus, X as XIcon } from "lucide-react";
import { Function } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { create, all, type MathJsInstance } from "mathjs";
import { toast } from "sonner";

// Isolated mathjs instance — no eval/Function, expression parser only.
const math: MathJsInstance = create(all, {});

const DEG = Math.PI / 180;
// Degree-aware trig variants used when the calculator is in "deg" mode.
math.import(
  {
    sindeg: (x: number) => Math.sin(x * DEG),
    cosdeg: (x: number) => Math.cos(x * DEG),
    tandeg: (x: number) => Math.tan(x * DEG),
    asindeg: (x: number) => Math.asin(x) / DEG,
    acosdeg: (x: number) => Math.acos(x) / DEG,
    atandeg: (x: number) => Math.atan(x) / DEG,
  },
  { override: true }
);

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  memory: number;
}

type Mode = "basic" | "scientific" | "graph";
type Angle = "deg" | "rad";

interface PlotFn {
  id: number;
  fn: string;
  color: string;
}

const PLOT_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

const Calculator = () => {
  const t = useTranslations("Tools.Calculator");
  const tc = useTranslations("ToolsConfig");
  const [mode, setMode] = useState<Mode>("basic");
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    expression: "",
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
  });

  // ── Basic mode (unchanged state machine) ────────────────────────────────
  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (Math.abs(num) < 1e-10) return "0";
    if (Math.abs(num) >= 1e15) return num.toExponential(6);
    return num.toString();
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  const handleNumber = (num: string) => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: num,
          expression: prev.expression + num,
          waitingForNewValue: false,
        };
      }
      if (prev.expression === "" || prev.expression.includes("=")) {
        return {
          ...prev,
          display: prev.display === "0" ? num : prev.display + num,
          expression: prev.display === "0" ? num : prev.display + num,
        };
      }
      return {
        ...prev,
        display: prev.display === "0" ? num : prev.display + num,
        expression: prev.expression + num,
      };
    });
  };

  const handleOperation = (op: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const displayOp = op;

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: currentValue,
          operation: op,
          expression: prev.display + " " + displayOp + " ",
          waitingForNewValue: true,
        };
      }

      if (prev.operation && !prev.waitingForNewValue) {
        try {
          const result = calculate(
            prev.previousValue,
            currentValue,
            prev.operation
          );
          return {
            ...prev,
            display: formatNumber(result),
            expression: prev.expression + " = " + formatNumber(result),
            previousValue: result,
            operation: op,
            waitingForNewValue: true,
          };
        } catch {
          return {
            ...prev,
            display: "Error",
            expression: prev.expression + " = Error",
            previousValue: null,
            operation: null,
            waitingForNewValue: true,
          };
        }
      }

      return {
        ...prev,
        operation: op,
        expression: prev.expression + " " + displayOp + " ",
        waitingForNewValue: true,
      };
    });
  };

  const handleEquals = () => {
    setState((prev) => {
      if (prev.previousValue === null || prev.operation === null) return prev;

      const currentValue = parseFloat(prev.display);
      try {
        const result = calculate(
          prev.previousValue,
          currentValue,
          prev.operation
        );
        return {
          ...prev,
          display: formatNumber(result),
          expression: prev.expression + " = " + formatNumber(result),
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      } catch {
        return {
          ...prev,
          display: "Error",
          expression: prev.expression + " = Error",
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      }
    });
  };

  const handleClear = () => {
    setState((prev) => ({
      display: "0",
      expression: "",
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      memory: prev.memory,
    }));
  };

  const handleClearEntry = () => {
    setState((prev) => ({
      ...prev,
      display: "0",
      expression: prev.expression.replace(/\s+\d+$/, ""),
      waitingForNewValue: true,
    }));
  };

  const handleBackspace = () => {
    setState((prev) => {
      if (prev.display.length > 1) {
        return {
          ...prev,
          display: prev.display.slice(0, -1),
          expression: prev.expression.slice(0, -1),
        };
      }
      return {
        ...prev,
        display: "0",
        expression: prev.expression.replace(/\d+$/, ""),
      };
    });
  };

  const handleDecimal = () => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: "0.",
          expression: prev.expression + "0.",
          waitingForNewValue: false,
        };
      }
      if (!prev.display.includes(".")) {
        return {
          ...prev,
          display: prev.display + ".",
          expression: prev.expression + ".",
        };
      }
      return prev;
    });
  };

  const handlePercentage = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const result = currentValue / 100;
      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.display + "% = " + formatNumber(result),
        waitingForNewValue: true,
      };
    });
  };

  const handlePlusMinus = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const result = -currentValue;
      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.expression.replace(
          /\d+(\.\d+)?$/,
          formatNumber(result)
        ),
      };
    });
  };

  // ── Scientific mode (mathjs expression engine) ──────────────────────────
  const [angle, setAngle] = useState<Angle>("deg");
  const [sciExpr, setSciExpr] = useState("");
  const [sciResult, setSciResult] = useState("0");
  const [sciError, setSciError] = useState(false);
  const [sciMemory, setSciMemory] = useState(0);

  // Translate the user-facing expression into a mathjs-evaluable string.
  // In degree mode, trig functions consume degrees and inverse trig returns degrees.
  const toEvalExpression = useCallback(
    (expr: string): string => {
      let e = expr;
      if (angle === "deg") {
        // Map trig calls to the degree-aware variants. Inverse functions are
        // matched first so "asin" is not partially rewritten by the "sin" rule.
        e = e
          .replace(/\basin\b/g, "asindeg")
          .replace(/\bacos\b/g, "acosdeg")
          .replace(/\batan\b/g, "atandeg")
          .replace(/(?<![a-z])sin\b/g, "sindeg")
          .replace(/(?<![a-z])cos\b/g, "cosdeg")
          .replace(/(?<![a-z])tan\b/g, "tandeg");
      }
      return e;
    },
    [angle]
  );

  const evalScientific = useCallback(
    (expr: string): string => {
      if (!expr.trim()) {
        setSciError(false);
        return "0";
      }
      try {
        const value = math.evaluate(toEvalExpression(expr));
        if (typeof value !== "number" || !isFinite(value)) {
          throw new Error("invalid");
        }
        setSciError(false);
        return math.format(value, { precision: 12 });
      } catch {
        setSciError(true);
        return t("error");
      }
    },
    [toEvalExpression, t]
  );

  const appendSci = (token: string) => {
    setSciExpr((prev) => prev + token);
    setSciError(false);
  };

  const handleSciEquals = () => {
    const res = evalScientific(sciExpr);
    setSciResult(res);
  };

  const handleSciClear = () => {
    setSciExpr("");
    setSciResult("0");
    setSciError(false);
  };

  const handleSciBackspace = () => {
    setSciExpr((prev) => prev.slice(0, -1));
    setSciError(false);
  };

  const handleSciMemory = (op: string) => {
    const current = parseFloat(sciResult);
    const value = isFinite(current) ? current : 0;
    switch (op) {
      case "MC":
        setSciMemory(0);
        break;
      case "MR":
        appendSci(String(sciMemory));
        break;
      case "M+":
        setSciMemory((m) => m + value);
        break;
      case "M-":
        setSciMemory((m) => m - value);
        break;
    }
  };

  // Live preview of the scientific result as the user types.
  useEffect(() => {
    if (mode !== "scientific") return;
    if (!sciExpr.trim()) {
      setSciResult("0");
      setSciError(false);
      return;
    }
    try {
      const value = math.evaluate(toEvalExpression(sciExpr));
      if (typeof value === "number" && isFinite(value)) {
        setSciResult(math.format(value, { precision: 12 }));
        setSciError(false);
      }
    } catch {
      // keep last good result while typing; don't flag error mid-entry
    }
  }, [sciExpr, angle, mode, toEvalExpression]);

  // ── Graphing mode (function-plot) ───────────────────────────────────────
  const graphRef = useRef<HTMLDivElement>(null);
  const [functions, setFunctions] = useState<PlotFn[]>([
    { id: 1, fn: "x^2", color: PLOT_COLORS[0] },
  ]);
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const nextId = useRef(2);

  const addFunction = () => {
    setFunctions((prev) => [
      ...prev,
      {
        id: nextId.current++,
        fn: "",
        color: PLOT_COLORS[prev.length % PLOT_COLORS.length],
      },
    ]);
  };

  const removeFunction = (id: number) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFunction = (id: number, fn: string) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, fn } : f)));
  };

  useEffect(() => {
    if (mode !== "graph") return;

    let cancelled = false;

    (async () => {
      const { default: functionPlot } = await import("function-plot");
      const node = graphRef.current;
      if (cancelled || !node) return;

      const min = parseFloat(xMin);
      const max = parseFloat(xMax);
      const domain: [number, number] =
        isFinite(min) && isFinite(max) && min < max ? [min, max] : [-10, 10];

      const data = functions
        .filter((f) => f.fn.trim() !== "")
        .map((f) => ({ fn: f.fn, color: f.color }));

      node.replaceChildren();
      const width = node.clientWidth || 600;

      try {
        functionPlot({
          target: node,
          width,
          height: 380,
          xAxis: { domain },
          grid: true,
          data: data.length ? data : [{ fn: "0" }],
        });
      } catch {
        node.replaceChildren();
        toast.error(t("graphError"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, functions, xMin, xMax, t]);

  // ── Keyboard support ────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't hijack typing inside inputs (scientific expr / graph fields).
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (mode !== "basic") return;
      event.preventDefault();

      if (event.key >= "0" && event.key <= "9") {
        handleNumber(event.key);
      } else if (event.key === ".") {
        handleDecimal();
      } else if (event.key === "+") {
        handleOperation("+");
      } else if (event.key === "-") {
        handleOperation("-");
      } else if (event.key === "*") {
        handleOperation("×");
      } else if (event.key === "/") {
        handleOperation("÷");
      } else if (event.key === "Enter" || event.key === "=") {
        handleEquals();
      } else if (event.key === "Escape") {
        handleClear();
      } else if (event.key === "Backspace") {
        handleBackspace();
      } else if (event.key === "%") {
        handlePercentage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [mode]);

  // ── Button layouts ──────────────────────────────────────────────────────
  const numberBtn =
    "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer border-2 border-gray-300 dark:border-gray-600";
  const opBtn = "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer";

  const basicButtons = [
    [
      { label: "C", onClick: handleClear, className: "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer" },
      { label: "CE", onClick: handleClearEntry, className: "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer" },
      { label: "⌫", onClick: handleBackspace, className: "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer" },
      { label: "/", onClick: () => handleOperation("÷"), className: opBtn },
    ],
    [
      { label: "7", onClick: () => handleNumber("7"), className: numberBtn },
      { label: "8", onClick: () => handleNumber("8"), className: numberBtn },
      { label: "9", onClick: () => handleNumber("9"), className: numberBtn },
      { label: "×", onClick: () => handleOperation("×"), className: opBtn },
    ],
    [
      { label: "4", onClick: () => handleNumber("4"), className: numberBtn },
      { label: "5", onClick: () => handleNumber("5"), className: numberBtn },
      { label: "6", onClick: () => handleNumber("6"), className: numberBtn },
      { label: "-", onClick: () => handleOperation("-"), className: opBtn },
    ],
    [
      { label: "1", onClick: () => handleNumber("1"), className: numberBtn },
      { label: "2", onClick: () => handleNumber("2"), className: numberBtn },
      { label: "3", onClick: () => handleNumber("3"), className: numberBtn },
      { label: "+", onClick: () => handleOperation("+"), className: opBtn },
    ],
    [
      { label: "±", onClick: handlePlusMinus, className: "bg-slate-500 hover:bg-slate-600 text-white cursor-pointer" },
      { label: "0", onClick: () => handleNumber("0"), className: numberBtn },
      { label: ".", onClick: handleDecimal, className: "bg-slate-500 hover:bg-slate-600 text-white cursor-pointer" },
      { label: "=", onClick: handleEquals, className: "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer" },
    ],
  ];

  const sciFn =
    "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm cursor-pointer";
  const sciMem = "bg-muted hover:bg-muted/70 text-foreground text-sm cursor-pointer";

  // Scientific keypad: tokens appended to the mathjs expression string.
  const sciButtons: { label: string; onClick: () => void; className: string }[] = [
    { label: "MC", onClick: () => handleSciMemory("MC"), className: sciMem },
    { label: "MR", onClick: () => handleSciMemory("MR"), className: sciMem },
    { label: "M+", onClick: () => handleSciMemory("M+"), className: sciMem },
    { label: "M-", onClick: () => handleSciMemory("M-"), className: sciMem },
    { label: t("clear"), onClick: handleSciClear, className: "bg-rose-500 hover:bg-rose-600 text-white text-sm cursor-pointer" },

    { label: "sin", onClick: () => appendSci("sin("), className: sciFn },
    { label: "cos", onClick: () => appendSci("cos("), className: sciFn },
    { label: "tan", onClick: () => appendSci("tan("), className: sciFn },
    { label: "(", onClick: () => appendSci("("), className: sciFn },
    { label: ")", onClick: () => appendSci(")"), className: sciFn },

    { label: "asin", onClick: () => appendSci("asin("), className: sciFn },
    { label: "acos", onClick: () => appendSci("acos("), className: sciFn },
    { label: "atan", onClick: () => appendSci("atan("), className: sciFn },
    { label: "x^y", onClick: () => appendSci("^"), className: sciFn },
    { label: "x²", onClick: () => appendSci("^2"), className: sciFn },

    { label: "log", onClick: () => appendSci("log10("), className: sciFn },
    { label: "ln", onClick: () => appendSci("log("), className: sciFn },
    { label: "eˣ", onClick: () => appendSci("exp("), className: sciFn },
    { label: "x³", onClick: () => appendSci("^3"), className: sciFn },
    { label: "√", onClick: () => appendSci("sqrt("), className: sciFn },

    { label: "n!", onClick: () => appendSci("!"), className: sciFn },
    { label: "1/x", onClick: () => appendSci("1/"), className: sciFn },
    { label: "π", onClick: () => appendSci("pi"), className: sciFn },
    { label: "e", onClick: () => appendSci("e"), className: sciFn },
    { label: "∛", onClick: () => appendSci("cbrt("), className: sciFn },

    { label: "7", onClick: () => appendSci("7"), className: numberBtn },
    { label: "8", onClick: () => appendSci("8"), className: numberBtn },
    { label: "9", onClick: () => appendSci("9"), className: numberBtn },
    { label: "÷", onClick: () => appendSci("/"), className: opBtn },
    { label: "⌫", onClick: handleSciBackspace, className: "bg-amber-500 hover:bg-amber-600 text-white text-sm cursor-pointer" },

    { label: "4", onClick: () => appendSci("4"), className: numberBtn },
    { label: "5", onClick: () => appendSci("5"), className: numberBtn },
    { label: "6", onClick: () => appendSci("6"), className: numberBtn },
    { label: "×", onClick: () => appendSci("*"), className: opBtn },
    { label: "%", onClick: () => appendSci("/100"), className: sciFn },

    { label: "1", onClick: () => appendSci("1"), className: numberBtn },
    { label: "2", onClick: () => appendSci("2"), className: numberBtn },
    { label: "3", onClick: () => appendSci("3"), className: numberBtn },
    { label: "-", onClick: () => appendSci("-"), className: opBtn },
    { label: ".", onClick: () => appendSci("."), className: numberBtn },

    { label: "0", onClick: () => appendSci("0"), className: numberBtn },
    { label: "00", onClick: () => appendSci("00"), className: numberBtn },
    { label: "+", onClick: () => appendSci("+"), className: opBtn },
    { label: "=", onClick: handleSciEquals, className: "bg-emerald-500 hover:bg-emerald-600 text-white text-sm cursor-pointer col-span-2" },
  ];

  return (
    <ToolShell
      slug="calculator"
      title={tc("tools.calculator.name")}
      sub={tc("tools.calculator.description")}
    >
      <Card className="border bg-card/50 backdrop-blur-sm shadow-none">
        <CardContent className="space-y-6 pt-6">
          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" />
                {t("basic")}
              </TabsTrigger>
              <TabsTrigger value="scientific" className="flex items-center gap-2">
                <Function className="h-4 w-4" />
                {t("scientific")}
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <ChartLine className="h-4 w-4" />
                {t("graph")}
              </TabsTrigger>
            </TabsList>

            {/* ── Basic ─────────────────────────────────────────────── */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div
                className="bg-muted/50 p-6 rounded-xl text-end space-y-3 border"
                dir="ltr"
              >
                <div className="text-sm text-muted-foreground font-mono min-h-[1.5rem] break-all opacity-80">
                  {state.expression || t("expressionPlaceholder")}
                </div>
                <div className="text-4xl font-mono min-h-[2.5rem] break-all font-semibold">
                  {state.display}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {basicButtons.flat().map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-14 text-xl font-semibold transition-colors duration-200 shadow-none ${button.className}`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            {/* ── Scientific ───────────────────────────────────────── */}
            <TabsContent value="scientific" className="space-y-6 mt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  {t("memoryLabel")}: <span dir="ltr">{sciMemory}</span>
                </div>
                <div className="inline-flex rounded-lg border p-1">
                  <button
                    type="button"
                    onClick={() => setAngle("deg")}
                    className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-colors ${
                      angle === "deg"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("deg")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAngle("rad")}
                    className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-colors ${
                      angle === "rad"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("rad")}
                  </button>
                </div>
              </div>

              <div
                className="bg-muted/50 p-6 rounded-xl space-y-3 border"
                dir="ltr"
              >
                <Input
                  value={sciExpr}
                  onChange={(e) => {
                    setSciExpr(e.target.value);
                    setSciError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSciEquals();
                    }
                  }}
                  placeholder={t("scientificPlaceholder")}
                  dir="ltr"
                  aria-label={t("expressionLabel")}
                  className="font-mono text-lg text-start"
                />
                <div
                  className={`text-end text-3xl font-mono min-h-[2.5rem] break-all font-semibold ${
                    sciError ? "text-destructive" : ""
                  }`}
                  data-testid="sci-result"
                >
                  {sciResult}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {sciButtons.map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-12 font-semibold transition-colors duration-200 shadow-none ${button.className}`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            {/* ── Graphing ─────────────────────────────────────────── */}
            <TabsContent value="graph" className="space-y-6 mt-6">
              <div className="space-y-3">
                {functions.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: f.color }}
                      aria-hidden
                    />
                    <Label className="font-mono text-sm shrink-0" dir="ltr">
                      y =
                    </Label>
                    <Input
                      value={f.fn}
                      onChange={(e) => updateFunction(f.id, e.target.value)}
                      placeholder={t("functionPlaceholder")}
                      dir="ltr"
                      aria-label={`${t("functionLabel")} ${i + 1}`}
                      className="font-mono text-start"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFunction(f.id)}
                      aria-label={t("removeFunction")}
                      disabled={functions.length === 1}
                      className="shrink-0"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFunction}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 me-2" />
                  {t("addFunction")}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="x-min">{t("xMin")}</Label>
                  <Input
                    id="x-min"
                    value={xMin}
                    onChange={(e) => setXMin(e.target.value)}
                    dir="ltr"
                    className="font-mono text-start"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="x-max">{t("xMax")}</Label>
                  <Input
                    id="x-max"
                    value={xMax}
                    onChange={(e) => setXMax(e.target.value)}
                    dir="ltr"
                    className="font-mono text-start"
                  />
                </div>
              </div>

              <div
                ref={graphRef}
                dir="ltr"
                data-testid="graph-canvas"
                className="w-full overflow-x-auto rounded-xl border bg-background p-2"
              />
              <p className="text-xs text-muted-foreground text-center">
                {t("graphHint")}
              </p>
            </TabsContent>
          </Tabs>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-4 text-lg">
              {t("keyboardShortcuts")}
            </h3>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
              dir="ltr"
            >
              <div className="space-y-1">
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    0-9
                  </kbd>{" "}
                  {t("shortcutNumbers")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    + - * /
                  </kbd>{" "}
                  {t("shortcutOperations")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    Enter
                  </kbd>{" "}
                  {t("shortcutOr")}{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    =
                  </kbd>{" "}
                  {t("shortcutCalculate")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs font-mono">
                    Escape
                  </kbd>{" "}
                  {t("shortcutClear")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    Backspace
                  </kbd>{" "}
                  {t("shortcutBackspace")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    .
                  </kbd>{" "}
                  {t("shortcutDecimal")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    %
                  </kbd>{" "}
                  {t("shortcutPercentage")}
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    ±
                  </kbd>{" "}
                  {t("shortcutPlusMinus")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolShell>
  );
};

export default Calculator;
