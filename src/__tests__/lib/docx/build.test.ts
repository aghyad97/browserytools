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
});
