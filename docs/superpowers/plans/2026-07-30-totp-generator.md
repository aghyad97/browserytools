# TOTP (2FA) Code Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A 100% offline multi-account TOTP authenticator at `/tools/totp-generator` — add accounts via secret, otpauth URI, or QR screenshot; live codes with countdown; opt-in on-device persistence. Closes GitHub issue #50.

**Architecture:** Pure-WebCrypto RFC 6238 engine in `src/lib/totp.ts` (zero deps), Zustand store with `persist`+`partialize` (only opted-in accounts hit localStorage), one client component wired into the standard ToolShell/tools-config/i18n/blog pipeline. QR decode via lazily-imported `jsqr`.

**Tech Stack:** Next.js 15 (webpack build), React 18, TypeScript, Zustand v5, next-intl, Vitest + RTL (happy-dom), `jsqr` (new dep, ~40KB).

**Spec:** `docs/superpowers/specs/2026-07-30-video-to-audio-and-totp-design.md`

## Global Constraints

- Branch: `feat/totp-generator` off `main`; work in a worktree; always address it with `git -C <worktree>` (shell cwd resets between commands).
- No `Co-Authored-By`, no "Generated with Claude Code" footers on commits or PR. Minimal PR body: one-paragraph summary + `Closes #50`.
- next-intl `t()` takes **literal string keys only** — never `t(variable)`.
- New-tool checklist: BOTH namespaces (`Tools.TotpGenerator` + `ToolsConfig.tools.totp-generator`) in **all 9 locale files**: `en, ar, es, pt-BR, fr, de, ru, id, zh-CN`.
- Tests: `bun run test` (Vitest, happy-dom). Build gate: `CI=true bun run build` (webpack — never Turbopack).
- No single-edge borders/accent bars in any UI (all-around hairline ring is fine).
- Secrets must never appear in URLs, network requests, or logs.

---

### Task 1: TOTP engine — `src/lib/totp.ts`

**Files:**
- Create: `src/lib/totp.ts`
- Create: `src/__tests__/lib/totp.test.ts`
- Commit also: `docs/superpowers/specs/2026-07-30-video-to-audio-and-totp-design.md`, `docs/superpowers/plans/2026-07-30-totp-generator.md`, `docs/superpowers/plans/2026-07-30-video-to-audio.md` (first commit on the branch carries the spec + plans)

**Interfaces:**
- Produces:
  - `type TotpAlgorithm = "SHA-1" | "SHA-256" | "SHA-512"`
  - `interface TotpParams { secret: string; algorithm: TotpAlgorithm; digits: 6 | 8; period: number }`
  - `interface ParsedOtpauth extends TotpParams { label: string; issuer?: string }`
  - `base32Decode(input: string): Uint8Array` — throws `Error("invalid-base32")` on bad chars/empty result
  - `generateTotp(params: TotpParams, timestampMs?: number): Promise<string>` — defaults `timestampMs` to `Date.now()`
  - `parseOtpauthUri(uri: string): ParsedOtpauth` — throws `Error("not-otpauth") | Error("hotp-unsupported") | Error("migration-unsupported") | Error("missing-secret")`

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/lib/totp.test.ts
import { describe, it, expect } from "vitest";
import {
  base32Decode,
  generateTotp,
  parseOtpauthUri,
  type TotpAlgorithm,
} from "@/lib/totp";

// RFC 4648 §6 encoder — test-local helper so RFC 6238 seeds can be fed to the
// base32-only public API without hand-computed constants.
function base32Encode(bytes: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}
const ascii = (s: string) => new TextEncoder().encode(s);

describe("base32Decode", () => {
  it("decodes RFC 4648 test vectors", () => {
    expect(new TextDecoder().decode(base32Decode("MZXW6==="))).toBe("foo");
    expect(new TextDecoder().decode(base32Decode("MZXW6YTBOI======"))).toBe(
      "foobar"
    );
  });
  it("is case-insensitive and ignores spaces/hyphens/padding", () => {
    expect(new TextDecoder().decode(base32Decode("mzxw 6ytb-oi"))).toBe(
      "foobar"
    );
  });
  it("throws invalid-base32 on illegal characters", () => {
    expect(() => base32Decode("MZXW1")).toThrow("invalid-base32"); // '1' not in alphabet
    expect(() => base32Decode("")).toThrow("invalid-base32");
  });
});

describe("generateTotp — RFC 6238 Appendix B vectors", () => {
  // Seeds per the RFC: 20 bytes for SHA-1, 32 for SHA-256, 64 for SHA-512.
  const seed20 = base32Encode(ascii("12345678901234567890"));
  const seed32 = base32Encode(ascii("12345678901234567890123456789012"));
  const seed64 = base32Encode(
    ascii(
      "1234567890123456789012345678901234567890123456789012345678901234"
    )
  );
  const cases: Array<[number, TotpAlgorithm, string, string]> = [
    [59, "SHA-1", seed20, "94287082"],
    [59, "SHA-256", seed32, "46119246"],
    [59, "SHA-512", seed64, "90693936"],
    [1111111109, "SHA-1", seed20, "07081804"],
    [1234567890, "SHA-256", seed32, "91819424"],
    [2000000000, "SHA-512", seed64, "38618901"],
  ];
  it.each(cases)("T=%s %s → %s", async (t, algorithm, secret, expected) => {
    const code = await generateTotp(
      { secret, algorithm, digits: 8, period: 30 },
      t * 1000
    );
    expect(code).toBe(expected);
  });
  it("produces 6-digit zero-padded codes by default params", async () => {
    const code = await generateTotp(
      { secret: seed20, algorithm: "SHA-1", digits: 6, period: 30 },
      59 * 1000
    );
    expect(code).toBe("287082");
    expect(code).toHaveLength(6);
  });
});

