"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
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
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { TwoPane } from "@/components/shared/TwoPane";
import { StatStrip } from "@/components/shared/StatStrip";

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
  const t = useTranslations("Tools.CurrencyConverter");
  const tc = useTranslations("ToolsConfig");
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
          setError(t("fetchError"));
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
    <ToolShell
      slug="currency-converter"
      title={tc("tools.currency-converter.name")}
      sub={tc("tools.currency-converter.description")}
    >
      {/* Classic input/output split — settings form on the left, live
          conversion result on the right. */}
      <TwoPane
        start={
          <SettingsCard>
            <OptionRow label={t("amount")} htmlFor="amount">
              <Input
                id="amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.00"
                className="text-lg h-12"
                dir="ltr"
              />
            </OptionRow>

            <OptionRow label={t("fromCurrency")} htmlFor="from-currency">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger id="from-currency" className="h-12">
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
            </OptionRow>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwap}
                className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <ArrowUpDown className="w-5 h-5" />
              </Button>
            </div>

            <OptionRow label={t("toCurrency")} htmlFor="to-currency">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger id="to-currency" className="h-12">
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
            </OptionRow>
          </SettingsCard>
        }
        end={
          <SettingsCard title={t("conversionResult")} description={t("liveExchangeRate")}>
            {/* Primary conversion hero — the tool's visual centerpiece
                (gradient panel + floating rate badge), richer than a stat
                tile, so it stays bespoke rather than folding into StatStrip. */}
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

            {/* Exchange Rate Details — a fixed 2-item set of computed
                summary numbers, exactly what StatStrip is for. */}
            {rate && (
              <StatStrip
                items={[
                  {
                    label: t("exchangeRate"),
                    value: new Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 6,
                    }).format(rate),
                    sub: (
                      <>
                        <div>
                          1 {from} = {rate} {to}
                        </div>
                        <div>{t("rawRate")}</div>
                      </>
                    ),
                  },
                  {
                    label: t("formattedCurrency"),
                    value: formatCurrency(rate, to),
                    sub: (
                      <>
                        <div>
                          {formatCurrency(1, from)} = {formatCurrency(rate, to)}
                        </div>
                        <div>{t("localized")}</div>
                      </>
                    ),
                  },
                ]}
              />
            )}

            {/* Status Messages */}
            {error && (
              <div className="w-full p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-destructive flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive mb-1">
                      {t("errorLabel")}
                    </p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </SettingsCard>
        }
      />
    </ToolShell>
  );
}
