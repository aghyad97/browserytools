"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">{t("loanDetails")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t("loanAmount")}</Label>
                <Input
                  type="number"
                  min="0"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="10000"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("annualInterestRate")}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="5"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t("loanTerm")}</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="3"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <div className="text-sm opacity-80 mb-1">{t("monthlyPayment")}</div>
                    <div className="text-4xl font-bold" dir="ltr">{formatCurrency(result.monthlyPayment)}</div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">{t("totalPayment")}</div>
                      <div className="text-xl font-bold" dir="ltr">{formatCurrency(result.totalPayment)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">{t("totalInterest")}</div>
                      <div className="text-xl font-bold text-orange-500" dir="ltr">{formatCurrency(result.totalInterest)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">{t("principal")}</div>
                      <div className="text-xl font-bold" dir="ltr">{principalPct}%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">{t("interestRatio")}</div>
                      <div className="text-xl font-bold text-orange-500" dir="ltr">{interestPct}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual breakdown bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground" dir="ltr">
                    <span>{t("principal")} {principalPct}%</span>
                    <span>{t("interest")} {interestPct}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-muted flex">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${principalPct}%` }}
                    />
                    <div
                      className="bg-orange-400 h-full transition-all"
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
    </div>
  );
}
