"use client";

/**
 * Shared pieces for the /preview design prototype.
 * Not wired into the real site — safe to delete.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { SearchIcon, StarIcon } from "lucide-react";
import { tools } from "@/lib/tools-config";
import s from "./preview.module.css";

export const inter = Inter({ subsets: ["latin"] });

/* Sponsor rotation — empty array = clean whitespace, nothing renders. */
const ROTATE_MS = 10_000;
const SPONSORS = [
  { initial: "V", name: "Vercel", tag: "Hosting", desc: "Deploy your next idea before your coffee gets cold.", cta: "Start deploying" },
  { initial: "E", name: "ElevenLabs", tag: "AI", desc: "Generate lifelike speech and voice agents with AI.", cta: "50% off first month" },
  { initial: "R", name: "Raycast", tag: "Productivity", desc: "Your shortcut to everything on the Mac.", cta: "Get it free" },
];

/* Categories that get the hand-drawn "new" treatment */
const NEW_CATEGORIES = new Set(["aiTools"]);

/* Per-category chip colors: deep fg on a whisper of the same hue */
export const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  imageTools: { bg: "#F1EEFD", fg: "#6E56CF" },
  fileTools: { bg: "#E7F3FA", fg: "#0E7DB8" },
  mediaTools: { bg: "#FCF1E4", fg: "#C46B1B" },
  textLanguage: { bg: "#ECF0FC", fg: "#3A5CCC" },
  dataTools: { bg: "#E5F5F1", fg: "#0D8A72" },
  mathFinance: { bg: "#EAF6EB", fg: "#2E9939" },
  productivity: { bg: "#F2F6E2", fg: "#5C7C0F" },
  devTools: { bg: "#EEF2F5", fg: "#52697A" },
  designTools: { bg: "#FDEDF7", fg: "#D6409F" },
  securityTools: { bg: "#FDECEC", fg: "#CE2C31" },
  aiTools: { bg: "#EAEFFF", fg: "#2E5CFF" },
};

export const CATEGORIES = tools
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({
    id: c.id,
    label: c.category.replace(" Tools", "").replace(" & Development", ""),
    count: c.items.length,
  }));

export const ALL_TOOLS = tools
  .flatMap((c) =>
    c.items.map((t) => ({
      name: t.name,
      href: t.href,
      icon: t.icon,
      categoryId: c.id,
      category: c.category.replace(" Tools", ""),
    })),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

/* ---------------- rail ---------------- */

/* Real star count from the GitHub API — cached per session, hidden on failure.
   Never render a made-up number. */
function useGithubStars(repo = "aghyad97/browserytools") {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const cached = sessionStorage.getItem("gh-stars");
    if (cached) {
      setStars(Number(cached));
      return;
    }
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.stargazers_count === "number") {
          sessionStorage.setItem("gh-stars", String(d.stargazers_count));
          setStars(d.stargazers_count);
        }
      })
      .catch(() => {});
  }, [repo]);
  return stars;
}

function formatStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

function NewTag() {
  return (
    <span className={s.newTag}>
      new
      <svg className={s.newScribble} viewBox="0 0 33 7" aria-hidden>
        <path d="M1.6 5.7 C 1.2 5.8, 2.8 5.6, 7.2 4.8 C 11.3 4.2, 17.8 3.7, 21.9 3.3 C 28.4 2.3, 30.8 1.5, 31.5 1.2" />
      </svg>
    </span>
  );
}

export function Rail({
  activeCategory,
  onCategory,
  onSearch,
}: {
  activeCategory?: string | null;
  onCategory?: (id: string | null) => void;
  onSearch: () => void;
}) {
  const stars = useGithubStars();
  const catButton = (id: string | null, label: string) => {
    const active = activeCategory === id;
    const cls = active ? s.railLinkActive : s.railLink;
    const inner = (
      <>
        {label}
        {!active && id && NEW_CATEGORIES.has(id) && <NewTag />}
        {active && (
          <motion.span
            layoutId="rail-active-dot"
            className={s.activeDot}
            transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
          />
        )}
      </>
    );
    if (onCategory) {
      return (
        <button key={id ?? "all"} className={cls} onClick={() => onCategory(id)}>
          {inner}
        </button>
      );
    }
    return (
      <Link key={id ?? "all"} className={cls} href="/preview">
        {inner}
      </Link>
    );
  };

  return (
    <aside className={s.rail}>
      <Link href="/preview" aria-label="BrowseryTools home">
        <div className={s.railGlyph}>b_</div>
      </Link>

      <div className={s.railLive}>
        <span className={s.liveDot} />
        {ALL_TOOLS.length} tools · on-device
      </div>

      <nav className={s.railNav}>
        {catButton(null, "Everything")}
        {CATEGORIES.map((c) => catButton(c.id, c.label))}
        <div className={s.railGroupGap} />
        <Link className={s.railLink} href="/blog">
          Blog
        </Link>
        <a
          className={s.railLink}
          href="https://github.com/aghyad97/browserytools"
          target="_blank"
          rel="noreferrer"
        >
          <span className={s.githubRow}>
            GitHub
            {stars !== null && (
              <span className={s.starBadge}>
                <StarIcon size={10.5} strokeWidth={2} />
                {formatStars(stars)}
              </span>
            )}
          </span>
        </a>
      </nav>

      <div className={s.railBottom}>
        <SponsorRotator />
        <button className={s.pillDark} onClick={onSearch}>
          <SearchIcon size={13} />
          Search
          <span className={s.kbd}>⌘K</span>
        </button>
      </div>
    </aside>
  );
}

