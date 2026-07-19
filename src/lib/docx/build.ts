import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  type ITableBordersOptions,
} from "docx";

import type { DocBlock } from "@/lib/pdf/layout";

/**
 * Turn the layout engine's ordered semantic document model (Tasks 1-6) into
 * a real .docx file, entirely client-side. Must stay on the browser-safe
 * `docx` API (`Packer.toBlob`) — this runs inside Task 10's PDF -> Word tool
 * component, never in Node.
 */

// Reference id for the single ordered-list numbering definition every
// `{ ordered: true }` DocBlock shares. One definition is enough: Word
// restarts numbering per contiguous run of list paragraphs automatically,
// so multiple unrelated ordered lists in the same document each still start
// at 1 without needing per-list numbering instances.
const ORDERED_LIST_REFERENCE = "browserytools-ordered-list";

const HEADING_LEVELS = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
} as const;

const RULED_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto" };

const RULED_TABLE_BORDERS: ITableBordersOptions = {
  top: RULED_BORDER,
  bottom: RULED_BORDER,
  left: RULED_BORDER,
  right: RULED_BORDER,
  insideHorizontal: RULED_BORDER,
  insideVertical: RULED_BORDER,
};

const BORDERLESS_TABLE_BORDERS: ITableBordersOptions = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER,
};

function textParagraph(text: string, rtl: boolean | undefined, extra?: Record<string, unknown>): Paragraph {
  return new Paragraph({
    bidirectional: rtl,
    children: [new TextRun(text)],
    ...extra,
  });
}

/**
 * Pad every row to the width of the widest row so the table stays
 * rectangular. `rows` may be ragged in theory (the layout engine does not
 * guarantee equal-length rows) — padding with empty cells here means
 * `buildDocx` never throws on that input, it just renders a blank cell.
 */
function padRows(rows: string[][]): string[][] {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return rows.map((row) => {
    if (row.length >= width) return row;
    return [...row, ...Array<string>(width - row.length).fill("")];
  });
}

function buildTable(block: Extract<DocBlock, { type: "table" }>): Table {
  const rows = padRows(block.rows);
  return new Table({
    borders: block.ruled ? RULED_TABLE_BORDERS : BORDERLESS_TABLE_BORDERS,
    rows: rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cellText) =>
              new TableCell({
                children: [textParagraph(cellText, undefined)],
              }),
          ),
        }),
    ),
  });
}

function buildBlock(block: DocBlock): (Paragraph | Table)[] {
  switch (block.type) {
    case "heading":
      return [textParagraph(block.text, block.rtl, { heading: HEADING_LEVELS[block.level] })];
    case "paragraph":
      return [textParagraph(block.text, block.rtl)];
    case "list":
      return block.items.map((item) =>
        textParagraph(
          item,
          block.rtl,
          block.ordered
            ? { numbering: { reference: ORDERED_LIST_REFERENCE, level: 0 } }
            : { bullet: { level: 0 } },
        ),
      );
    case "table":
      return [buildTable(block)];
  }
}

export function buildDocx(blocks: DocBlock[], meta?: { title?: string }): Promise<Blob> {
  const children = blocks.flatMap(buildBlock);

  const doc = new Document({
    title: meta?.title,
    numbering: {
      config: [
        {
          reference: ORDERED_LIST_REFERENCE,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}
