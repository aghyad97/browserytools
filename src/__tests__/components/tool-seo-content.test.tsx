import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { headers, cookies } from "next/headers";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
import { toolContent } from "@/lib/tool-content";

// The global next-intl mock is English-only; this suite needs the real
// translator (the component builds one with createTranslator) so ru/ar/de
// chrome comes from the real message files.
vi.mock("next-intl", async () => await vi.importActual("next-intl"));

// The component is an async server component: it reads the request through
// next/headers, so we mock that and drive it per test.
vi.mock("next/headers", () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

let reqSlug = "json-formatter";
let reqLocaleHeader: string | null = null;
let reqCookie: string | undefined;

function setRequest(
  pathname: string,
  opts: { locale?: string | null; cookie?: string } = {}
) {
  // Tests describe the request as a URL; the component takes only the slug
  // (each page passes it explicitly) and the locale from header/cookie.
  reqSlug = pathname.match(/\/tools\/([^/]+)/)?.[1] ?? "";
  reqLocaleHeader = opts.locale === undefined ? null : opts.locale;
  reqCookie = opts.cookie;
}

// Async server component -> JSX, then render that like any other tree.
async function renderBlock() {
  const jsx = (await ToolSeoContent({ slug: reqSlug })) as ReactElement | null;
  return render(<>{jsx}</>);
}

function getJsonLdScripts(): Record<string, unknown>[] {
  return Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  ).map((el) => JSON.parse(el.textContent || "{}"));
}