/* Rotates sponsors every ROTATE_MS with a thin progress line.
   Pauses on hover (like a toast). Renders nothing when no sponsors. */
function SponsorRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);

  useEffect(() => {
    if (SPONSORS.length < 2 || paused) return;
    const started = performance.now() - elapsed.current;
    const timer = setInterval(() => {
      elapsed.current = performance.now() - started;
      if (elapsed.current >= ROTATE_MS) {
        elapsed.current = 0;
        setIndex((i) => (i + 1) % SPONSORS.length);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [paused, index]);

  if (SPONSORS.length === 0) return null;
  const sp = SPONSORS[index];

  return (
    <div
      className={`${s.railSponsor} ${paused ? s.sponsorPaused : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={s.sponsorInner} key={sp.name}>
        <div className={s.sponsorHead}>
          <div className={s.sponsorLogo}>{sp.initial}</div>
          <div>
            <div className={s.railSponsorName}>{sp.name}</div>
            <div className={s.sponsorTag}>{sp.tag}</div>
          </div>
        </div>
        <div className={s.railSponsorText}>{sp.desc}</div>
        <button className={s.sponsorCta}>
          {sp.cta} <span aria-hidden>→</span>
        </button>
      </div>
      {SPONSORS.length > 1 && (
        <div className={s.sponsorTrack}>
          <div className={s.sponsorFill} key={`${sp.name}-${paused ? "p" : "r"}`} style={{ animationDelay: `-${elapsed.current}ms` }} />
        </div>
      )}
    </div>
  );
}

/* ---------------- command palette ---------------- */
/* Keyboard-initiated → opens instantly, no animation. */

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping(e))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);
  return { open, setOpen };
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return ALL_TOOLS.slice(0, 9);
    return ALL_TOOLS.filter(
      (t) => t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query),
    ).slice(0, 9);
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIndex(0);
    }
  }, [open]);

  useEffect(() => setIndex(0), [q]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  if (!open) return null;

  return (
    <div
      className={s.cmdOverlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.cmd} role="dialog" aria-label="Search tools">
        <input
          autoFocus
          className={s.cmdInput}
          placeholder="Search 140+ tools…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[index]) {
              go(results[index].href);
            }
          }}
        />
        <div className={s.cmdList} ref={listRef}>
          {results.length === 0 && <div className={s.cmdEmpty}>Nothing found — yet.</div>}
          {results.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.href}
                className={i === index ? s.cmdItemActive : s.cmdItem}
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(t.href)}
              >
                <Icon size={15} strokeWidth={1.8} />
                {t.name}
                <span className={s.cmdItemCat}>{t.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- count-up number ---------------- */

export function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // ~ease-out quart
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function formatKB(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/* ---------------- shared canvas compression ---------------- */

export async function compressImage(
  file: File,
  quality: number,
  type: "image/webp" | "image/jpeg" = "image/webp",
): Promise<{ blob: Blob; url: string }> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), type, quality),
  );
  return { blob, url: URL.createObjectURL(blob) };
}

/* ---------------- live demo strip (landing) ---------------- */

export function LiveDemo() {
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ saved: number; pct: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedAnimated = useCountUp(result?.saved ?? 0);

  const handle = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const { blob } = await compressImage(file, 0.72);
      const saved = Math.max(0, file.size - blob.size);
      setResult({ saved, pct: Math.round((saved / file.size) * 100) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`${s.demo} ${dragging ? s.demoDragging : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files[0]);
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
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <div>
        <div className={s.demoLabel}>{busy ? "Compressing…" : "Try it. Drop an image here."}</div>
        <div className={s.demoSub}>
          It compresses right here, on your device. No upload — watch the network tab.
        </div>
      </div>
      {result && (
        <div className={s.demoResult}>
          <span className={s.demoBig}>−{formatKB(savedAnimated)}</span>
          <span className={s.demoSmall}>{result.pct}% smaller</span>
        </div>
      )}
    </div>
  );
}
