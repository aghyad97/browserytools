import { describe, it, expect } from "vitest";
import JSZip from "jszip";
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

  it("forwards mammoth's conversion warnings through `messages` (not silently dropped)", async () => {
    // `messages` exists specifically so Task 11's Word -> PDF UI can tell the
    // user what didn't survive conversion. Nothing above proves the wiring
    // (`result.messages.map(...)` in parse.ts) actually runs: the round-trip
    // fixture produces zero mammoth warnings, so an empty array satisfies
    // every prior assertion even if messages were hardcoded to `[]`.
    //
    // To force a real warning deterministically (without reaching into
    // mammoth's internal `styleMap` option, which would mean changing
    // `docxToHtml`'s public signature just to make this test easier), build
    // a real .docx via `buildDocx`, then corrupt its `word/document.xml` so
    // the heading paragraph's `w:pStyle` points at a style ID that is not
    // defined anywhere in `styles.xml`. mammoth's body-reader unconditionally
    // warns in that case (see `undefinedStyleWarning` in
    // `mammoth/lib/docx/body-reader.js`) — this fires during ordinary
    // parsing, with no options required, so it is a faithful stand-in for
    // "a real Word document mammoth couldn't fully map."
    const blob = await buildDocx(BLOCKS);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const documentXmlPath = "word/document.xml";
    const documentXml = await zip.file(documentXmlPath)?.async("string");
    if (documentXml === undefined) {
      throw new Error(`buildDocx output is missing ${documentXmlPath}`);
    }
    expect(documentXml).toContain('w:pStyle w:val="Heading1"');
    const corruptedXml = documentXml.replace(
      'w:pStyle w:val="Heading1"',
      'w:pStyle w:val="NoSuchStyleZZZ"',
    );
    zip.file(documentXmlPath, corruptedXml);
    const corruptedArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });

    const { messages } = await docxToHtml(corruptedArrayBuffer);

    expect(messages.length).toBeGreaterThan(0);
    expect(
      messages.some((message) =>
        message.includes("Paragraph style with ID NoSuchStyleZZZ was referenced but not defined"),
      ),
    ).toBe(true);
  });
});