describe("parseOtpauthUri", () => {
  it("parses a full URI", () => {
    const p = parseOtpauthUri(
      "otpauth://totp/GitHub:octocat?secret=MZXW6YTBOI&issuer=GitHub&algorithm=SHA256&digits=8&period=60"
    );
    expect(p).toEqual({
      label: "octocat",
      issuer: "GitHub",
      secret: "MZXW6YTBOI",
      algorithm: "SHA-256",
      digits: 8,
      period: 60,
    });
  });
  it("applies defaults SHA-1 / 6 digits / 30s and splits Issuer:label", () => {
    const p = parseOtpauthUri("otpauth://totp/ACME%3Auser%40x.com?secret=MZXW6YTBOI");
    expect(p.issuer).toBe("ACME");
    expect(p.label).toBe("user@x.com");
    expect(p.algorithm).toBe("SHA-1");
    expect(p.digits).toBe(6);
    expect(p.period).toBe(30);
  });
  it("rejects hotp, migration, non-otpauth, and missing secret", () => {
    expect(() => parseOtpauthUri("otpauth://hotp/x?secret=MZXW6YTBOI&counter=0")).toThrow("hotp-unsupported");
    expect(() => parseOtpauthUri("otpauth-migration://offline?data=abc")).toThrow("migration-unsupported");
    expect(() => parseOtpauthUri("https://example.com")).toThrow("not-otpauth");
    expect(() => parseOtpauthUri("otpauth://totp/x")).toThrow("missing-secret");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/__tests__/lib/totp.test.ts`
Expected: FAIL — module `@/lib/totp` not found.

- [ ] **Step 3: Implement `src/lib/totp.ts`**

```ts
/**
 * RFC 6238 TOTP over native WebCrypto — zero dependencies.
 * Secrets never leave this module's call stack; nothing is logged or fetched.
 */
export type TotpAlgorithm = "SHA-1" | "SHA-256" | "SHA-512";

export interface TotpParams {
  secret: string; // base32
  algorithm: TotpAlgorithm;
  digits: 6 | 8;
  period: number; // seconds
}

export interface ParsedOtpauth extends TotpParams {
  label: string;
  issuer?: string;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s-]/g, "").replace(/=+$/, "");
  if (clean.length === 0) throw new Error("invalid-base32");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error("invalid-base32");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  if (out.length === 0) throw new Error("invalid-base32");
  return new Uint8Array(out);
}

export async function generateTotp(
  params: TotpParams,
  timestampMs: number = Date.now()
): Promise<string> {
  const { secret, algorithm, digits, period } = params;
  const keyBytes = base32Decode(secret);
  const counter = Math.floor(timestampMs / 1000 / period);
  const msg = new Uint8Array(8);
  // 8-byte big-endian counter; JS bitwise ops are 32-bit, so use division
  // for the high word instead of >> 32.
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(binCode % 10 ** digits).padStart(digits, "0");
}

const ALGORITHM_MAP: Record<string, TotpAlgorithm> = {
  SHA1: "SHA-1",
  SHA256: "SHA-256",
  SHA512: "SHA-512",
  "SHA-1": "SHA-1",
  "SHA-256": "SHA-256",
  "SHA-512": "SHA-512",
};

export function parseOtpauthUri(uri: string): ParsedOtpauth {
  const trimmed = uri.trim();
  if (trimmed.toLowerCase().startsWith("otpauth-migration://")) {
    throw new Error("migration-unsupported");
  }
  if (!trimmed.toLowerCase().startsWith("otpauth://")) {
    throw new Error("not-otpauth");
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("not-otpauth");
  }
  const type = url.host.toLowerCase();
  if (type === "hotp") throw new Error("hotp-unsupported");
  if (type !== "totp") throw new Error("not-otpauth");

  const secret = url.searchParams.get("secret");
  if (!secret) throw new Error("missing-secret");
  base32Decode(secret); // validate early — throws invalid-base32

  const rawLabel = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const colonIdx = rawLabel.indexOf(":");
  const labelIssuer = colonIdx >= 0 ? rawLabel.slice(0, colonIdx).trim() : undefined;
  const label = (colonIdx >= 0 ? rawLabel.slice(colonIdx + 1) : rawLabel).trim();
  const issuer = url.searchParams.get("issuer") ?? labelIssuer;

  const algorithm =
    ALGORITHM_MAP[(url.searchParams.get("algorithm") ?? "SHA1").toUpperCase()] ??
    "SHA-1";
  const digitsParam = Number(url.searchParams.get("digits") ?? 6);
  const digits: 6 | 8 = digitsParam === 8 ? 8 : 6;
  const periodParam = Number(url.searchParams.get("period") ?? 30);
  const period =
    Number.isFinite(periodParam) && periodParam > 0 ? periodParam : 30;

  return { label, issuer: issuer || undefined, secret, algorithm, digits, period };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/__tests__/lib/totp.test.ts`
Expected: PASS (Node ≥18 exposes `crypto.subtle` in Vitest — no mock needed).

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add src/lib/totp.ts src/__tests__/lib/totp.test.ts docs/superpowers/specs/2026-07-30-video-to-audio-and-totp-design.md docs/superpowers/plans/
git -C <worktree> commit -m "feat(totp): RFC 6238 engine over WebCrypto with RFC test vectors"
```

---

### Task 2: Account store — `src/store/totp-store.ts`

**Files:**
- Create: `src/store/totp-store.ts`
- Create: `src/__tests__/store/totp-store.test.ts`

**Interfaces:**
- Consumes: `TotpAlgorithm` from `@/lib/totp`
- Produces:
  - `interface TotpAccount { id: string; label: string; issuer?: string; secret: string; algorithm: TotpAlgorithm; digits: 6 | 8; period: number; persisted: boolean }`
  - `useTotpStore` with `{ accounts: TotpAccount[]; addAccount(a: Omit<TotpAccount, "id">): void; removeAccount(id: string): void; setPersisted(id: string, persisted: boolean): void; replaceAccount(id: string, a: Omit<TotpAccount, "id">): void }`
  - localStorage key `"totp-storage"`, **partialized to persisted accounts only**

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/store/totp-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useTotpStore } from "@/store/totp-store";

const acct = (over: Record<string, unknown> = {}) => ({
  label: "user@x.com",
  issuer: "ACME",
  secret: "MZXW6YTBOI",
  algorithm: "SHA-1" as const,
  digits: 6 as const,
  period: 30,
  persisted: false,
  ...over,
});

beforeEach(() => {
  localStorage.clear();
  useTotpStore.setState({ accounts: [] }); // partial reset keeps actions
});

describe("totp-store", () => {
  it("adds an account with a generated id", () => {
    useTotpStore.getState().addAccount(acct());
    const [a] = useTotpStore.getState().accounts;
    expect(a.id).toBeTruthy();
    expect(a.label).toBe("user@x.com");
  });

  it("removes and replaces accounts by id", () => {
    useTotpStore.getState().addAccount(acct());
    const id = useTotpStore.getState().accounts[0].id;
    useTotpStore.getState().replaceAccount(id, acct({ label: "new" }));
    expect(useTotpStore.getState().accounts[0].label).toBe("new");
    expect(useTotpStore.getState().accounts[0].id).toBe(id);
    useTotpStore.getState().removeAccount(id);
    expect(useTotpStore.getState().accounts).toHaveLength(0);
  });

  it("persists ONLY accounts with persisted=true to localStorage", () => {
    useTotpStore.getState().addAccount(acct({ label: "ephemeral" }));
    useTotpStore.getState().addAccount(acct({ label: "saved", persisted: true }));
    const raw = localStorage.getItem("totp-storage");
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw as string);
    const labels = stored.state.accounts.map((a: { label: string }) => a.label);
    expect(labels).toEqual(["saved"]);
  });

  it("setPersisted(false) removes the account from storage", () => {
    useTotpStore.getState().addAccount(acct({ persisted: true }));
    const id = useTotpStore.getState().accounts[0].id;
    useTotpStore.getState().setPersisted(id, false);
    const stored = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored.state.accounts).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/__tests__/store/totp-store.test.ts`
Expected: FAIL — module `@/store/totp-store` not found.

- [ ] **Step 3: Implement the store**

```ts
// src/store/totp-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TotpAlgorithm } from "@/lib/totp";

export interface TotpAccount {
  id: string;
  label: string;
  issuer?: string;
  secret: string; // base32, stored as entered — plaintext by explicit user opt-in
  algorithm: TotpAlgorithm;
  digits: 6 | 8;
  period: number;
  persisted: boolean;
}

interface TotpStore {
  accounts: TotpAccount[];
  addAccount: (a: Omit<TotpAccount, "id">) => void;
  removeAccount: (id: string) => void;
  setPersisted: (id: string, persisted: boolean) => void;
  replaceAccount: (id: string, a: Omit<TotpAccount, "id">) => void;
}

export const useTotpStore = create<TotpStore>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (a) =>
        set((s) => ({
          accounts: [...s.accounts, { ...a, id: crypto.randomUUID() }],
        })),
      removeAccount: (id) =>
        set((s) => ({ accounts: s.accounts.filter((x) => x.id !== id) })),
      setPersisted: (id, persisted) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...x, persisted } : x)),
        })),
      replaceAccount: (id, a) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...a, id } : x)),
        })),
    }),
    {
      name: "totp-storage",
      // Only opted-in accounts ever touch localStorage.
      partialize: (state) => ({
        accounts: state.accounts.filter((a) => a.persisted),
      }),
    }
  )
);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/__tests__/store/totp-store.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add src/store/totp-store.ts src/__tests__/store/totp-store.test.ts
git -C <worktree> commit -m "feat(totp): account store with opt-in localStorage persistence"
```

---

### Task 3: QR decode helper — `src/lib/qr-decode.ts` (+ `jsqr` dep)

**Files:**
- Modify: `package.json` (add `"jsqr": "^1.4.0"` — run `bun add jsqr`)
- Create: `src/lib/qr-decode.ts`
- Create: `src/__tests__/lib/qr-decode.test.ts`

**Interfaces:**
- Produces: `decodeQrFromImageFile(file: File): Promise<string | null>` — resolves the QR's text payload, `null` when no QR found; throws only on image-decode failure (`Error("image-decode-failed")`). `jsqr` is dynamically imported so it never enters the main bundle.

- [ ] **Step 1: Write the failing tests**

```ts
// src/__tests__/lib/qr-decode.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const jsqrMock = vi.fn();
vi.mock("jsqr", () => ({ default: jsqrMock }));

