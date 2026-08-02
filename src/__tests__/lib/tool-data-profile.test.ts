import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  TOOL_DATA_PROFILES,
  getToolDataProfile,
  buildFallbackContent,
  hasFallbackProse,
  FALLBACK_PROSE_LOCALES,
} from "@/lib/tool-content";
import { localeCodes, type Locale } from "@/lib/locales";

// ──────────────────────────────────────────────────────────────────────────────
// Guards the tool data profile map in src/lib/tool-content.ts against drift.
//
// The map decides which privacy claim the templated fallback is allowed to make.
// Getting it wrong publishes a false statement about our own product, so rather
// than trusting a hand-maintained list we re-derive the answer here by walking
// each tool page's local import graph and looking for the things that actually
// cause network traffic.
//
// If you add a tool that loads a model through an existing loader, or that calls
// an absolute URL, this test fails until the map is updated. If you introduce a
// NEW model-loading library, add it to MODEL_ASSET_SOURCES below — that is the
// one case this test cannot infer on its own.
// ──────────────────────────────────────────────────────────────────────────────

const SRC = join(process.cwd(), "src");
const TOOLS_DIR = join(SRC, "app/tools");

/** Bare package specifiers and local modules that fetch model assets remotely. */
const MODEL_ASSET_SOURCES = [
  "@huggingface/transformers",
  "@xenova/transformers",
  "@imgly/background-removal",
  "@diffusionstudio/vits-web",
  "tesseract.js",
];

/** Hosts we serve ourselves; not third-party network traffic. */
const IGNORED_URL_HOSTS = [
  "browserytools.com",
  "schema.org",
  "www.w3.org",
  "localhost",
];

function resolveLocal(spec: string): string | null {
  if (!spec.startsWith("@/")) return null;
  const base = join(SRC, spec.slice(2));
  for (const candidate of [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, "index.ts"),
    join(base, "index.tsx"),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function importSpecifiers(source: string): string[] {
  const specs: string[] = [];
  for (const m of source.matchAll(/from\s+["']([^"']+)["']/g)) specs.push(m[1]);
  for (const m of source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g))
    specs.push(m[1]);
  return specs;
}

interface Reachable {
  /** Concatenated source of every locally-reachable file. */
  text: string;
  /** Every bare package specifier imported anywhere in the graph. */
  packages: Set<string>;
}

/** Walk the local (`@/`) import graph from a tool page. */
function reachableFrom(entry: string): Reachable {
  const seen = new Set<string>();
  const packages = new Set<string>();
  const stack = [entry];
  let text = "";

  while (stack.length > 0) {
    const file = stack.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);

    const source = readFileSync(file, "utf8");
    text += `${source}\n`;

    for (const spec of importSpecifiers(source)) {
      if (spec.startsWith("@/")) {
        const resolved = resolveLocal(spec);
        if (resolved) stack.push(resolved);
      } else if (!spec.startsWith(".")) {
        packages.add(spec);
      }
    }
  }

  return { text, packages };
}

function toolSlugs(): string[] {
  return readdirSync(TOOLS_DIR).filter((entry) =>
    existsSync(join(TOOLS_DIR, entry, "page.tsx"))
  );
}

