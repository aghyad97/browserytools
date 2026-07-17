"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFFile } from "@/components/pdf-workbench/ops";

/**
 * Owns `selectedIndex` for the workbench's single-PDF panels (Compress /
 * Rotate / Reorder / Watermark / Extract / Sign).
 *
 * `ActiveFileBar`'s Change button routes the picked file through the shell's
 * `onDropPdf`, which is ASYNC (it reads the file, validates it as a PDF, then
 * appends to the shared `files` array on a later render) — so at the moment
 * the file is picked, `files` does not yet contain it. Guessing the new file's
 * index synchronously and selecting it immediately races that append: this
 * hook's own "clamp out-of-range index" safeguard would see the still-stale,
 * shorter `files` array and immediately reset the guess back to 0.
 *
 * Instead this hook watches `files.length` and reacts only once the array
 * actually grows, selecting the newest (last) file. If it instead shrinks
 * (e.g. a file removed from the Merge tab's shared list) and the current
 * index falls out of range, it clamps back to 0.
 */
export function useActiveFileIndex(files: PDFFile[]): [number, (index: number) => void] {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevLength = useRef(files.length);

  useEffect(() => {
    if (files.length > prevLength.current) {
      setSelectedIndex(files.length - 1);
    } else if (selectedIndex > files.length - 1) {
      setSelectedIndex(0);
    }
    prevLength.current = files.length;
  }, [files.length, selectedIndex]);

  return [selectedIndex, setSelectedIndex];
}