import { decodeQrFromImageFile } from "@/lib/qr-decode";

// happy-dom has no real image pipeline — stub bitmap + canvas 2D context.
beforeEach(() => {
  jsqrMock.mockReset();
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockResolvedValue({ width: 2, height: 2, close: vi.fn() })
  );
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi
      .fn()
      .mockReturnValue({ data: new Uint8ClampedArray(16), width: 2, height: 2 }),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe("decodeQrFromImageFile", () => {
  const file = new File(["fake"], "qr.png", { type: "image/png" });

  it("returns the decoded payload when jsQR finds a code", async () => {
    jsqrMock.mockReturnValue({ data: "otpauth://totp/x?secret=MZXW6YTBOI" });
    await expect(decodeQrFromImageFile(file)).resolves.toBe(
      "otpauth://totp/x?secret=MZXW6YTBOI"
    );
  });

  it("returns null when no QR code is found", async () => {
    jsqrMock.mockReturnValue(null);
    await expect(decodeQrFromImageFile(file)).resolves.toBeNull();
  });

  it("throws image-decode-failed when the file is not a decodable image", async () => {
    (createImageBitmap as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("bad image")
    );
    await expect(decodeQrFromImageFile(file)).rejects.toThrow(
      "image-decode-failed"
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun add jsqr && bun run test src/__tests__/lib/qr-decode.test.ts`
Expected: FAIL — module `@/lib/qr-decode` not found.

- [ ] **Step 3: Implement the helper**

```ts
// src/lib/qr-decode.ts
/**
 * Decode a QR code from an image file, fully client-side.
 * jsqr is dynamically imported — only users of the QR tab pay for it.
 */
export async function decodeQrFromImageFile(file: File): Promise<string | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("image-decode-failed");
  }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("image-decode-failed");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { default: jsQR } = await import("jsqr");
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    return result?.data ?? null;
  } finally {
    bitmap.close?.();
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test src/__tests__/lib/qr-decode.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add package.json bun.lock src/lib/qr-decode.ts src/__tests__/lib/qr-decode.test.ts
git -C <worktree> commit -m "feat(totp): client-side QR decode helper via lazily-loaded jsqr"
```

---

### Task 4: `TotpGenerator` component + page + tools-config + EN/AR strings

**Files:**
- Create: `src/components/TotpGenerator.tsx`
- Create: `src/app/tools/totp-generator/page.tsx`
- Create: `src/app/tools/totp-generator/opengraph-image.tsx`
- Create: `src/app/tools/totp-generator/twitter-image.tsx`
- Modify: `src/lib/tools-config.ts` (Security Tools items, after Text Encryption order 5)
- Modify: `messages/en.json`, `messages/ar.json` (both namespaces; remaining 7 locales in Task 5)
- Create: `src/__tests__/components/TotpGenerator.test.tsx`

**Interfaces:**
- Consumes: `generateTotp`, `parseOtpauthUri`, `base32Decode` from `@/lib/totp`; `useTotpStore`, `TotpAccount` from `@/store/totp-store`; `decodeQrFromImageFile` from `@/lib/qr-decode`; `ToolShell`, `SettingsCard`/`OptionRow`, UI primitives, `toast`.
- Produces: default export `TotpGenerator` client component.

**Component behavior (implement exactly):**

- `useTranslations("Tools.TotpGenerator")` + `useTranslations("ToolsConfig")` for shell title.
- **Trust banner** at top: `t("trustBanner")` inside a `bg-muted/30 rounded-lg border p-4` block with a `ShieldCheck` icon.
- **Codes ticking:** one `setInterval(1000)` in a `useEffect`; every tick set `now = Date.now()` state. Codes are recomputed in a second `useEffect` that depends on `accounts` and `Math.floor(now / 1000 / period)` per account — practical implementation: keep `codes: Record<string, string>` state; on each tick, for each account compute `step = Math.floor(now/1000/a.period)` and if it differs from a `stepsRef.current[a.id]`, call `generateTotp(a, now)` and update. Compute immediately when an account is added.
- **Countdown:** `remaining = a.period - (Math.floor(now/1000) % a.period)`; render as an SVG ring: circle r=14, `strokeDasharray={2*Math.PI*14}`, `strokeDashoffset={(1 - remaining/a.period) * 2*Math.PI*14}`, with `remaining` text centered, `dir="ltr"`.
- **Account card:** issuer + label; code formatted `code.slice(0, Math.ceil(len/2)) + " " + code.slice(...)` in a `font-mono text-2xl tracking-widest` span, `dir="ltr"`; copy button (`navigator.clipboard.writeText(code)` + `toast.success(t("copied"))`); "Save on this device" `Switch`/custom `Checkbox` toggling `setPersisted` with warning text `t("persistWarning")` in `text-xs text-muted-foreground` under it; delete button opens inline confirm (two-button row Confirm/Cancel — no window.confirm).
- **Empty state:** icon + `t("emptyTitle")` + `t("emptyHint")`.
- **Add account** in a `SettingsCard` with `Tabs` (`manual` | `uri` | `qr`):
  - *Manual:* inputs label (required), issuer (optional), secret (required); collapsed "Advanced" (`<details>` or button-toggled section) with digits Select (6/8), period Select (30/60), algorithm Select (SHA-1/SHA-256/SHA-512). On submit: `base32Decode(secret)` in try/catch → invalid shows inline `t("invalidSecret")`; valid → `addAccount({..., persisted: false})`, reset form, `toast.success(t("accountAdded"))`.
  - *URI:* one textarea + submit; `parseOtpauthUri` errors map to literal-key messages via switch: `not-otpauth` → `t("errNotOtpauth")`, `hotp-unsupported` → `t("errHotp")`, `migration-unsupported` → `t("errMigration")`, `missing-secret` → `t("errMissingSecret")`, `invalid-base32` → `t("invalidSecret")`.
  - *QR:* file input (`accept="image/*"`) + drop-friendly button; `decodeQrFromImageFile` → `null` → `t("errNoQr")`; payload → `parseOtpauthUri` (same error mapping); success adds account.
  - Duplicate check on every add path: existing account with same `secret` and `label` → show inline prompt `t("duplicatePrompt")` with buttons `t("replace")` (calls `replaceAccount`) and `t("keepBoth")` (calls `addAccount`).

**tools-config entry** (inside `securityTools` items, after Text Encryption; `ShieldCheck` icon imported like the file's other lucide imports):

```ts
{
  name: "TOTP Generator",
  href: "/tools/totp-generator",
  icon: ShieldCheckIcon,
  available: true,
  order: 6,
  creationDate: "2026-07-30",
  description:
    "Generate 2FA codes from your TOTP secrets, 100% offline in your browser. Add accounts by secret, otpauth link, or QR screenshot — codes never leave your device.",
},
```

(Match the file's actual lucide import alias style — check how `ShieldCheckIcon`/`ShieldCheck` is imported at the top of `tools-config.ts` and follow it.)

**Page files** — exact copies of the compress-video pattern with the slug swapped:

```tsx
// src/app/tools/totp-generator/page.tsx
import TotpGenerator from "@/components/TotpGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/totp-generator");

export default function Page() {
  return <TotpGenerator />;
}
```

```tsx
// src/app/tools/totp-generator/opengraph-image.tsx  (twitter-image.tsx identical)
import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "totp-generator | BrowseryTools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateToolOgImage("totp-generator");
}
```

**EN strings** (`messages/en.json`):

`ToolsConfig.tools.totp-generator`:
```json
{ "name": "TOTP Generator", "description": "Generate 2FA codes from your TOTP secrets, 100% offline in your browser. Add accounts by secret, otpauth link, or QR screenshot — codes never leave your device." }
```

`Tools.TotpGenerator`:
```json
{
  "trustBanner": "Runs entirely in your browser — secrets never leave this device. Works offline after first load.",
  "emptyTitle": "No accounts yet",
  "emptyHint": "Add a 2FA account below using its secret key, otpauth link, or a QR code screenshot.",
  "addAccount": "Add account",
  "tabManual": "Manual",
  "tabUri": "otpauth link",
  "tabQr": "QR image",
  "labelLabel": "Account",
  "labelPlaceholder": "user@example.com",
  "issuerLabel": "Issuer (optional)",
  "issuerPlaceholder": "GitHub",
  "secretLabel": "Secret key",
  "secretPlaceholder": "JBSWY3DPEHPK3PXP",
  "advanced": "Advanced",
  "digits": "Digits",
  "period": "Period (seconds)",
  "algorithm": "Algorithm",
  "uriLabel": "otpauth:// link",
  "uriPlaceholder": "otpauth://totp/GitHub:you?secret=…",
  "qrHint": "Upload a screenshot of the QR code shown during 2FA setup.",
  "chooseImage": "Choose image",
  "add": "Add",
  "copied": "Code copied",
  "accountAdded": "Account added",
  "invalidSecret": "That secret isn't valid base32. Check for typos.",
  "errNotOtpauth": "That's not an otpauth:// link.",
  "errHotp": "Counter-based (HOTP) accounts aren't supported — only time-based (TOTP).",
  "errMigration": "That's a Google Authenticator export QR. Export accounts one at a time instead.",
  "errMissingSecret": "This link has no secret parameter.",
  "errNoQr": "No QR code found in that image.",
  "errImageDecode": "Couldn't read that image file.",
  "persistToggle": "Save on this device",
  "persistWarning": "Saved secrets are stored unencrypted in this browser profile — anyone with access to this device can read them. Leave off on shared machines.",
  "deleteAccount": "Delete",
  "deleteConfirm": "Delete this account?",
  "confirm": "Confirm",
  "cancel": "Cancel",
  "duplicatePrompt": "An account with this secret and name already exists.",
  "replace": "Replace",
  "keepBoth": "Keep both",
  "secondsLeft": "seconds left"
}
```

**AR strings** (`messages/ar.json`) — same keys, native Arabic (not literal translation). Reference tone: existing `Tools.TextEncryption` entries. Draft:

```json
{
  "trustBanner": "تعمل الأداة بالكامل داخل متصفحك — الرموز السرية لا تغادر جهازك أبداً، وتعمل دون إنترنت بعد أول تحميل.",
  "emptyTitle": "لا توجد حسابات بعد",
  "emptyHint": "أضف حساب التحقق بخطوتين أدناه عبر المفتاح السري أو رابط otpauth أو لقطة شاشة لرمز QR.",
  "addAccount": "إضافة حساب",
  "tabManual": "يدوي",
  "tabUri": "رابط otpauth",
  "tabQr": "صورة QR",
  "labelLabel": "الحساب",
  "labelPlaceholder": "user@example.com",
  "issuerLabel": "الجهة (اختياري)",
  "issuerPlaceholder": "GitHub",
  "secretLabel": "المفتاح السري",
  "secretPlaceholder": "JBSWY3DPEHPK3PXP",
  "advanced": "خيارات متقدمة",
  "digits": "عدد الأرقام",
  "period": "المدة (ثوانٍ)",
  "algorithm": "الخوارزمية",
  "uriLabel": "رابط ‎otpauth://‎",
  "uriPlaceholder": "otpauth://totp/GitHub:you?secret=…",
  "qrHint": "ارفع لقطة شاشة لرمز QR الظاهر أثناء إعداد التحقق بخطوتين.",
  "chooseImage": "اختر صورة",
  "add": "إضافة",
  "copied": "تم نسخ الرمز",
  "accountAdded": "تمت إضافة الحساب",
  "invalidSecret": "المفتاح السري ليس بترميز base32 صالح. تأكد من عدم وجود أخطاء.",
  "errNotOtpauth": "هذا ليس رابط ‎otpauth://‎.",
  "errHotp": "الحسابات المعتمدة على العدّاد (HOTP) غير مدعومة — المدعوم هو الرموز الزمنية (TOTP) فقط.",
  "errMigration": "هذا رمز تصدير من Google Authenticator. صدّر الحسابات واحداً تلو الآخر بدلاً من ذلك.",
  "errMissingSecret": "هذا الرابط لا يحتوي على مفتاح سري.",
  "errNoQr": "لم يُعثر على رمز QR في هذه الصورة.",
  "errImageDecode": "تعذّرت قراءة ملف الصورة.",
  "persistToggle": "الحفظ على هذا الجهاز",
  "persistWarning": "تُحفظ المفاتيح دون تشفير في ملف المتصفح — أي شخص لديه وصول إلى الجهاز يمكنه قراءتها. أبقِ الخيار معطلاً على الأجهزة المشتركة.",
  "deleteAccount": "حذف",
  "deleteConfirm": "حذف هذا الحساب؟",
  "confirm": "تأكيد",
  "cancel": "إلغاء",
  "duplicatePrompt": "يوجد حساب بنفس المفتاح والاسم مسبقاً.",
  "replace": "استبدال",
  "keepBoth": "الاحتفاظ بكليهما",
  "secondsLeft": "ثانية متبقية"
}
```

- [ ] **Step 1: Write the failing component tests**

```tsx
// src/__tests__/components/TotpGenerator.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TotpGenerator from "@/components/TotpGenerator";
import { useTotpStore } from "@/store/totp-store";

vi.mock("@/lib/qr-decode", () => ({
  decodeQrFromImageFile: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  useTotpStore.setState({ accounts: [] });
});
afterEach(() => {
  vi.useRealTimers();
});

async function addManualAccount(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/account/i), "user@x.com");
  await user.type(screen.getByLabelText(/secret key/i), "JBSWY3DPEHPK3PXP");
  await user.click(screen.getByRole("button", { name: /^add$/i }));
}

describe("TotpGenerator", () => {
  it("shows the empty state and trust banner", () => {
    render(<TotpGenerator />);
    expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
    expect(screen.getByText(/secrets never leave/i)).toBeInTheDocument();
  });

  it("adds a manual account and renders a live code", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    expect(await screen.findByText("user@x.com")).toBeInTheDocument();
    // A 6-digit grouped code appears (e.g. "123 456").
    await waitFor(() =>
      expect(screen.getByText(/^\d{3} \d{3}$/)).toBeInTheDocument()
    );
    expect(useTotpStore.getState().accounts).toHaveLength(1);
    expect(useTotpStore.getState().accounts[0].persisted).toBe(false);
  });

  it("rejects an invalid base32 secret with an inline error", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.type(screen.getByLabelText(/account/i), "x");
    await user.type(screen.getByLabelText(/secret key/i), "not!!valid");
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(await screen.findByText(/isn't valid base32/i)).toBeInTheDocument();
    expect(useTotpStore.getState().accounts).toHaveLength(0);
  });

  it("adds an account from an otpauth URI via the URI tab", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.click(screen.getByRole("tab", { name: /otpauth link/i }));
    await user.type(
      screen.getByLabelText(/otpauth:\/\/ link/i),
      "otpauth://totp/GitHub:octocat?secret=JBSWY3DPEHPK3PXP&issuer=GitHub"
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(await screen.findByText(/octocat/)).toBeInTheDocument();
    expect(useTotpStore.getState().accounts[0].issuer).toBe("GitHub");
  });

  it("shows migration-specific guidance for otpauth-migration URIs", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await user.click(screen.getByRole("tab", { name: /otpauth link/i }));
    await user.type(
      screen.getByLabelText(/otpauth:\/\/ link/i),
      "otpauth-migration://offline?data=abc"
    );
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    expect(
      await screen.findByText(/export accounts one at a time/i)
    ).toBeInTheDocument();
  });

  it("copies the code to the clipboard", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await waitFor(() =>
      expect(screen.getByText(/^\d{3} \d{3}$/)).toBeInTheDocument()
    );
    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^\d{6}$/));
  });

  it("persist toggle writes only that account to localStorage", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await user.click(screen.getByTestId("totp-persist-toggle"));
    const stored = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored.state.accounts).toHaveLength(1);
    await user.click(screen.getByTestId("totp-persist-toggle"));
    const stored2 = JSON.parse(localStorage.getItem("totp-storage") as string);
    expect(stored2.state.accounts).toHaveLength(0);
  });

  it("deletes an account after inline confirm", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(useTotpStore.getState().accounts).toHaveLength(0);
    expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
  });

  it("prompts on duplicate secret+label and can keep both", async () => {
    const user = userEvent.setup();
    render(<TotpGenerator />);
    await addManualAccount(user);
    await addManualAccount(user);
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /keep both/i }));
    expect(useTotpStore.getState().accounts).toHaveLength(2);
  });
});
```

Notes for the implementer: Radix Tabs render inactive content out of the DOM — click the tab trigger first (established repo pattern). If Selects are involved in a test, `Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false)` is already handled in `src/test-setup.ts`. Give the persist toggle `data-testid="totp-persist-toggle"` (custom Checkbox at `src/components/ui/checkbox.tsx` supports `data-testid`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test src/__tests__/components/TotpGenerator.test.tsx`
Expected: FAIL — component not found.

