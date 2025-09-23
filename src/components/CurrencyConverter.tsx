"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import NumberFlow from "@number-flow/react";

const CURRENCY_API_BASE = "https://api.frankfurter.app";

const STORAGE_KEY = "bt_currency_rates_v3";

type StoredRates = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

// Frankfurter.app supported currencies (major currencies only)
const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
  "MXN",
  "SGD",
  "HKD",
  "NOK",
  "TRY",
  "RUB",
  "INR",
  "BRL",
  "ZAR",
  "DKK",
  "PLN",
  "TWD",
  "THB",
  "MYR",
  "PHP",
  "IDR",
  "KRW",
  "CZK",
  "HUF",
  "ILS",
  "CLP",
  "AED",
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "JOD",
  "LBP",
  "EGP",
  "RON",
  "BGN",
  "HRK",
  "ISK",
  "UAH",
  "COP",
  "PEN",
  "ARS",
  "UYU",
  "VND",
];

function normalizeCode(code: string) {
  return code.toLowerCase();
}

function formatCurrency(value: number, code: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code.toUpperCase(),
      maximumFractionDigits: 6,
    }).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: "decimal",
      maximumFractionDigits: 6,
    }).format(value);
  }
}

async function fetchRates(base: string): Promise<StoredRates> {
  const baseLc = normalizeCode(base);

  try {
    // Try Frankfurter.app first
    const res = await fetch(`${CURRENCY_API_BASE}/latest?from=${baseLc}`, {
      cache: "reload",
    });
    if (!res.ok) throw new Error("Frankfurter API failed");
    const data: FrankfurterResponse = await res.json();

    return {
      base: data.base.toUpperCase(),
      date: data.date,
      rates: data.rates,
    };
  } catch (error) {
    // Fallback to ExchangeRate-API (no key required)
    try {
      const fallbackRes = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${baseLc}`,
        {
          cache: "reload",
        }
      );
      if (!fallbackRes.ok) throw new Error("Fallback API failed");
      const fallbackData = await fallbackRes.json();

      return {
        base: fallbackData.base,
        date: fallbackData.date,
        rates: fallbackData.rates,
      };
    } catch (fallbackError) {
      throw new Error("All currency APIs are currently unavailable");
    }
  }
}

function getStored(base: string): StoredRates | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, StoredRates>;
    return parsed[base.toUpperCase()] || null;
  } catch {
    return null;
  }
}

function setStored(value: StoredRates) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  let parsed: Record<string, StoredRates> = {};
  try {
    parsed = raw ? (JSON.parse(raw) as Record<string, StoredRates>) : {};
  } catch {
    parsed = {};
  }
  parsed[value.base] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("EUR");
  const [rates, setRates] = useState<StoredRates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const currencyList = useMemo(() => {
    return SUPPORTED_CURRENCIES.sort();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError("");
      setLoading(true);
      try {
        const cached = getStored(from);
        if (cached) {
          setRates(cached);
        }
        const fresh = await fetchRates(from);
        if (!cancelled) {
          setRates(fresh);
          setStored(fresh);
        }
      } catch (e: any) {
        if (!cancelled && !rates) {
          setError(
            "Unable to fetch rates. Using any cached data if available."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  const numericAmount = useMemo(() => {
    const n = parseFloat(amount);
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const rate = useMemo(() => {
    const code = to.toUpperCase();
    const foundRate = rates?.rates?.[code] ?? null;

    // Debug logging
    if (rates && !foundRate) {
      console.log("Available rates:", Object.keys(rates.rates));
      console.log("Looking for:", code);
    }

    return foundRate;
  }, [rates, to]);

  const converted = useMemo(() => {
    if (!rate) return 0;

    // If converting to the same currency, return the same amount
    if (from.toUpperCase() === to.toUpperCase()) {
      return numericAmount;
    }

    return numericAmount * rate;
  }, [numericAmount, rate, from, to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6"></div>
      {/* Main Converter Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Input Section */}
            <div className="p-8 space-y-6 bg-gradient-to-br from-background to-muted/20 border-r border-border">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1.00"
                      className="text-lg h-12 pl-4 pr-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">From Currency</Label>
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyList.map((c) => (
                        <SelectItem key={c} value={c}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{c}</span>
                            <span className="text-muted-foreground text-xs">
                              {formatCurrency(1, c)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">To Currency</Label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyList.map((c) => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{c}</span>
                          <span className="text-muted-foreground text-xs">
                            {formatCurrency(1, c)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Result Section */}
            <div className="p-8 space-y-6 min-h-full">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-lg font-semibold">Conversion Result</h3>
                <p className="text-sm text-muted-foreground">
                  Live exchange rate conversion
                </p>
              </div>

              {/* Main Result */}
              <div className="space-y-6 w-full">
                {/* Primary Conversion Result */}
                <div className="relative">
                  <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl border-2 border-primary/20 shadow-lg">
                    <div className="text-center space-y-4">
                      {/* From Amount */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {from}
                        </p>
                        <div className="text-4xl font-bold text-foreground">
                          <NumberFlow value={numericAmount} />
                        </div>
                      </div>

                      {/* Conversion Arrow */}
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <ArrowUpDown className="w-6 h-6 text-primary rotate-90" />
                        </div>
                      </div>

                      {/* To Amount */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {to}
                        </p>
                        <div className="text-5xl font-bold text-primary">
                          <NumberFlow value={converted} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Rate Badge */}
                  {rate && (
                    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      1 {from} ={" "}
                      {new Intl.NumberFormat(undefined, {
                        maximumFractionDigits: 4,
                      }).format(rate)}{" "}
                      {to}
                    </div>
                  )}
                </div>

                {/* Exchange Rate Details */}
                {rate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Exchange Rate
                        </p>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">
                            {new Intl.NumberFormat(undefined, {
                              maximumFractionDigits: 6,
                            }).format(rate)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            1 {from} = {rate} {to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Raw Rate
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Formatted Currency
                        </p>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">
                            {formatCurrency(rate, to)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(1, from)} ={" "}
                            {formatCurrency(rate, to)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Localized
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {error && (
                  <div className="w-full p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-destructive flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive mb-1">
                          Error
                        </p>
                        <p className="text-sm text-destructive/80">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