/** Absolute http(s) URLs fetched at runtime, excluding hosts we control. */
function remoteFetchUrls(text: string): string[] {
  const urls = [...text.matchAll(/fetch\(\s*[`"']?(https?:\/\/[^`"'\s)]+)/g)].map(
    (m) => m[1]
  );
  return [
    ...new Set(
      urls.filter((url) => !IGNORED_URL_HOSTS.some((host) => url.includes(host)))
    ),
  ];
}

describe("tool data profiles", () => {
  const slugs = toolSlugs();

  it("finds the tool pages it is supposed to be checking", () => {
    expect(slugs.length).toBeGreaterThan(150);
  });

  it("marks every model-loading tool as model-download", () => {
    const missing: string[] = [];

    for (const slug of slugs) {
      const { packages } = reachableFrom(join(TOOLS_DIR, slug, "page.tsx"));
      const loadsModel = MODEL_ASSET_SOURCES.some((pkg) => packages.has(pkg));
      if (!loadsModel) continue;

      // These tools fetch weights from a third-party CDN, so the fallback must
      // never tell the reader nothing is downloaded.
      if (getToolDataProfile(slug) !== "model-download") missing.push(slug);
    }

    expect(missing).toEqual([]);
  });

  it("does not claim model-download for tools that load no model", () => {
    const stale: string[] = [];

    for (const [slug, profile] of Object.entries(TOOL_DATA_PROFILES)) {
      if (profile !== "model-download") continue;
      const page = join(TOOLS_DIR, slug, "page.tsx");
      if (!existsSync(page)) {
        stale.push(`${slug} (no such tool page)`);
        continue;
      }
      const { packages } = reachableFrom(page);
      if (!MODEL_ASSET_SOURCES.some((pkg) => packages.has(pkg))) stale.push(slug);
    }

    expect(stale).toEqual([]);
  });

  it("never leaves a tool that calls a remote URL on the on-device default", () => {
    const unclassified: string[] = [];

    for (const slug of slugs) {
      const { text } = reachableFrom(join(TOOLS_DIR, slug, "page.tsx"));
      if (remoteFetchUrls(text).length === 0) continue;

      const profile = getToolDataProfile(slug);
      // A tool that talks to a third-party host may not describe itself as
      // making no network requests.
      if (profile === "on-device" || profile === "no-user-data") {
        unclassified.push(slug);
      }
    }

    expect(unclassified).toEqual([]);
  });

  // The Web Speech API makes no fetch() call and imports no package, so neither
  // check above can see it — but in Chrome and Edge it ships recorded audio to
  // the browser vendor. Pin it explicitly so the classification can't revert.
  it("classifies Web Speech API tools as remote-processing", () => {
    const wrong: string[] = [];

    for (const slug of slugs) {
      const { text } = reachableFrom(join(TOOLS_DIR, slug, "page.tsx"));
      const usesSpeechRecognition =
        /webkitSpeechRecognition|\bSpeechRecognitionCtor\b/.test(text);
      if (!usesSpeechRecognition) continue;

      if (getToolDataProfile(slug) !== "remote-processing") wrong.push(slug);
    }

    expect(wrong).toEqual([]);
    // And confirm the scan actually matches something, so this can't pass by
    // silently finding nothing.
    expect(getToolDataProfile("speech-to-text")).toBe("remote-processing");
  });

  it("only lists slugs that exist", () => {
    const unknown = Object.keys(TOOL_DATA_PROFILES).filter(
      (slug) => !existsSync(join(TOOLS_DIR, slug, "page.tsx"))
    );
    expect(unknown).toEqual([]);
  });
});

describe("buildFallbackContent privacy claims", () => {
  const base = { name: "Test Tool", description: "Does a thing.", category: "X" };

  it("only promises on-device processing when that is true", () => {
    for (const locale of ["en", "ar"] as const) {
      const onDevice = buildFallbackContent(
        { ...base, dataProfile: "on-device" },
        locale
      );
      expect(onDevice.intro).toMatch(locale === "en" ? /never/i : /لا يُرفع/);

      // The three network-touching profiles must not assert that nothing leaves.
      for (const profile of [
        "remote-data",
        "remote-processing",
        "no-user-data",
      ] as const) {
        const content = buildFallbackContent(
          { ...base, dataProfile: profile },
          locale
        );
        expect(content.intro).not.toBe(onDevice.intro);
      }
    }
  });

  it("discloses the first-use model download", () => {
    const content = buildFallbackContent(
      { ...base, dataProfile: "model-download" },
      "en"
    );
    expect(content.intro).toMatch(/downloaded from a third-party CDN/i);
    // ...while still being clear the user's own content stays put.
    expect(content.intro).toMatch(/never uploaded/i);
    expect(content.faq[0].a).toMatch(/only after the first use/i);
  });

  it("warns plainly when processing happens off-device", () => {
    const content = buildFallbackContent(
      { ...base, dataProfile: "remote-processing" },
      "en"
    );
    expect(content.intro).toMatch(/off your device/i);
    expect(content.intro).toMatch(/shouldn't use it for anything confidential/i);
    // Must not contain the on-device promise at all.
    expect(content.intro).not.toMatch(/never uploaded to a server/i);
  });

  it("omits the privacy paragraph entirely when there is no user data", () => {
    const content = buildFallbackContent(
      { ...base, dataProfile: "no-user-data" },
      "en"
    );
    expect(content.intro).toMatch(/nothing here to upload or store/i);
    expect(content.faq).toEqual([]);
  });

  it("emits no FAQ for on-device tools rather than generic filler", () => {
    expect(
      buildFallbackContent({ ...base, dataProfile: "on-device" }, "en").faq
    ).toEqual([]);
    expect(buildFallbackContent(base, "en").faq).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Locale coverage for the templated fallback.
//
// A locale that reaches the registry without fallback prose renders a BLANK
// "About" section on every /{locale}/tools/… page. That failure is silent: the
// page still builds, still returns 200, and nobody notices until the pages have
// been indexed empty. So ship the copy, or list the locale below on purpose.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Locales knowingly shipped WITHOUT templated fallback prose. Empty on purpose —
 * adding a code here is a deliberate decision to publish blank SEO sections for
 * that language, not a way to get the suite green.
 */
const LOCALES_WITHOUT_FALLBACK_PROSE: Locale[] = [];

const DATA_PROFILES = [
  "on-device",
  "model-download",
  "remote-data",
  "remote-processing",
  "no-user-data",
] as const;

/**
 * How each language names the third-party delivery network the model files come
 * from. The model-download paragraph must contain it and the on-device
 * paragraph must not: that is the line between "your content stays here" and
 * "nothing is ever fetched", and blurring it makes the privacy claim false.
 */
const CDN_TERM: Record<Locale, RegExp> = {
  en: /third-party CDN/,
  ar: /شبكة توصيل محتوى تابعة لطرف ثالث/,
  es: /CDN de terceros/,
  "pt-BR": /CDN de terceiros/,
  fr: /CDN tiers/,
  de: /Drittanbieter-CDN/,
  ru: /стороннего CDN/,
  id: /CDN pihak ketiga/,
  "zh-CN": /第三方 CDN/,
};

describe("templated fallback locale coverage", () => {
  const base = {
    name: "Test Tool",
    description: "Does a thing.",
    category: "Widgets",
  };

  it("has prose for every locale in the registry", () => {
    const missing = localeCodes.filter(
      (code) =>
        !hasFallbackProse(code) &&
        !LOCALES_WITHOUT_FALLBACK_PROSE.includes(code)
    );
    expect(missing).toEqual([]);
  });

  it("does not list a locale as unsupported while shipping prose for it", () => {
    expect(LOCALES_WITHOUT_FALLBACK_PROSE.filter(hasFallbackProse)).toEqual([]);
  });

  it("carries no prose for codes outside the registry", () => {
    expect(
      FALLBACK_PROSE_LOCALES.filter((code) => !localeCodes.includes(code))
    ).toEqual([]);
  });

  for (const locale of localeCodes) {
    if (LOCALES_WITHOUT_FALLBACK_PROSE.includes(locale)) continue;

    describe(locale, () => {
      it("writes a distinct paragraph for every data profile", () => {
        const seen = new Set<string>();

        for (const profile of DATA_PROFILES) {
          const { intro } = buildFallbackContent(
            { ...base, dataProfile: profile },
            locale
          );
          // The tool's own description, then the templated paragraph.
          const paragraphs = intro.split("\n\n").filter(Boolean);
          expect(paragraphs).toHaveLength(2);

          const prose = paragraphs[1];
          // Long enough to be real copy rather than a stub. CJK says the same
          // thing in far fewer characters, hence the modest floor.
          expect(prose.length).toBeGreaterThan(60);
          expect(prose).toContain(base.name);
          expect(prose).toContain(base.category);
          seen.add(prose);
        }

        // Each profile makes a different claim; sharing a paragraph would mean
        // one of them is being made about a tool that hasn't earned it.
        expect(seen.size).toBe(DATA_PROFILES.length);
      });

      it("asks a question only for the profiles that touch the network", () => {
        for (const profile of DATA_PROFILES) {
          const { faq } = buildFallbackContent(
            { ...base, dataProfile: profile },
            locale
          );
          const expected =
            profile === "on-device" || profile === "no-user-data" ? 0 : 1;
          expect(faq).toHaveLength(expected);

          for (const item of faq) {
            expect(item.q.trim().length).toBeGreaterThan(0);
            expect(item.a.trim().length).toBeGreaterThan(40);
          }
        }
      });

      it("discloses the first-use model download without dropping the local-processing claim", () => {
        const modelDownload = buildFallbackContent(
          { ...base, dataProfile: "model-download" },
          locale
        );
        const onDevice = buildFallbackContent(
          { ...base, dataProfile: "on-device" },
          locale
        );

        expect(modelDownload.intro).toMatch(CDN_TERM[locale]);
        expect(modelDownload.faq[0].a).toMatch(CDN_TERM[locale]);
        // The on-device copy promises no network at all, so it must never
        // mention a download it doesn't make.
        expect(onDevice.intro).not.toMatch(CDN_TERM[locale]);
        // The caveat is extra information, so the paragraph carrying it is
        // necessarily the longer of the two.
        expect(modelDownload.intro.length).toBeGreaterThan(
          onDevice.intro.length
        );
      });
    });
  }
});
