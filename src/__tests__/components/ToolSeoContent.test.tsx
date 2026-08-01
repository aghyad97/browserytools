import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import ToolSeoContent from "@/components/ToolSeoContent";
import { toolContent } from "@/lib/tool-content";

// usePathname is mocked globally in test-setup.ts; we override its return per test.
const mockedUsePathname = vi.mocked(usePathname);

function getJsonLdScripts(): Record<string, unknown>[] {
  return Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  ).map((el) => JSON.parse(el.textContent || "{}"));
}

describe("ToolSeoContent", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/tools/json-formatter");
  });

  it("renders the SEO content section for a known tool", () => {
    render(<ToolSeoContent />);
    expect(screen.getByTestId("tool-seo-content")).toBeInTheDocument();
    // About title interpolates the tool name.
    expect(screen.getByText(/About JSON Formatter/i)).toBeInTheDocument();
    // FAQ section heading.
    expect(screen.getByText(/Frequently asked questions/i)).toBeInTheDocument();
  });

  it("emits a FAQPage JSON-LD <script> tag", () => {
    render(<ToolSeoContent />);
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

  it("emits SoftwareApplication and BreadcrumbList JSON-LD without fake ratings", () => {
    render(<ToolSeoContent />);
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

  it("emits HowTo JSON-LD when the tool has steps", () => {
    render(<ToolSeoContent />);
    const scripts = getJsonLdScripts();
    const howTo = scripts.find((s) => s["@type"] === "HowTo");
    expect(howTo).toBeDefined();
    expect((howTo?.step as unknown[]).length).toBeGreaterThan(0);
  });

  it("renders the why-client-side and limitations blocks when authored", () => {
    render(<ToolSeoContent />);
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

  it("never puts limitations into any JSON-LD graph", () => {
    render(<ToolSeoContent />);
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

  it("omits both new sections for a tool using the templated fallback", () => {
    mockedUsePathname.mockReturnValue("/tools/todo");
    render(<ToolSeoContent />);
    // The fallback must not invent a privacy angle or fabricate limitations.
    expect(
      screen.queryByTestId("tool-seo-why-client-side")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tool-seo-limitations")).not.toBeInTheDocument();
  });

  it("renders a templated fallback for a tool without bespoke content", () => {
    mockedUsePathname.mockReturnValue("/tools/todo");
    render(<ToolSeoContent />);
    expect(screen.getByTestId("tool-seo-content")).toBeInTheDocument();
    // The on-device fallback still describes the tool and its privacy posture.
    expect(screen.getByText(/never uploaded to a server/i)).toBeInTheDocument();
    // SoftwareApplication is still emitted for fallback pages.
    const app = getJsonLdScripts().find(
      (s) => s["@type"] === "SoftwareApplication"
    );
    expect(app).toBeDefined();
  });

  it("emits no FAQPage for templated fallback content", () => {
    mockedUsePathname.mockReturnValue("/tools/todo");
    render(<ToolSeoContent />);
    // A templated question is not evidence anyone asks it about this tool.
    const faq = getJsonLdScripts().find((s) => s["@type"] === "FAQPage");
    expect(faq).toBeUndefined();
    // ...but the accurate SoftwareApplication/Breadcrumb graphs remain.
    expect(getJsonLdScripts().length).toBeGreaterThan(0);
  });

  it("discloses the first-use model download on AI tool fallbacks", () => {
    // image-upscaler has no bespoke entry and pulls weights from a CDN.
    mockedUsePathname.mockReturnValue("/tools/image-upscaler");
    render(<ToolSeoContent />);
    expect(
      screen.getByText(/downloaded from a third-party CDN/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Does .* work offline\?/i)).toBeInTheDocument();
  });

  it("does not claim on-device processing for speech-to-text", () => {
    // Chrome and Edge implement the Web Speech API server-side.
    mockedUsePathname.mockReturnValue("/tools/speech-to-text");
    render(<ToolSeoContent />);
    expect(screen.getByText(/off your device/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/never uploaded to a server/i)
    ).not.toBeInTheDocument();
  });

  it("omits the privacy paragraph for tools that take no user content", () => {
    mockedUsePathname.mockReturnValue("/tools/stopwatch");
    render(<ToolSeoContent />);
    expect(
      screen.getByText(/nothing here to upload or store/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/never uploaded to a server/i)
    ).not.toBeInTheDocument();
  });

  it("renders nothing outside of a /tools/ path", () => {
    mockedUsePathname.mockReturnValue("/");
    const { container } = render(<ToolSeoContent />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows related tools as internal links", () => {
    mockedUsePathname.mockReturnValue("/tools/json-formatter");
    render(<ToolSeoContent />);
    // json-formatter relates to yaml-json, json-csv, json-to-ts, base64.
    const links = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(links).toContain("/tools/base64");
  });
});
