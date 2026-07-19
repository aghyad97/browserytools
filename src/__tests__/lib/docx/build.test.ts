import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { buildDocx } from "@/lib/docx/build";
import type { DocBlock } from "@/lib/pdf/layout";

const BLOCKS: DocBlock[] = [
  { type: "heading", level: 1, text: "Introduction" },
  { type: "paragraph", text: "This is a plain paragraph." },
  {
    type: "table",
    ruled: true,
    rows: [
      ["A1", "B1"],
      ["A2", "B2"],
    ],
  },
  { type: "list", ordered: false, items: ["First bullet item", "Second bullet item"] },
  { type: "paragraph", text: "فقرة باللغة العربية", rtl: true },
];

async function extractDocumentXml(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(bytes);
  const entry = zip.file("word/document.xml");
  expect(entry).not.toBeNull();
  return entry!.async("string");
}

describe("buildDocx", () => {
  it("produces a valid, non-trivial ZIP (PK magic bytes)", async () => {
    const blob = await buildDocx(BLOCKS);
    expect(blob).toBeInstanceOf(Blob);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    // ZIP local file header magic: 0x50 0x4B 0x03 0x04 ("PK\x03\x04")
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("emits a heading paragraph styled Heading1", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    expect(xml).toMatch(/<w:pStyle w:val="Heading1"\s*\/>/);
    expect(xml).toContain("Introduction");
  });

  it("includes the plain paragraph text", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    expect(xml).toContain("This is a plain paragraph.");
  });

  it("emits a table with all four cell texts", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    expect(xml).toContain("<w:tbl>");
    for (const text of ["A1", "B1", "A2", "B2"]) {
      expect(xml).toContain(text);
    }
  });

  it("includes both unordered list item texts", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    expect(xml).toContain("First bullet item");
    expect(xml).toContain("Second bullet item");
  });

  it("emits w:bidi for an rtl paragraph", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    expect(xml).toMatch(/<w:bidi/);
    expect(xml).toContain("فقرة باللغة العربية");
  });

  it("sets the document core title from meta.title", async () => {
    const blob = await buildDocx(
      [{ type: "paragraph", text: "hello" }],
      { title: "My Converted Document" },
    );
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const zip = await JSZip.loadAsync(bytes);
    const core = await zip.file("docProps/core.xml")!.async("string");
    expect(core).toContain("My Converted Document");
  });

  it("pads ragged table rows so the table stays rectangular", async () => {
    const raggedBlocks: DocBlock[] = [
      {
        type: "table",
        ruled: false,
        rows: [
          ["only-one"],
          ["two", "cells"],
        ],
      },
    ];
    await expect(buildDocx(raggedBlocks)).resolves.toBeInstanceOf(Blob);
  });

  it("emits w:numPr with a numId for an ordered list, and includes item texts", async () => {
    const orderedBlocks: DocBlock[] = [
      { type: "list", ordered: true, items: ["First step", "Second step"] },
    ];
    const xml = await extractDocumentXml(await buildDocx(orderedBlocks));
    expect(xml).toMatch(/<w:numPr>\s*<w:ilvl w:val="0"\s*\/>\s*<w:numId w:val="\d+"\s*\/>\s*<\/w:numPr>/);
    expect(xml).toContain("First step");
    expect(xml).toContain("Second step");
  });

  it("gives two separate ordered lists in the same document different numId values so the second list restarts at 1", async () => {
    const twoListBlocks: DocBlock[] = [
      { type: "list", ordered: true, items: ["A-one", "A-two"] },
      { type: "paragraph", text: "separator paragraph" },
      { type: "list", ordered: true, items: ["B-one", "B-two"] },
    ];
    const xml = await extractDocumentXml(await buildDocx(twoListBlocks));

    // Extract each <w:p>...</w:p> paragraph and read the numId (if any) it
    // carries, so we associate a numId with the specific list item text
    // rather than just checking "some numId appears somewhere".
    const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
    const numIdForText = (text: string): string | null => {
      const paragraph = paragraphs.find((p) => p.includes(text));
      expect(paragraph).toBeDefined();
      const match = paragraph!.match(/<w:numId w:val="(\d+)"/);
      return match ? match[1] : null;
    };

    const aOne = numIdForText("A-one");
    const aTwo = numIdForText("A-two");
    const bOne = numIdForText("B-one");
    const bTwo = numIdForText("B-two");

    expect(aOne).not.toBeNull();
    expect(bOne).not.toBeNull();
    expect(aOne).toBe(aTwo);
    expect(bOne).toBe(bTwo);
    // The regression: without a distinct numbering instance per ordered-list
    // block, both lists share one numId and List B continues counting from
    // List A (3, 4) instead of restarting at 1, 2.
    expect(aOne).not.toBe(bOne);
  });

  it("emits single borders on insideVertical for a ruled table", async () => {
    const xml = await extractDocumentXml(await buildDocx(BLOCKS));
    const bordersBlock = xml.match(/<w:tblBorders>[\s\S]*?<\/w:tblBorders>/);
    expect(bordersBlock).not.toBeNull();
    expect(bordersBlock![0]).toMatch(/<w:insideV w:val="single"/);
  });

  it("emits none on all six table edges for a borderless table", async () => {
    const borderlessBlocks: DocBlock[] = [
      {
        type: "table",
        ruled: false,
        rows: [["A1", "B1"]],
      },
    ];
    const xml = await extractDocumentXml(await buildDocx(borderlessBlocks));
    const bordersBlock = xml.match(/<w:tblBorders>[\s\S]*?<\/w:tblBorders>/);
    expect(bordersBlock).not.toBeNull();
    for (const edge of ["top", "bottom", "left", "right", "insideH", "insideV"]) {
      expect(bordersBlock![0]).toMatch(new RegExp(`<w:${edge} w:val="none"`));
    }
  });

  it("resolves to a valid Blob for a zero-row table instead of throwing", async () => {
    const zeroRowBlocks: DocBlock[] = [{ type: "table", ruled: true, rows: [] }];
    await expect(buildDocx(zeroRowBlocks)).resolves.toBeInstanceOf(Blob);
  });
});