- [ ] **Step 3: Implement the component, page files, tools-config entry, EN+AR strings**

Follow the behavior spec above. Structure: `ToolShell slug="totp-generator"` → trust banner → account list (cards) → `SettingsCard` with the add-account Tabs. Match CompressVideo's styling idioms (`bg-muted/30 rounded-lg border`, `font-mono`, `dir="ltr"` on numbers, `me-*`/`ms-*` logical margins for RTL). No single-edge borders.

- [ ] **Step 4: Run the full test suite**

Run: `bun run test`
Expected: all tests pass, including prior suites.

- [ ] **Step 5: Commit**

```bash
git -C <worktree> add src/components/TotpGenerator.tsx src/app/tools/totp-generator/ src/lib/tools-config.ts messages/en.json messages/ar.json src/__tests__/components/TotpGenerator.test.tsx
git -C <worktree> commit -m "feat(totp): TOTP generator tool — multi-account, QR import, opt-in persistence"
```

---

### Task 5: Remaining 7 locales

**Files:**
- Modify: `messages/es.json`, `messages/pt-BR.json`, `messages/fr.json`, `messages/de.json`, `messages/ru.json`, `messages/id.json`, `messages/zh-CN.json`

**Interfaces:**
- Consumes: the exact key sets added to `messages/en.json` in Task 4 (`Tools.TotpGenerator` — all 33 keys — and `ToolsConfig.tools.totp-generator`).

