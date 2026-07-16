/**
 * PDF workbench op registry.
 *
 * The single ordered source of truth for the 9 workbench operations. The shell
 * (`PDFTools.tsx`) renders the bespoke ops (images / merge / split / compress /
 * rotate) with their own panels and iterates `PLACEHOLDER_OPS` for the
 * operations whose panels are placeholders until later tasks wire in the
 * engines under `src/lib/pdf/*`. Landing pages (Task 9/10) pass a `WorkbenchOp`
 * via the `preset` prop to open the shell on a specific tab.
 */

import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  FilePlus,
  SplitSquareHorizontal,
  Minimize2,
  RotateCw,
  ListOrdered,
  Stamp,
  FileText,
  PenLine,
} from "lucide-react";

/**
 * A loaded PDF held in the shell's shared `files` state. Single-PDF panels
 * (compress / rotate) receive this shape via props; it is structurally
 * identical to the interface declared inside `PDFTools.tsx`.
 */
export interface PDFFile {
  name: string;
  size: number;
  data: Uint8Array;
  pageCount?: number;
}

export type WorkbenchOp =
  | "images"
  | "merge"
  | "split"
  | "compress"
  | "rotate"
  | "reorder"
  | "watermark"
  | "extract"
  | "sign";

export interface WorkbenchOpDef {
  /** Tab value / preset key. */
  value: WorkbenchOp;
  /** i18n key under `Tools.PDFTools` for the tab label. */
  labelKey: string;
  /** Tab icon. */
  Icon: LucideIcon;
  /** True while the op's panel is a placeholder (wired in a later task). */
  placeholder: boolean;
}

/** All nine ops, in tab order. */
export const WORKBENCH_OPS: readonly WorkbenchOpDef[] = [
  { value: "images", labelKey: "tabImagesToPdf", Icon: ImageIcon, placeholder: false },
  { value: "merge", labelKey: "tabMerge", Icon: FilePlus, placeholder: false },
  { value: "split", labelKey: "tabSplit", Icon: SplitSquareHorizontal, placeholder: false },
  { value: "compress", labelKey: "tabCompress", Icon: Minimize2, placeholder: false },
  { value: "rotate", labelKey: "tabRotate", Icon: RotateCw, placeholder: false },
  { value: "reorder", labelKey: "tabReorder", Icon: ListOrdered, placeholder: false },
  { value: "watermark", labelKey: "tabWatermark", Icon: Stamp, placeholder: false },
  { value: "extract", labelKey: "tabExtract", Icon: FileText, placeholder: true },
  { value: "sign", labelKey: "tabSign", Icon: PenLine, placeholder: true },
];

/** The six ops whose panels are placeholders this task. */
export const PLACEHOLDER_OPS: readonly WorkbenchOpDef[] = WORKBENCH_OPS.filter(
  (op) => op.placeholder
);