describe("ToolSeoContent", () => {
  beforeEach(() => {
    setRequest("/tools/json-formatter");
    vi.mocked(headers).mockImplementation((async () => ({
      get: (name: string) =>
        name === "x-browsery-locale" ? reqLocaleHeader : null,
    })) as never);
    vi.mocked(cookies).mockImplementation((async () => ({
      get: (name: string) =>
        name === "browsery-locale" && reqCookie ? { value: reqCookie } : undefined,
    })) as never);
  });

  it("renders the SEO content section for a known tool", async () => {
    await renderBlock();
    expect(screen.getByTestId("tool-seo-content")).toBeInTheDocument();
    // About title interpolates the tool name.
    expect(screen.getByText(/About JSON Formatter/i)).toBeInTheDocument();
    // FAQ section heading.
    expect(screen.getByText(/Frequently asked questions/i)).toBeInTheDocument();
  });

  it("emits a FAQPage JSON-LD <script> tag", async () => {
    await renderBlock();
    const scripts = getJsonLdScripts();
    const faq = scripts.find((s) => s["@type"] === "FAQPage");
    expect(faq).toBeDefined();
    expect(Array.isArray(faq?.mainEntity)).toBe(true);
    expect((faq?.mainEntity as unknown[]).length).toBeGreaterThan(0);
    const first = (faq?.mainEntity as Record<string, unknown>[])[0];
    expect(first["@type"]).toBe("Question");
    expect((first.acceptedAnswer as Record<string, unknown>)["@type"]).toBe(
      "Answer"
    );
  });

  it("emits SoftwareApplication and BreadcrumbList JSON-LD without fake ratings", async () => {
    await renderBlock();
    const scripts = getJsonLdScripts();

    const app = scripts.find((s) => s["@type"] === "SoftwareApplication");
    expect(app).toBeDefined();
    expect(app?.name).toBe("JSON Formatter");
    // No fabricated ratings/reviews allowed.
    expect(app).not.toHaveProperty("aggregateRating");
    expect(app).not.toHaveProperty("review");

    const crumbs = scripts.find((s) => s["@type"] === "BreadcrumbList");
    expect(crumbs).toBeDefined();
    expect((crumbs?.itemListElement as unknown[]).length).toBe(3);
  });

  it("emits HowTo JSON-LD when the tool has steps", async () => {
    await renderBlock();
    const scripts = getJsonLdScripts();
    const howTo = scripts.find((s) => s["@type"] === "HowTo");
    expect(howTo).toBeDefined();
    expect((howTo?.step as unknown[]).length).toBeGreaterThan(0);
  });

  it("renders the why-client-side and limitations blocks when authored", async () => {
    await renderBlock();
    expect(screen.getByTestId("tool-seo-why-client-side")).toBeInTheDocument();
    expect(screen.getByText(/Why this runs on your device/i)).toBeInTheDocument();

    const limitations = screen.getByTestId("tool-seo-limitations");
    expect(limitations).toBeInTheDocument();
    expect(
      screen.getByText(/Limitations and trade-offs/i)
    ).toBeInTheDocument();
    // Every authored limitation is rendered as its own list item.
    expect(
      limitations.querySelectorAll("li").length
    ).toBeGreaterThanOrEqual(2);
  });

  it("never puts limitations into any JSON-LD graph", async () => {
    await renderBlock();
    const scripts = getJsonLdScripts();
    const serialized = JSON.stringify(scripts);

    // The limitations text must appear on the page but never in structured data.
    const limitations = screen.getByTestId("tool-seo-limitations");
    const firstItem = limitations.querySelector("li")?.textContent ?? "";
    expect(firstItem.length).toBeGreaterThan(0);
    expect(serialized).not.toContain(firstItem);

    // FAQPage is built from `faq` only — its question count must match.
    const faq = scripts.find((s) => s["@type"] === "FAQPage");
    expect((faq?.mainEntity as unknown[]).length).toBe(
      toolContent["json-formatter"].en.faq.length
    );
  });

  it("omits both new sections for a tool using the templated fallback", async () => {
    setRequest("/tools/todo");
    await renderBlock();
    // The fallback must not invent a privacy angle or fabricate limitations.
    expect(
      screen.queryByTestId("tool-seo-why-client-side")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tool-seo-limitations")).not.toBeInTheDocument();
  });

  it("renders a templated fallback for a tool without bespoke content", async () => {
    setRequest("/tools/todo");
    await renderBlock();
    expect(screen.getByTestId("tool-seo-content")).toBeInTheDocument();
    // The on-device fallback still describes the tool and its privacy posture.
    expect(screen.getByText(/never uploaded to a server/i)).toBeInTheDocument();
    // SoftwareApplication is still emitted for fallback pages.
    const app = getJsonLdScripts().find(
      (s) => s["@type"] === "SoftwareApplication"
    );
    expect(app).toBeDefined();
  });

  it("emits no FAQPage for templated fallback content", async () => {
    setRequest("/tools/todo");
    await renderBlock();
    // A templated question is not evidence anyone asks it about this tool.
    const faq = getJsonLdScripts().find((s) => s["@type"] === "FAQPage");
    expect(faq).toBeUndefined();
    // ...but the accurate SoftwareApplication/Breadcrumb graphs remain.
    expect(getJsonLdScripts().length).toBeGreaterThan(0);
  });

  it("discloses the first-use model download on AI tool fallbacks", async () => {
    // sentiment-analyzer has no bespoke entry and pulls weights from a CDN.
    setRequest("/tools/sentiment-analyzer");
    await renderBlock();
    expect(
      screen.getByText(/downloaded from a third-party CDN/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Does .* work offline\?/i)).toBeInTheDocument();
  });

  it("does not claim on-device processing for speech-to-text", async () => {
    // Chrome and Edge implement the Web Speech API server-side.
    setRequest("/tools/speech-to-text");
    await renderBlock();
    expect(screen.getByText(/off your device/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/never uploaded to a server/i)
    ).not.toBeInTheDocument();
  });

  it("omits the privacy paragraph for tools that take no user content", async () => {
    setRequest("/tools/stopwatch");
    await renderBlock();
    expect(
      screen.getByText(/nothing here to upload or store/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/never uploaded to a server/i)
    ).not.toBeInTheDocument();
  });

  it("renders nothing outside of a /tools/ path", async () => {
    setRequest("/");
    const { container } = await renderBlock();
    expect(container).toBeEmptyDOMElement();
  });

  it("shows related tools as internal links", async () => {
    setRequest("/tools/json-formatter");
    await renderBlock();
    // json-formatter relates to yaml-json, json-csv, json-to-ts, base64.
    const links = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(links).toContain("/tools/base64");
  });

  it("renders the Russian bespoke prose and emits FAQPage on /ru/tools/compress-image-to-1mb", async () => {
    setRequest("/ru/tools/compress-image-to-1mb", { locale: "ru" });
    await renderBlock();
    expect(screen.getByText(/Сжать фото до 1 МБ/)).toBeInTheDocument();
    expect(screen.getByText("Зачем сжимать до 1 МБ?")).toBeInTheDocument();
    const faq = getJsonLdScripts().find((s) => s["@type"] === "FAQPage");
    expect(faq).toBeDefined();
    expect((faq?.mainEntity as unknown[]).length).toBe(
      toolContent["compress-image-to-1mb"].extra?.ru?.faq.length
    );
  });

  it("falls back to templated prose with no FAQPage on /de/tools/compress-pdf", async () => {
    setRequest("/de/tools/compress-pdf", { locale: "de" });
    await renderBlock();
    expect(screen.getByTestId("tool-seo-content")).toBeInTheDocument();
    // Bespoke English must not leak onto a German URL.
    expect(
      screen.queryByText(toolContent["compress-pdf"].en.intro.split("\n\n")[0])
    ).not.toBeInTheDocument();
    expect(
      getJsonLdScripts().find((s) => s["@type"] === "FAQPage")
    ).toBeUndefined();
    expect(
      getJsonLdScripts().find((s) => s["@type"] === "SoftwareApplication")
    ).toBeDefined();
  });

  it("renders the Arabic bespoke prose and FAQPage for /ar/tools/token-counter", async () => {
    setRequest("/ar/tools/token-counter", { locale: "ar" });
    await renderBlock();
    const first = toolContent["token-counter"].ar.intro.split("\n\n")[0];
    expect(screen.getByText(first)).toBeInTheDocument();
    expect(
      getJsonLdScripts().find((s) => s["@type"] === "FAQPage")
    ).toBeDefined();
  });

  it("takes the locale from the URL-derived header over a stale cookie", async () => {
    setRequest("/ru/tools/compress-image-to-1mb", {
      locale: "ru",
      cookie: "en",
    });
    await renderBlock();
    expect(screen.getByText("Зачем сжимать до 1 МБ?")).toBeInTheDocument();
  });

  it("falls back to the locale cookie when the header is absent", async () => {
    setRequest("/tools/compress-image-to-1mb", { cookie: "ru" });
    await renderBlock();
    expect(screen.getByText("Зачем сжимать до 1 МБ?")).toBeInTheDocument();
  });

  it("renders nothing for an empty slug", async () => {
    setRequest("");
    const { container } = await renderBlock();
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the root element with data-seo-content", async () => {
    await renderBlock();
    expect(screen.getByTestId("tool-seo-content")).toHaveAttribute(
      "data-seo-content"
    );
  });
});
