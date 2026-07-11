"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import {
  elements,
  categoryOrder,
  categoryStyles,
  categorySwatch,
  type ChemElement,
  type ElementCategory,
} from "@/lib/periodic-table-data";

export default function PeriodicTable() {
  const t = useTranslations("Tools.PeriodicTable");
  const tc = useTranslations("ToolsConfig");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ElementCategory | null>(
    null,
  );
  const [selected, setSelected] = useState<ChemElement | null>(null);

  const categoryLabel = (c: ElementCategory): string => {
    switch (c) {
      case "alkali-metal":
        return t("cat.alkali-metal");
      case "alkaline-earth-metal":
        return t("cat.alkaline-earth-metal");
      case "transition-metal":
        return t("cat.transition-metal");
      case "post-transition-metal":
        return t("cat.post-transition-metal");
      case "metalloid":
        return t("cat.metalloid");
      case "nonmetal":
        return t("cat.nonmetal");
      case "halogen":
        return t("cat.halogen");
      case "noble-gas":
        return t("cat.noble-gas");
      case "lanthanide":
        return t("cat.lanthanide");
      case "actinide":
        return t("cat.actinide");
      default:
        return t("cat.unknown");
    }
  };

  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    const set = new Set<number>();
    if (!normalizedQuery && !activeCategory) return null;
    for (const el of elements) {
      const matchesQuery =
        !normalizedQuery ||
        el.name.toLowerCase().includes(normalizedQuery) ||
        el.symbol.toLowerCase().includes(normalizedQuery) ||
        String(el.number) === normalizedQuery;
      const matchesCategory = !activeCategory || el.category === activeCategory;
      if (matchesQuery && matchesCategory) set.add(el.number);
    }
    return set;
  }, [normalizedQuery, activeCategory]);

  const isDimmed = (el: ChemElement) => matches !== null && !matches.has(el.number);

  const clearFilters = () => {
    setQuery("");
    setActiveCategory(null);
  };

  return (
    <ToolShell
      slug="periodic-table"
      title={tc("tools.periodic-table.name")}
      sub={tc("tools.periodic-table.description")}
    >
      <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="ps-9"
              />
            </div>
            {(query || activeCategory) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 me-2" />
                {t("clear")}
              </Button>
            )}
          </div>

          {/* Legend / category filter */}
          <Card className="p-3">
            <div className="flex flex-wrap gap-2">
              {categoryOrder.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setActiveCategory((prev) => (prev === c ? null : c))
                  }
                  aria-pressed={activeCategory === c}
                  className={`flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    activeCategory === c
                      ? "border-foreground bg-muted"
                      : "border-transparent hover:bg-muted/60"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-sm ${categorySwatch[c]}`}
                    aria-hidden="true"
                  />
                  {categoryLabel(c)}
                </button>
              ))}
            </div>
          </Card>

          {/* Periodic grid — kept LTR regardless of UI direction */}
          <div className="overflow-x-auto">
            <div
              dir="ltr"
              data-testid="periodic-grid"
              className="grid gap-1 min-w-[760px]"
              style={{
                gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
                gridTemplateRows: "repeat(10, minmax(0, 1fr))",
              }}
            >
              {elements.map((el) => (
                <button
                  key={el.number}
                  type="button"
                  data-testid="element-tile"
                  data-symbol={el.symbol}
                  onClick={() => setSelected(el)}
                  title={el.name}
                  style={{ gridColumn: el.xpos, gridRow: el.ypos }}
                  className={`group aspect-square rounded-sm border border-black/5 dark:border-white/10 p-1 text-start leading-none transition-all hover:scale-[1.08] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    categoryStyles[el.category]
                  } ${isDimmed(el) ? "opacity-20" : "opacity-100"}`}
                >
                  <span className="block text-[0.5rem] sm:text-[0.6rem] tabular-nums">
                    {el.number}
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold">
                    {el.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{t("hint")}</p>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span
                    dir="ltr"
                    className={`flex h-14 w-14 flex-col items-center justify-center rounded-md ${categoryStyles[selected.category]}`}
                  >
                    <span className="text-[0.6rem] tabular-nums">
                      {selected.number}
                    </span>
                    <span className="text-xl font-bold">{selected.symbol}</span>
                  </span>
                  <span>{selected.name}</span>
                </DialogTitle>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Detail label={t("detail.number")} value={String(selected.number)} ltr />
                <Detail label={t("detail.symbol")} value={selected.symbol} ltr />
                <Detail label={t("detail.mass")} value={selected.mass} ltr />
                <Detail label={t("detail.category")} value={categoryLabel(selected.category)} />
                <Detail label={t("detail.group")} value={String(selected.group)} ltr />
                <Detail label={t("detail.period")} value={String(selected.period)} ltr />
                <Detail label={t("detail.block")} value={`${selected.block}-block`} ltr />
                <div className="col-span-2">
                  <dt className="text-muted-foreground">{t("detail.config")}</dt>
                  <dd dir="ltr" className="font-mono text-start">{selected.config}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ToolShell>
  );
}

function Detail({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className="font-medium text-start">
        {value}
      </dd>
    </div>
  );
}