- [ ] **Step 1: Add both namespaces to each locale file**

Translate from the EN source natively (no literal calques); keep technical tokens (`otpauth://`, `base32`, `TOTP`, `HOTP`, `QR`, brand names, the `secretPlaceholder` example value) untranslated. Place keys in the same relative position as in `en.json` (alongside the other `Tools.*` / `ToolsConfig.tools.*` entries).

- [ ] **Step 2: Verify key parity**

Run:
```bash
node -e "
const langs=['en','ar','es','pt-BR','fr','de','ru','id','zh-CN'];
const ref=Object.keys(require('./messages/en.json').Tools.TotpGenerator).sort().join();
for(const l of langs){
  const m=require('./messages/'+l+'.json');
  const k=Object.keys(m.Tools?.TotpGenerator??{}).sort().join();
  if(k!==ref) throw new Error(l+' Tools.TotpGenerator key mismatch');
  if(!m.ToolsConfig?.tools?.['totp-generator']?.name) throw new Error(l+' missing ToolsConfig entry');
}
console.log('locale parity OK');
"
```
Expected: `locale parity OK`.

- [ ] **Step 3: Run tests + commit**

```bash
bun run test
git -C <worktree> add messages/
git -C <worktree> commit -m "i18n(totp): TOTP generator strings for all locales"
```

