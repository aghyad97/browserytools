"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type BaseKey = "bin" | "oct" | "dec" | "hex";

const baseRadix: Record<BaseKey, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
};

const validators: Record<BaseKey, RegExp> = {
  bin: /^[01]+$/i,
  oct: /^[0-7]+$/i,
  dec: /^-?\d+$/,
  hex: /^[0-9a-f]+$/i,
};

export default function NumberBaseConverter() {
  const [values, setValues] = useState<Record<BaseKey, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });
  const [errorBase, setErrorBase] = useState<BaseKey | null>(null);

  const updateAll = (from: BaseKey, raw: string) => {
    setErrorBase(null);
    if (!raw) {
      setValues({ bin: "", oct: "", dec: "", hex: "" });
      return;
    }

    const cleaned = raw.trim();
    const isValid = validators[from].test(cleaned);
    if (!isValid) {
      setErrorBase(from);
      setValues((prev) => ({ ...prev, [from]: cleaned }));
      return;
    }

    try {
      const num = parseInt(cleaned, baseRadix[from]);
      if (Number.isNaN(num)) throw new Error("Invalid number");

      setValues({
        bin: num.toString(2),
        oct: num.toString(8),
        dec: num.toString(10),
        hex: num.toString(16).toUpperCase(),
      });
    } catch (e) {
      toast.error("Conversion failed");
    }
  };

  const clearAll = () => setValues({ bin: "", oct: "", dec: "", hex: "" });

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Number Base Converter</CardTitle>
          <CardDescription>
            Convert between binary, octal, decimal and hexadecimal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bin">Binary</Label>
            <Input
              id="bin"
              placeholder="e.g., 101011"
              value={values.bin}
              onChange={(e) => updateAll("bin", e.target.value)}
              className={errorBase === "bin" ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oct">Octal</Label>
            <Input
              id="oct"
              placeholder="e.g., 53"
              value={values.oct}
              onChange={(e) => updateAll("oct", e.target.value)}
              className={errorBase === "oct" ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dec">Decimal</Label>
            <Input
              id="dec"
              placeholder="e.g., 43"
              value={values.dec}
              onChange={(e) => updateAll("dec", e.target.value)}
              className={errorBase === "dec" ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hex">Hexadecimal</Label>
            <Input
              id="hex"
              placeholder="e.g., 2B"
              value={values.hex}
              onChange={(e) => updateAll("hex", e.target.value)}
              className={errorBase === "hex" ? "border-destructive" : ""}
            />
          </div>
          <div className="pt-2">
            <Button variant="outline" onClick={clearAll} className="w-full">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
