// @vitest-environment jsdom
//
// This file runs under jsdom (not this repo's global happy-dom) because
// DOMPurify needs real DOM fidelity to behave correctly. Under happy-dom,
// DOMPurify's sanitize() is unreliable — e.g. it does not merely over-strip;
// sanitize('<p>x</p><script>alert(3)</script>') actually leaves the live
// <script> tag intact depending on sibling order. That inconsistency is why
// src/__tests__/components/WordToPdf.test.tsx mocks dompurify as an identity
// passthrough (UI-wiring coverage only). This file imports only the thin
// sanitize-html.ts wrapper plus the real dompurify package — never the
// component tree — to avoid dragging in the unrelated @exodus/bytes
// ESM-only import that makes jsdom unusable as this repo's global
// environment.
import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "@/lib/sanitize-html";

describe("sanitizeHtml (real DOMPurify, jsdom)", () => {
  it("neutralizes a bare <script> tag", () => {
    const out = sanitizeHtml("<script>alert(1)</script>");
    expect(out).not.toContain("<script");
  });

  it("neutralizes a <script> that follows other content (the happy-dom failure case)", () => {
    const out = sanitizeHtml("<p>x</p><script>alert(3)</script>");
    expect(out).not.toContain("<script");
  });

  it("strips an onerror handler from an img tag", () => {
    const out = sanitizeHtml('<img src=x onerror="alert(1)">');
    expect(out.toLowerCase()).not.toContain("onerror");
  });

  it("neutralizes a javascript: URL in an href", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>');
    expect(out.toLowerCase()).not.toContain("javascript:");
  });

  it("preserves legitimate document markup (proves it isn't just returning empty)", () => {
    const doc = `
      <h1>Report Title</h1>
      <p>Some <b>bold</b> text.</p>
      <ul><li>First item</li><li>Second item</li></ul>
      <table><tr><td>Cell A</td><td>Cell B</td></tr></table>
    `;
    const out = sanitizeHtml(doc);
    expect(out).toContain("<h1>");
    expect(out).toContain("<p>");
    expect(out).toContain("<b>");
    expect(out).toContain("<ul>");
    expect(out).toContain("<li>");
    expect(out).toContain("<table>");
    expect(out).toContain("<tr>");
    expect(out).toContain("<td>");
    expect(out).toContain("Report Title");
    expect(out).toContain("First item");
  });
});
