"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";

interface ConversionUnit {
  name: string;
  factor: number;
  symbol: string;
}

interface ConversionCategory {
  name: string;
  units: ConversionUnit[];
}

const conversionCategories: ConversionCategory[] = [
  {
    name: "Length",
    units: [
      { name: "Millimeter", factor: 0.001, symbol: "mm" },
      { name: "Centimeter", factor: 0.01, symbol: "cm" },
      { name: "Meter", factor: 1, symbol: "m" },
      { name: "Kilometer", factor: 1000, symbol: "km" },
      { name: "Inch", factor: 0.0254, symbol: "in" },
      { name: "Foot", factor: 0.3048, symbol: "ft" },
      { name: "Yard", factor: 0.9144, symbol: "yd" },
      { name: "Mile", factor: 1609.344, symbol: "mi" },
    ],
  },
  {
    name: "Weight",
    units: [
      { name: "Milligram", factor: 0.001, symbol: "mg" },
      { name: "Gram", factor: 1, symbol: "g" },
      { name: "Kilogram", factor: 1000, symbol: "kg" },
      { name: "Ounce", factor: 28.3495, symbol: "oz" },
      { name: "Pound", factor: 453.592, symbol: "lb" },
      { name: "Stone", factor: 6350.29, symbol: "st" },
      { name: "Ton (Metric)", factor: 1000000, symbol: "t" },
      { name: "Ton (US)", factor: 907185, symbol: "ton" },
    ],
  },
  {
    name: "Temperature",
    units: [
      { name: "Celsius", factor: 1, symbol: "°C" },
      { name: "Fahrenheit", factor: 1, symbol: "°F" },
      { name: "Kelvin", factor: 1, symbol: "K" },
    ],
  },
  {
    name: "Area",
    units: [
      { name: "Square Millimeter", factor: 0.000001, symbol: "mm²" },
      { name: "Square Centimeter", factor: 0.0001, symbol: "cm²" },
      { name: "Square Meter", factor: 1, symbol: "m²" },
      { name: "Square Kilometer", factor: 1000000, symbol: "km²" },
      { name: "Square Inch", factor: 0.00064516, symbol: "in²" },
      { name: "Square Foot", factor: 0.092903, symbol: "ft²" },
      { name: "Square Yard", factor: 0.836127, symbol: "yd²" },
      { name: "Acre", factor: 4046.86, symbol: "ac" },
      { name: "Hectare", factor: 10000, symbol: "ha" },
    ],
  },
  {
    name: "Volume",
    units: [
      { name: "Milliliter", factor: 0.001, symbol: "ml" },
      { name: "Liter", factor: 1, symbol: "l" },
      { name: "Cubic Meter", factor: 1000, symbol: "m³" },
      { name: "Fluid Ounce (US)", factor: 0.0295735, symbol: "fl oz" },
      { name: "Cup (US)", factor: 0.236588, symbol: "cup" },
      { name: "Pint (US)", factor: 0.473176, symbol: "pt" },
      { name: "Quart (US)", factor: 0.946353, symbol: "qt" },
      { name: "Gallon (US)", factor: 3.78541, symbol: "gal" },
      { name: "Cubic Inch", factor: 0.0163871, symbol: "in³" },
      { name: "Cubic Foot", factor: 28.3168, symbol: "ft³" },
    ],
  },
  {
    name: "Speed",
    units: [
      { name: "Meter per Second", factor: 1, symbol: "m/s" },
      { name: "Kilometer per Hour", factor: 0.277778, symbol: "km/h" },
      { name: "Mile per Hour", factor: 0.44704, symbol: "mph" },
      { name: "Foot per Second", factor: 0.3048, symbol: "ft/s" },
      { name: "Knot", factor: 0.514444, symbol: "kn" },
    ],
  },
];

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const currentCategory = conversionCategories.find(
    (cat) => cat.name === activeCategory
  );
  const fromUnitData = currentCategory?.units.find(
    (unit) => unit.name === fromUnit
  );
  const toUnitData = currentCategory?.units.find(
    (unit) => unit.name === toUnit
  );

  const convertValue = (
    value: number,
    from: ConversionUnit,
    to: ConversionUnit
  ): number => {
    if (activeCategory === "Temperature") {
      return convertTemperature(value, from.name, to.name);
    }

    // Convert to base unit, then to target unit
    const baseValue = value * from.factor;
    return baseValue / to.factor;
  };

  const convertTemperature = (
    value: number,
    from: string,
    to: string
  ): number => {
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case "Celsius":
        celsius = value;
        break;
      case "Fahrenheit":
        celsius = ((value - 32) * 5) / 9;
        break;
      case "Kelvin":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case "Celsius":
        return celsius;
      case "Fahrenheit":
        return (celsius * 9) / 5 + 32;
      case "Kelvin":
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);

    if (value === "" || !fromUnitData || !toUnitData) {
      setToValue("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setToValue("");
      return;
    }

    const converted = convertValue(numValue, fromUnitData, toUnitData);
    setToValue(converted.toFixed(6).replace(/\.?0+$/, ""));
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);

    if (value === "" || !fromUnitData || !toUnitData) {
      setFromValue("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setFromValue("");
      return;
    }

    const converted = convertValue(numValue, toUnitData, fromUnitData);
    setFromValue(converted.toFixed(6).replace(/\.?0+$/, ""));
  };

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;

    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleClear = () => {
    setFromValue("");
    setToValue("");
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const categoryData = conversionCategories.find(
      (cat) => cat.name === category
    );
    if (categoryData) {
      setFromUnit(categoryData.units[0].name);
      setToUnit(categoryData.units[1]?.name || categoryData.units[0].name);
    }
    setFromValue("");
    setToValue("");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
        <p className="text-muted-foreground">
          Convert between different units of measurement including length,
          weight, temperature, area, volume, and speed.
        </p>
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {conversionCategories.map((category) => (
            <TabsTrigger key={category.name} value={category.name}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {conversionCategories.map((category) => (
          <TabsContent
            key={category.name}
            value={category.name}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {category.name} Converter
                </CardTitle>
                <CardDescription>
                  Convert between different {category.name.toLowerCase()} units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* From Unit */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-unit">From</Label>
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {category.units.map((unit) => (
                            <SelectItem key={unit.name} value={unit.name}>
                              {unit.name} ({unit.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-value">Value</Label>
                      <Input
                        id="from-value"
                        type="number"
                        placeholder="Enter value"
                        value={fromValue}
                        onChange={(e) => handleFromValueChange(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwapUnits}
                      className="rounded-full p-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* To Unit */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="to-unit">To</Label>
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {category.units.map((unit) => (
                            <SelectItem key={unit.name} value={unit.name}>
                              {unit.name} ({unit.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-value">Value</Label>
                      <Input
                        id="to-value"
                        type="number"
                        placeholder="Converted value"
                        value={toValue}
                        onChange={(e) => handleToValueChange(e.target.value)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </Button>
                </div>

                {/* Conversion Info */}
                {fromValue && toValue && fromUnitData && toUnitData && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>
                        <NumberFlow value={parseFloat(fromValue)} />
                      </strong>{" "}
                      {fromUnitData.symbol} ={" "}
                      <strong>
                        <NumberFlow value={parseFloat(toValue)} />
                      </strong>{" "}
                      {toUnitData.symbol}
                    </p>
                    {activeCategory !== "Temperature" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        1 {fromUnitData.symbol} ={" "}
                        <NumberFlow
                          value={parseFloat(
                            (fromUnitData.factor / toUnitData.factor).toFixed(6)
                          )}
                        />{" "}
                        {toUnitData.symbol}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Conversions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Conversions</CardTitle>
          <CardDescription>Common conversion examples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Length</p>
              <p>1 meter = 3.281 feet</p>
              <p>1 kilometer = 0.621 miles</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Weight</p>
              <p>1 kilogram = 2.205 pounds</p>
              <p>1 pound = 0.454 kilograms</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Temperature</p>
              <p>0°C = 32°F</p>
              <p>100°C = 212°F</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Area</p>
              <p>1 square meter = 10.764 square feet</p>
              <p>1 acre = 4,047 square meters</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Volume</p>
              <p>1 liter = 0.264 gallons</p>
              <p>1 gallon = 3.785 liters</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Speed</p>
              <p>1 m/s = 3.6 km/h</p>
              <p>1 mph = 1.609 km/h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