---

### Task 6: Blog posts (EN + AR)

**Files:**
- Modify: `src/lib/blog-data.ts` (append two entries to `blogPosts`)
- Create: `src/app/blog/posts/totp-generator-guide.tsx`
- Create: `src/app/blog/posts/totp-generator-guide-ar.tsx`

**Interfaces:**
- Consumes: blog post components export `default function Content()` returning JSX; `[slug]/page.tsx` auto-imports by slug; metadata lives only in `blog-data.ts`.

- [ ] **Step 1: Add blog-data entries** (match surrounding entry shape exactly):

```ts
{
  slug: "totp-generator-guide",
  title: "Free Offline TOTP Generator — 2FA Codes Without an App",
  description:
    "Generate two-factor authentication codes 100% offline in your browser. No app, no account, no upload — add accounts by secret key, otpauth link, or QR screenshot.",
  date: "2026-07-30",
  author: "BrowseryTools Team",
  category: "Security Tools",
  tags: ["totp generator", "2fa codes online", "offline authenticator", "two factor authentication", "otpauth", "google authenticator alternative"],
  readTime: 7,
  featured: true,
  coverEmoji: "🔐",
  coverGradient: "from-emerald-500 to-teal-500",
},
{
  slug: "totp-generator-guide-ar",
  title: "مولّد رموز TOTP مجاني يعمل دون إنترنت — رموز التحقق بخطوتين بلا تطبيق",
  description:
    "أنشئ رموز التحقق بخطوتين داخل متصفحك دون إنترنت بالكامل — بلا تطبيق ولا حساب ولا رفع ملفات. أضف حساباتك عبر المفتاح السري أو رابط otpauth أو لقطة QR.",
  date: "2026-07-30",
  author: "BrowseryTools Team",
  category: "Security Tools",
  tags: ["مولد TOTP", "رموز التحقق بخطوتين", "مصادقة ثنائية", "بديل Google Authenticator"],
  readTime: 7,
  featured: false,
  coverEmoji: "🔐",
  coverGradient: "from-emerald-500 to-teal-500",
},
```

