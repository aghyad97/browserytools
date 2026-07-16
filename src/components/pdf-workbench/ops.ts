/**
 * PDF workbench op registry.
 *
 * The single ordered source of truth for the 9 workbench operations. The shell
 * (`PDFTools.tsx`) renders the three bespoke ops (images / merge / split) with
 * their own panels and iterates `PLACEHOLDER_OPS` for the six operations whose
 * panels are placeholders until Tasks 5–8 wire in the engines under
 * `src/lib/pdf/*`. Landing pages (Task 9/10) pass a `WorkbenchOp` via the
 * `preset` prop to open the shell on a specific tab.
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
  { value: "compress", labelKey: "tabCompress", Icon: Minimize2, placeholder: true },
  { value: "rotate", labelKey: "tabRotate", Icon: RotateCw, placeholder: true },
  { value: "reorder", labelKey: "tabReorder", Icon: ListOrdered, placeholder: true },
  { value: "watermark", labelKey: "tabWatermark", Icon: Stamp, placeholder: true },
  { value: "extract", labelKey: "tabExtract", Icon: FileText, placeholder: true },
  { value: "sign", labelKey: "tabSign", Icon: PenLine, placeholder: true },
];

/** The six ops whose panels are placeholders this task. */
export const PLACEHOLDER_OPS: readonly WorkbenchOpDef[] = WORKBENCH_OPS.filter(
  (op) => op.placeholder
);
