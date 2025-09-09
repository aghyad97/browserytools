"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalculatorIcon } from "lucide-react";
import { Function } from "@phosphor-icons/react";

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  memory: number;
}

const Calculator = () => {
  const [mode, setMode] = useState<"basic" | "scientific">("basic");
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    expression: "",
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
  });

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
      case "√":
        return Math.sqrt(a);
      case "∛":
        return Math.cbrt(a);
      case "log":
        return Math.log10(a);
      case "ln":
        return Math.log(a);
      case "sin":
        return Math.sin((a * Math.PI) / 180);
      case "cos":
        return Math.cos((a * Math.PI) / 180);
      case "tan":
        return Math.tan((a * Math.PI) / 180);
      case "asin":
        return (Math.asin(a) * 180) / Math.PI;
      case "acos":
        return (Math.acos(a) * 180) / Math.PI;
      case "atan":
        return (Math.atan(a) * 180) / Math.PI;
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
        // Starting fresh calculation or after equals
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
      const displayOp = op === "×" ? "×" : op === "÷" ? "÷" : op;

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
        } catch (error) {
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
      } catch (error) {
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
    setState({
      display: "0",
      expression: "",
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      memory: 0,
    });
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

  const handleScientificFunction = (func: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      try {
        const result = calculate(currentValue, 0, func);
        const funcDisplay = func === "√" ? "√" : func === "∛" ? "∛" : func;
        return {
          ...prev,
          display: formatNumber(result),
          expression:
            funcDisplay + "(" + prev.display + ") = " + formatNumber(result),
          waitingForNewValue: true,
        };
      } catch (error) {
        return {
          ...prev,
          display: "Error",
          expression: func + "(" + prev.display + ") = Error",
          waitingForNewValue: true,
        };
      }
    });
  };

  const handleMemoryOperation = (op: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      switch (op) {
        case "MC":
          return { ...prev, memory: 0 };
        case "MR":
          return {
            ...prev,
            display: formatNumber(prev.memory),
            expression: "MR = " + formatNumber(prev.memory),
            waitingForNewValue: true,
          };
        case "M+":
          return { ...prev, memory: prev.memory + currentValue };
        case "M-":
          return { ...prev, memory: prev.memory - currentValue };
        case "MS":
          return { ...prev, memory: currentValue };
        default:
          return prev;
      }
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

  const handlePi = () => {
    setState((prev) => ({
      ...prev,
      display: Math.PI.toString(),
      expression: prev.expression + "π",
      waitingForNewValue: true,
    }));
  };

  const handleE = () => {
    setState((prev) => ({
      ...prev,
      display: Math.E.toString(),
      expression: prev.expression + "e",
      waitingForNewValue: true,
    }));
  };

  const handleFactorial = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      if (currentValue < 0 || currentValue !== Math.floor(currentValue)) {
        return {
          ...prev,
          display: "Error",
          expression: prev.display + "! = Error",
          waitingForNewValue: true,
        };
      }

      let result = 1;
      for (let i = 2; i <= currentValue; i++) {
        result *= i;
        if (result > 1e15) {
          return {
            ...prev,
            display: "Error",
            expression: prev.display + "! = Error",
            waitingForNewValue: true,
          };
        }
      }

      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.display + "! = " + formatNumber(result),
        waitingForNewValue: true,
      };
    });
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
  }, []);

  const basicButtons = [
    [
      {
        label: "C",
        onClick: handleClear,
        className: "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer",
      },
      {
        label: "CE",
        onClick: handleClearEntry,
        className: "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer",
      },
      {
        label: "⌫",
        onClick: handleBackspace,
        className: "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer",
      },
      {
        label: "÷",
        onClick: () => handleOperation("÷"),
        className: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
      },
    ],
    [
      {
        label: "7",
        onClick: () => handleNumber("7"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "8",
        onClick: () => handleNumber("8"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "9",
        onClick: () => handleNumber("9"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "×",
        onClick: () => handleOperation("×"),
        className: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
      },
    ],
    [
      {
        label: "4",
        onClick: () => handleNumber("4"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "5",
        onClick: () => handleNumber("5"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "6",
        onClick: () => handleNumber("6"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "-",
        onClick: () => handleOperation("-"),
        className: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
      },
    ],
    [
      {
        label: "1",
        onClick: () => handleNumber("1"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "2",
        onClick: () => handleNumber("2"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "3",
        onClick: () => handleNumber("3"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: "+",
        onClick: () => handleOperation("+"),
        className: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
      },
    ],
    [
      {
        label: "±",
        onClick: handlePlusMinus,
        className: "bg-slate-500 hover:bg-slate-600 text-white cursor-pointer",
      },
      {
        label: "0",
        onClick: () => handleNumber("0"),
        className:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer",
      },
      {
        label: ".",
        onClick: handleDecimal,
        className: "bg-slate-500 hover:bg-slate-600 text-white cursor-pointer",
      },
      {
        label: "=",
        onClick: handleEquals,
        className:
          "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer",
      },
    ],
  ];

  const scientificButtons = [
    [
      {
        label: "sin",
        onClick: () => handleScientificFunction("sin"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "cos",
        onClick: () => handleScientificFunction("cos"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "tan",
        onClick: () => handleScientificFunction("tan"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "log",
        onClick: () => handleScientificFunction("log"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
    ],
    [
      {
        label: "asin",
        onClick: () => handleScientificFunction("asin"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "acos",
        onClick: () => handleScientificFunction("acos"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "atan",
        onClick: () => handleScientificFunction("atan"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "ln",
        onClick: () => handleScientificFunction("ln"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
    ],
    [
      {
        label: "x²",
        onClick: () => handleOperation("^"),
        className:
          "bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
      },
      {
        label: "√",
        onClick: () => handleScientificFunction("√"),
        className:
          "bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
      },
      {
        label: "∛",
        onClick: () => handleScientificFunction("∛"),
        className:
          "bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
      },
      {
        label: "x!",
        onClick: handleFactorial,
        className:
          "bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
      },
    ],
    [
      {
        label: "π",
        onClick: handlePi,
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "e",
        onClick: handleE,
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "%",
        onClick: handlePercentage,
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "^",
        onClick: () => handleOperation("^"),
        className:
          "bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
      },
    ],
    [
      {
        label: "MC",
        onClick: () => handleMemoryOperation("MC"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "MR",
        onClick: () => handleMemoryOperation("MR"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "M+",
        onClick: () => handleMemoryOperation("M+"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
      {
        label: "M-",
        onClick: () => handleMemoryOperation("M-"),
        className:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs",
      },
    ],
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="border bg-card/50 backdrop-blur-sm shadow-none">
        <CardContent className="space-y-6 pt-6">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "basic" | "scientific")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger
                value="scientific"
                className="flex items-center gap-2"
              >
                <Function className="h-4 w-4" />
                Scientific
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Display */}
              <div className="bg-muted/50 p-6 rounded-xl text-right space-y-3 border">
                <div className="text-sm text-muted-foreground font-mono min-h-[1.5rem] break-all opacity-80">
                  {state.expression || "Expression will appear here"}
                </div>
                <div className="text-4xl font-mono min-h-[2.5rem] break-all font-semibold">
                  {state.display}
                </div>
              </div>

              {/* Basic Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {basicButtons.flat().map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-14 text-lg font-semibold transition-colors duration-200 shadow-none ${
                      button.className || "bg-background border"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scientific" className="space-y-6">
              {/* Display */}
              <div className="bg-muted/50 p-6 rounded-xl text-right space-y-3 border">
                <div className="text-sm text-muted-foreground font-mono min-h-[1.5rem] break-all opacity-80">
                  {state.expression || "Expression will appear here"}
                </div>
                <div className="text-4xl font-mono min-h-[2.5rem] break-all font-semibold">
                  {state.display}
                </div>
              </div>

              {/* Scientific Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {scientificButtons.flat().map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-12 text-sm font-semibold transition-colors duration-200 shadow-none ${
                      button.className ||
                      "bg-background hover:bg-accent hover:text-accent-foreground border"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>

              {/* Basic operations for scientific mode */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {basicButtons.flat().map((button, index) => (
                  <Button
                    key={`basic-${index}`}
                    onClick={button.onClick}
                    className={`h-14 text-lg font-semibold transition-colors duration-200 shadow-none ${
                      button.className ||
                      "bg-background hover:bg-accent hover:text-accent-foreground border"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-4 text-lg">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    0-9
                  </kbd>{" "}
                  Input numbers
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    + - * /
                  </kbd>{" "}
                  Basic operations
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    Enter
                  </kbd>{" "}
                  or{" "}
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">
                    =
                  </kbd>{" "}
                  Calculate result
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs font-mono">
                    Escape
                  </kbd>{" "}
                  Clear all
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    Backspace
                  </kbd>{" "}
                  Delete last digit
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    .
                  </kbd>{" "}
                  Decimal point
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    %
                  </kbd>{" "}
                  Percentage
                </p>
                <p className="text-foreground">
                  •{" "}
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                    ±
                  </kbd>{" "}
                  Plus/minus toggle
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