- [ ] **Step 2: Write the two post components**

Study one recent post (`src/app/blog/posts/audio-transcriber-guide.tsx`) for the JSX idiom (headings, paragraphs, internal links, CTA linking to the tool). Required content coverage, in this order:
1. What TOTP is (one-paragraph explainer: shared secret + clock → 6-digit rolling code)
2. Why a browser-based offline generator (no install, works anywhere, privacy: secret never uploaded)
3. Step-by-step: add an account (all three input paths, with the QR-screenshot flow explained)
4. The "Save on this device" trade-off — honest security note: localStorage is unencrypted; a dedicated authenticator app with OS-level encryption is stronger; keep the toggle off on shared machines
5. Limits: no HOTP, no Google Authenticator batch import (export one at a time)
6. CTA to `/tools/totp-generator`

The AR post is a native-quality transcreation of the same outline (not a sentence-by-sentence translation), following the tone of existing `-ar` posts.

- [ ] **Step 3: Verify + commit**

Run: `bun run test` (blog-data shape is exercised by existing suites), then:
```bash
git -C <worktree> add src/lib/blog-data.ts src/app/blog/posts/totp-generator-guide.tsx src/app/blog/posts/totp-generator-guide-ar.tsx
git -C <worktree> commit -m "blog(totp): EN + AR guides for the TOTP generator"
```

---

### Task 7: Gates + PR

- [ ] **Step 1: Full test suite** — `bun run test` → all pass.
- [ ] **Step 2: Build gate** — `CI=true bun run build` → succeeds (webpack; expect the pre-existing `colorScheme/themeColor` metadata warnings — not blockers).
- [ ] **Step 3: Manual smoke** (dev server): add account manually → code ticks and matches a reference authenticator for the same secret; QR screenshot import works; persist toggle survives reload; non-persisted account gone after reload; RTL (ar) renders sanely.
- [ ] **Step 4: Push + PR**

```bash
git -C <worktree> push -u origin feat/totp-generator
gh pr create --title "Add TOTP (2FA) code generator tool" --body "Adds /tools/totp-generator — multi-account TOTP codes generated fully client-side via WebCrypto (RFC 6238), with otpauth-link and QR-screenshot import and opt-in on-device persistence. All locales + EN/AR blog posts.

Closes #50"
```
(No AI footers, no Co-Authored-By.)
