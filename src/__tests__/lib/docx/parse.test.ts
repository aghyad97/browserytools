import { describe, it, expect } from "vitest";
import { buildDocx } from "@/lib/docx/build";
import { docxToHtml } from "@/lib/docx/parse";
import type { DocBlock } from "@/lib/pdf/layout/blocks";

const BLOCKS: DocBlock[] = [
  { type: "heading", level: 1, text: "Round Trip Heading" },
  { type: "paragraph", text: "A plain paragraph for the round trip." },
  {
    type: "table",
    ruled: true,
    rows: [
      ["A1", "B1"],
      ["A2", "B2"],
    ],
  },
  { type: "list", ordered: false, items: ["First bullet item", "Second bullet item"] },
];

describe("docxToHtml", () => {
  it("round-trips a real .docx (built by buildDocx) back to HTML: heading in <h1>, paragraph text, table cells, list items", async () => {
    const blob = await buildDocx(BLOCKS);
    const arrayBuffer = await blob.arrayBuffer();

    const { html, messages } = await docxToHtml(arrayBuffer);

    // mammoth maps Word's "Heading1" style to a semantic <h1>.
    expect(html).toMatch(/<h1[^>]*>[^<]*Round Trip Heading[^<]*<\/h1>/);
    expect(html).toContain("A plain paragraph for the round trip.");

    expect(html).toMatch(/<table[^>]*>[\s\S]*<\/table>/);
    for (const cell of ["A1", "B1", "A2", "B2"]) {
      expect(html).toContain(cell);
    }

    // Both list items must land inside <li> elements.
    const listItems = html.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? [];
    expect(listItems.some((li) => li.includes("First bullet item"))).toBe(true);
    expect(listItems.some((li) => li.includes("Second bullet item"))).toBe(true);

    // `messages` must always be an array so Task 11's UI can safely render it
    // even when nothing was lossy. This fixture (headings/paragraphs/a plain
    // table/a plain bullet list, no images, no unrecognized styles) produces
    // no warnings from mammoth today, so messages is expected to be empty —
    // but the assertion only pins the *shape*, not the count, since mammoth's
    // heuristics are free to start warning about any of these in a future
    // version without that being a regression in this codebase.
    expect(Array.isArray(messages)).toBe(true);
    for (const message of messages) {
      expect(typeof message).toBe("string");
    }
  });

  it("accepts a File and an ArrayBuffer and returns equivalent HTML", async () => {
    const blob = await buildDocx(BLOCKS);
    const arrayBuffer = await blob.arrayBuffer();
    const file = new File([arrayBuffer], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const fromFile = await docxToHtml(file);
    const fromArrayBuffer = await docxToHtml(arrayBuffer);

    expect(fromFile.html).toBe(fromArrayBuffer.html);
  });

  it("rejects a non-docx input with a useful error instead of hanging or returning empty HTML", async () => {
    const garbage = new TextEncoder().encode("this is definitely not a zip/docx file").buffer;

    await expect(docxToHtml(garbage)).rejects.toThrow();
  });
});
