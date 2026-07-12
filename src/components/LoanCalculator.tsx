"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { StatStrip } from "@/components/shared/StatStrip";

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calculateLoan(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || annualRate < 0 || months <= 0) return null;
  if (annualRate === 0) {
    const monthly = principal / months;
    return {
      monthlyPayment: monthly,
      totalPayment: monthly * months,
      totalInterest: 0,
      schedule: Array.from({ length: months }, (_, i) => ({
        month: i + 1,
        payment: monthly,
        principal: monthly,
        interest: 0,
        balance: principal - monthly * (i + 1),
      })),
    };
  }

  const r = annualRate / 100 / 12;
  const monthlyPayment = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  let balance = principal;
  const schedule: AmortizationRow[] = [];
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const prin = Math.min(monthlyPayment - interest, balance);
    balance -= prin;
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: prin,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return { monthlyPayment, totalPayment, totalInterest, schedule };
}

export default function LoanCalculator() {
  const t = useTranslations("Tools.LoanCalculator");
  const tc = useTranslations("ToolsConfig");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("3");
  const [showSchedule, setShowSchedule] = useState(false);

  const months = Math.round(parseFloat(years) * 12) || 0;
  const result = useMemo(
    () => calculateLoan(parseFloat(principal), parseFloat(rate), months),
    [principal, rate, months]
  );

  const principalPct = result
    ? ((parseFloat(principal) / result.totalPayment) * 100).toFixed(1)
    : "0";
  const interestPct = result
    ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
    : "0";

  return (
    <ToolShell
      slug="loan-calculator"
      title={tc("tools.loan-calculator.name")}
      sub={tc("tools.loan-calculator.description")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsCard title={t("loanDetails")}>
            <OptionRow label={t("loanAmount")} htmlFor="loan-amount">
              <Input
                id="loan-amount"
                type="number"
                min="0"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000"
                dir="ltr"
              />
            </OptionRow>
            <OptionRow label={t("annualInterestRate")} htmlFor="loan-rate">
              <Input
                id="loan-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="5"
                dir="ltr"
              />
            </OptionRow>
            <OptionRow label={t("loanTerm")} htmlFor="loan-years">
              <Input
                id="loan-years"
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="3"
                dir="ltr"
              />
            </OptionRow>
          </SettingsCard>

          <div className="space-y-4">
            {result ? (
              <>
                {/* Hero readout stays a bespoke colored surface (bg-primary) —
                    it's a deliberate visual emphasis for the single headline
                    number, not a generic stat tile. */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <div className="text-sm opacity-80 mb-1">{t("monthlyPayment")}</div>
                    <div className="text-4xl font-bold" dir="ltr">{formatCurrency(result.monthlyPayment)}</div>
                  </CardContent>
                </Card>

                <StatStrip
                  items={[
                    { label: t("totalPayment"), value: <span dir="ltr">{formatCurrency(result.totalPayment)}</span> },
                    // content value: orange highlights the interest-vs-principal
                    // split; no --bt token distinguishes "interest" from other
                    // numeric results, so the literal stays.
                    { label: t("totalInterest"), value: <span className="text-orange-500" dir="ltr">{formatCurrency(result.totalInterest)}</span> },
                    { label: t("principal"), value: <span dir="ltr">{principalPct}%</span> },
                    { label: t("interestRatio"), value: <span className="text-orange-500" dir="ltr">{interestPct}%</span> },
                  ]}
                />

                {/* Visual breakdown bar: embedded proportional visualization,
                    stays bespoke — no molecule fits a progress/split bar. */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground" dir="ltr">
                    <span>{t("principal")} {principalPct}%</span>
                    <span>{t("interest")} {interestPct}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-muted flex">
                    <div
                      className="bg-primary h-full transition-[width]"
                      style={{ width: `${principalPct}%` }}
                    />
                    <div
                      className="bg-orange-400 h-full transition-[width]"
                      style={{ width: `${interestPct}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {t("enterDetails")}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {result && result.schedule.length > 0 && (
          <div>
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-sm text-primary underline underline-offset-4 hover:opacity-80"
            >
              {showSchedule ? t("hideSchedule") : t("showSchedule")} ({months} {t("payments")})
            </button>

            {/* Amortization table: data table with per-row values, stays
                bespoke — no molecule fits a scrollable data table. */}
            {showSchedule && (
              <Card className="mt-3 overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted">
                      <tr>
                        {[t("month"), t("payment"), t("principal"), t("interest"), t("balance")].map((h) => (
                          <th key={h} className="px-4 py-2 text-start font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {result.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-muted/50">
                          <td className="px-4 py-2">{row.month}</td>
                          <td className="px-4 py-2">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-2 text-primary">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 text-orange-500">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
