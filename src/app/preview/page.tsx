"use client";

/**
 * /preview — design-direction prototype (landing).
 * Rail + filterable catalog + ⌘K + live on-device demo.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CoffeeIcon } from "lucide-react";
import { Rail, CommandPalette, useCommandPalette, LiveDemo, ALL_TOOLS, CATEGORIES, CATEGORY_COLORS, inter } from "./ui";
import s from "./preview.module.css";

const EASE = [0.23, 1, 0.32, 1] as const;

const APPS = [
  {
    name: "Subtitle Studio",
    desc: "Transcribe, edit and burn subtitles into video. 100% locally.",
    viz: "subtitles",
  },
  {
    name: "Chat with your PDF",
    desc: "Ask questions, get cited answers. The model runs in your browser.",
    viz: "chat",
  },
  {
    name: "Invoice Studio",
    desc: "Clients, templates, branding. Your books never leave the device.",
    viz: "invoice",
  },
];

function AppViz({ kind }: { kind: string }) {
  if (kind === "subtitles")
    return (
      <div className={s.appViz}>
        <div className={s.vizRow} style={{ top: 12, width: "55%" }} />
        <div className={s.vizRow} style={{ top: 28, width: "70%" }} />
        <div className={`${s.vizChip} ${s.vizAccent}`} style={{ top: 26, left: 10, width: 46, height: 12 }} />
        <div className={s.vizWave}>
          {Array.from({ length: 32 }, (_, i) => (
            <span
              key={i}
              className={s.vizBar}
              style={{ height: `${30 + 60 * Math.abs(Math.sin(i * 1.7))}%`, animationDelay: `${i * 55}ms` }}
            />
          ))}
        </div>
      </div>
    );
  if (kind === "chat")
    return (
      <div className={s.appViz}>
        <div className={s.vizChip} style={{ top: 14, left: 10, width: "52%", height: 22, borderRadius: 8 }} />
        <div
          className={`${s.vizChip} ${s.vizAccent}`}
          style={{ top: 44, right: 10, width: "42%", height: 22, borderRadius: 8 }}
        />
        <div className={s.vizChip} style={{ top: 74, left: 10, width: "60%", height: 22, borderRadius: 8 }} />
      </div>
    );
  return (
    <div className={s.appViz}>
      <div className={s.vizRow} style={{ top: 14, width: "40%" }} />
      <div className={s.vizRow} style={{ top: 34, width: "78%" }} />
      <div className={s.vizRow} style={{ top: 50, width: "78%" }} />
      <div className={s.vizRow} style={{ top: 66, width: "78%" }} />
      <div className={`${s.vizChip} ${s.vizAccent}`} style={{ bottom: 12, right: 10, width: 74, height: 16 }} />
    </div>
  );
}

export default function PreviewPage() {
  const { open, setOpen } = useCommandPalette();
  const [category, setCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const firstPaint = useRef(true);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => {
      firstPaint.current = false;
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const visible = useMemo(
    () => (category ? ALL_TOOLS.filter((t) => t.categoryId === category) : ALL_TOOLS.slice(0, 47)),
    [category],
  );

  return (
    <div className={`${s.root} ${inter.className}`} data-mounted={mounted}>
      <Rail activeCategory={category} onCategory={setCategory} onSearch={() => setOpen(true)} />
      <CommandPalette open={open} onClose={() => setOpen(false)} />

      <main className={s.canvas}>
        <div className={`${s.topRow} ${s.enter}`} style={{ "--d": "0ms" } as React.CSSProperties}>
          <h1 className={s.statement}>
            Every tool you need. <span className={s.statementMuted}>Nothing leaves your device.</span>
          </h1>
          <a className={s.pill} href="/coffee" target="_blank" rel="noreferrer">
            <CoffeeIcon size={13} className={s.coffeeIcon} />
            Buy me a coffee
          </a>
        </div>

        <div className={`${s.enter}`} style={{ "--d": "40ms", marginTop: 14 } as React.CSSProperties}>
          <button className={s.searchBar} onClick={() => setOpen(true)}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>Search 140+ tools…</span>
            <span className={s.kbd}>⌘K</span>
          </button>
        </div>

        <div className={`${s.enter}`} style={{ "--d": "80ms" } as React.CSSProperties}>
          <LiveDemo />
        </div>

        <div className={`${s.sectionLabel} ${s.enter}`} style={{ "--d": "120ms" } as React.CSSProperties}>
          Apps <span className={s.sectionRule} />
        </div>
        <div className={s.apps}>
          {APPS.map((app, i) => (
            <div
              key={app.name}
              className={`${s.appCard} ${s.enter}`}
              style={{ "--d": `${150 + i * 50}ms` } as React.CSSProperties}
            >
              <AppViz kind={app.viz} />
              <div className={s.appBody}>
                <div className={s.appName}>{app.name}</div>
                <div className={s.appDesc}>{app.desc}</div>
                <div className={s.appMeta}>
                  <span className={s.onDevice}>
                    <span className={s.liveDot} /> on-device
                  </span>
                  <span className={s.appArrow}>↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${s.sectionLabel} ${s.enter}`} style={{ "--d": "300ms" } as React.CSSProperties}>
          {category ? CATEGORIES.find((c) => c.id === category)?.label : "Popular"}
          <span className={s.sectionRule} />
        </div>

        <div className={`${s.filters} ${s.enter}`} style={{ "--d": "330ms" } as React.CSSProperties}>
          <button className={category === null ? s.filterActive : s.filter} onClick={() => setCategory(null)}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={category === c.id ? s.filterActive : s.filter}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <motion.div className={s.grid} layout transition={{ duration: 0.24, ease: EASE }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.href}
                  layout
                  initial={firstPaint.current ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <Link
                    href={tool.href === "/tools/image-compression" ? "/preview/tool" : tool.href}
                    className={`${s.tile} ${s.enter}`}
                    style={
                      {
                        "--d": `${Math.min(360 + i * 18, 700)}ms`,
                        "--chip-bg": CATEGORY_COLORS[tool.categoryId]?.bg,
                        "--chip-fg": CATEGORY_COLORS[tool.categoryId]?.fg,
                      } as React.CSSProperties
                    }
                  >
                    <span className={s.tileChip}>
                      <Icon strokeWidth={1.8} />
                    </span>
                    <span className={s.tileText}>
                      <span className={s.tileName} title={tool.name}>
                        {tool.name}
                      </span>
                      <span className={s.tileCat} style={{ display: "block" }}>
                        {tool.category}
                      </span>
                    </span>
                    <span className={s.tileArrow} aria-hidden>
                      ↗
                    </span>
                  </Link>
                </motion.div>
              );
            })}
            <motion.div key="__sponsor" layout transition={{ duration: 0.2, ease: EASE }}>
              <div className={`${s.tileSponsor} ${s.enter}`} style={{ "--d": "700ms" } as React.CSSProperties}>
                <span className={s.tileCat}>Sponsor</span>
                <span className={s.tileName}>Your dev tool, native here</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
