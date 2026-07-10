"use client";

/**
 * /preview/tool — design-direction prototype (tool page).
 * Image Compressor restyled: rail carries over, clip-path
 * before/after comparison, live re-encode on slider change.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Rail,
  CommandPalette,
  useCommandPalette,
  compressImage,
  formatKB,
  useCountUp,
  inter,
  ALL_TOOLS,
  CATEGORY_COLORS,
} from "../ui";
import s from "../preview.module.css";

const CAT = CATEGORY_COLORS.imageTools;
const RELATED = ALL_TOOLS.filter(
  (t) => t.categoryId === "imageTools" && ["Image Resizer", "Format Converter", "Background Removal"].includes(t.name),
);

export default function PreviewToolPage() {
  const { open, setOpen } = useCommandPalette();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [quality, setQuality] = useState(0.72);
  const [format, setFormat] = useState<"image/webp" | "image/jpeg">("image/webp");
  const [busy, setBusy] = useState(false);
  const [pos, setPos] = useState(50);
  const inputRef = useRef<HTMLInputElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const savedAnimated = useCountUp(file && outSize ? Math.max(0, file.size - outSize) : 0, 500);

  const run = useCallback(
    async (f: File, q: number, fmt: typeof format) => {
      setBusy(true);
      try {
        const { blob, url } = await compressImage(f, q, fmt);
        setOutUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setOutSize(blob.size);
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const accept = (f?: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setOrigUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    run(f, quality, format);
  };

  // re-encode when quality/format change (debounced — slider drags fire fast)
  useEffect(() => {
    if (!file) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => run(file, quality, format), 140);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [quality, format, file, run]);

  const onCompareMove = (clientX: number) => {
    const rect = compareRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const download = () => {
    if (!outUrl || !file) return;
    const a = document.createElement("a");
    a.href = outUrl;
    a.download = file.name.replace(/\.[^.]+$/, format === "image/webp" ? ".webp" : ".jpg");
    a.click();
  };

  const pct = file && outSize ? Math.round(((file.size - outSize) / file.size) * 100) : 0;

  return (
    <div className={`${s.root} ${inter.className}`} data-mounted="true">
      <Rail onSearch={() => setOpen(true)} />
      <CommandPalette open={open} onClose={() => setOpen(false)} />

      <main className={s.canvas} style={{ maxWidth: 880 }}>
        <div className={s.crumb}>
          <span style={{ color: CAT.fg }}>Image</span> / <b>Compressor</b>
        </div>
        <h1 className={s.toolTitle}>Compress images. Right here.</h1>
        <p className={s.toolSub}>
          Drop an image and it compresses on your device — nothing is uploaded, nothing is stored.
          Drag the divider to compare, then download when it looks right.
        </p>

        {!origUrl && (
          <div
            className={`${s.drop} ${dragging ? s.dropActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => accept(e.target.files?.[0])}
            />
            <div className={s.demoLabel}>Drop an image, or click to choose</div>
            <div className={s.demoSub}>PNG, JPEG, WebP · stays on your device</div>
          </div>
        )}

        {origUrl && outUrl && (
          <>
            <div
              ref={compareRef}
              className={s.compare}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                onCompareMove(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.buttons === 1) onCompareMove(e.clientX);
              }}
            >
              <img src={origUrl} alt="Original" draggable={false} />
              <div className={s.compareTop} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <img src={outUrl} alt="Compressed" draggable={false} />
              </div>
              <div className={s.compareHandle} style={{ left: `${pos}%` }} />
              <span className={s.compareTag} style={{ left: 12 }}>
                Compressed
              </span>
              <span className={s.compareTag} style={{ right: 12 }}>
                Original
              </span>
            </div>

            <div className={s.controls}>
              <div>
                <span className={s.controlLabel}>Quality · {Math.round(quality * 100)}</span>
                <input
                  className={s.range}
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                />
              </div>
              <div>
                <span className={s.controlLabel}>Format</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["image/webp", "image/jpeg"] as const).map((f) => (
                    <button
                      key={f}
                      className={format === f ? s.filterActive : s.filter}
                      onClick={() => setFormat(f)}
                    >
                      {f === "image/webp" ? "WebP" : "JPEG"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <span className={s.controlLabel}>
                  {formatKB(file!.size)} → {busy ? "…" : formatKB(outSize)}
                </span>
                <span className={`${s.statNum} ${s.statGood}`}>
                  −{formatKB(savedAnimated)} ({pct}%)
                </span>
              </div>
              <button className={s.pillDark} onClick={download} disabled={busy}>
                Download
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              <button
                className={s.filter}
                onClick={() => {
                  setFile(null);
                  setOrigUrl(null);
                  setOutUrl(null);
                  setOutSize(0);
                }}
              >
                ← Start over with another image
              </button>
            </div>
          </>
        )}

        <div className={s.sectionLabel} style={{ marginTop: 40 }}>
          Related <span className={s.sectionRule} />
        </div>
        <div className={s.grid}>
          {RELATED.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={s.tile}
                style={{ "--chip-bg": CAT.bg, "--chip-fg": CAT.fg } as React.CSSProperties}
              >
                <span className={s.tileChip}>
                  <Icon strokeWidth={1.8} />
                </span>
                <span className={s.tileText}>
                  <span className={s.tileName}>{tool.name}</span>
                  <span className={s.tileCat} style={{ display: "block" }}>
                    {tool.category}
                  </span>
                </span>
                <span className={s.tileArrow} aria-hidden>
                  ↗
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
