"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_MODELS, PROVIDERS, TIERS } from "@/lib/ai-models";

type SortKey = "name" | "contextWindow" | "inputPricePer1M" | "outputPricePer1M";
type SortDir = "asc" | "desc";

const TIER_COLORS: Record<string, string> = {
  flagship: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  balanced: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  fast: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  open: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function ModelComparison() {
  const t = useTranslations("Tools.ModelComparison");
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    return AI_MODELS.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase());
      const matchProvider = providerFilter === "all" || m.provider === providerFilter;
      const matchTier = tierFilter === "all" || m.tier === tierFilter;
      return matchSearch && matchProvider && matchTier;
    }).sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, providerFilter, tierFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase cursor-pointer hover:text-foreground select-none whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      {label} {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  const tierLabel = (tier: string) => {
    const map: Record<string, string> = {
      flagship: t("flagship"),
      balanced: t("balanced"),
      fast: t("fast"),
      open: t("open"),
    };
    return map[tier] ?? tier;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              dir="auto"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder={t("filterProvider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allProviders")}</SelectItem>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder={t("filterTier")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTiers")}</SelectItem>
                {TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tierLabel(tier)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <SortHeader col="name" label={t("columnModel")} />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                {t("columnProvider")}
              </th>
              <SortHeader col="contextWindow" label={t("columnContext")} />
              <SortHeader col="inputPricePer1M" label={t("columnInputPrice")} />
              <SortHeader col="outputPricePer1M" label={t("columnOutputPrice")} />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                {t("columnTier")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                {t("columnMultimodal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.provider}</td>
                <td className="px-4 py-3 tabular-nums">{m.contextWindow.toLocaleString()}</td>
                <td className="px-4 py-3 tabular-nums">${m.inputPricePer1M}</td>
                <td className="px-4 py-3 tabular-nums">${m.outputPricePer1M}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS[m.tier]}`}
                  >
                    {tierLabel(m.tier)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={m.multimodal ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                    {m.multimodal ? t("yes") : t("no")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">{t("searchPlaceholder")}</div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((m) => (
          <Card key={m.id}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.provider}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TIER_COLORS[m.tier]}`}
                >
                  {tierLabel(m.tier)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">{t("columnContext")}</p>
                  <p className="tabular-nums">
                    {m.contextWindow.toLocaleString()} {t("tokens")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t("columnMultimodal")}</p>
                  <p>{m.multimodal ? t("yes") : t("no")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t("columnInputPrice")}</p>
                  <p className="tabular-nums">${m.inputPricePer1M}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t("columnOutputPrice")}</p>
                  <p className="tabular-nums">${m.outputPricePer1M}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">{t("searchPlaceholder")}</p>
        )}
      </div>
    </div>
  );
}
