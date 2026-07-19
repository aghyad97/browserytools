import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { extractDocument } from "@/lib/pdf/layout/index";
import type { DocBlock } from "@/lib/pdf/layout/blocks";

const FIXTURES_DIR = path.join(process.cwd(), "src/__tests__/fixtures/pdf");

function loadFixtureBytes(name: string): Uint8Array {
  return new Uint8Array(readFileSync(path.join(FIXTURES_DIR, name)));
}

function textOf(block: DocBlock): string {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "table") return block.rows.flat().join(" ");
  return block.text;
}

describe("extractDocument — doc3-tables.pdf (both ruled and borderless tables recovered)", () => {
  it("emits at least 2 table blocks, no scanned pages, pageCount 1", async () => {
    const data = loadFixtureBytes("doc3-tables.pdf");
    const result = await extractDocument(data);

    expect(result.pageCount).toBe(1);
    expect(result.scannedPages).toEqual([]);

    const tableBlocks = result.blocks.filter((b) => b.type === "table");
    expect(tableBlocks.length).toBeGreaterThanOrEqual(2);

    // Sanity: the two tables' distinctive ground-truth values are both
    // present, and each shows up in exactly one table block — proof the
    // ruled-vs-borderless dedupe did not merge or drop either table.
    const ruledCell = tableBlocks.filter((b) => textOf(b).includes("48200"));
    const borderlessCell = tableBlocks.filter((b) => textOf(b).includes("Widget A"));
    expect(ruledCell).toHaveLength(1);
    expect(borderlessCell).toHaveLength(1);
  });
});

describe("extractDocument — doc1-simple-scanned.pdf (image-only page)", () => {
  it("records the page as scanned and emits no text blocks for it", async () => {
    const data = loadFixtureBytes("doc1-simple-scanned.pdf");
    const result = await extractDocument(data);

    expect(result.pageCount).toBe(1);
    expect(result.scannedPages).toEqual([0]);
    expect(result.blocks).toHaveLength(0);
  });
});

describe("extractDocument — buffer-detach regression (PR#46 bug class)", () => {
  it("does not detach the caller's original Uint8Array", async () => {
    const data = loadFixtureBytes("doc1-simple.pdf");
    const originalLength = data.length;
    expect(originalLength).toBeGreaterThan(0);

    await extractDocument(data);

    // pdf.js transfers (detaches) whatever ArrayBuffer it is handed. If
    // extractDocument ever passes `data` directly instead of a copy, this
    // buffer's length collapses to 0 after getDocument() runs. See the task-6
    // brief / PR#46 — this exact bug broke every PDF tool in a previous wave.
    expect(data.length).toBe(originalLength);
  });
});

describe("extractDocument — doc2-twocol.pdf (page-wide borderless false-positive guard, end to end)", () => {
  it("emits zero table blocks", async () => {
    const data = loadFixtureBytes("doc2-twocol.pdf");
    const result = await extractDocument(data);

    expect(result.scannedPages).toEqual([]);
    expect(result.blocks.some((b) => b.type === "table")).toBe(false);
  });
});

describe("extractDocument — doc1-simple.pdf (end-to-end sanity)", () => {
  it("emits 1 h1, 2 h2, 1 list, and no leaked/duplicated text", async () => {
    const data = loadFixtureBytes("doc1-simple.pdf");
    const result = await extractDocument(data);

    expect(result.pageCount).toBe(1);
    expect(result.scannedPages).toEqual([]);

    const h1 = result.blocks.filter((b) => b.type === "heading" && b.level === 1);
    expect(h1).toHaveLength(1);
    expect((h1[0] as Extract<DocBlock, { type: "heading" }>).text).toBe(
      "Quarterly Operations Report",
    );

    const h2 = result.blocks.filter((b) => b.type === "heading" && b.level === 2);
    expect(h2).toHaveLength(2);
    expect(h2.map((b) => (b as Extract<DocBlock, { type: "heading" }>).text)).toEqual([
      "Key Developments",
      "Outlook",
    ]);

    const lists = result.blocks.filter((b) => b.type === "list");
    expect(lists).toHaveLength(1);
    expect((lists[0] as Extract<DocBlock, { type: "list" }>).items).toHaveLength(3);

    // No block's text is repeated verbatim in another block (a cheap proxy
    // for "nothing got emitted twice").
    const texts = result.blocks.map(textOf).filter((t) => t.length > 0);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe("extractDocument — progress reporting", () => {
  it("calls onProgress and ends at 100", async () => {
    const data = loadFixtureBytes("doc1-simple.pdf");
    const calls: number[] = [];

    await extractDocument(data, { onProgress: (p) => calls.push(p) });

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[calls.length - 1]).toBe(100);
    for (const p of calls) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
  });
});
