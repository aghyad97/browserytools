"use client";

import { useEffect, useRef, useState } from "react";
import { openPdf } from "@/lib/pdf/pdfjs-doc";
import type { PDFFile } from "@/components/pdf-workbench/ops";

const THUMB_SCALE = 0.3;

/**
 * Render every page of `active` to a cached data-URL thumbnail (pdf.js at scale
 * 0.3), keyed by file identity (slot + size + name + page) so same-named files
 * at different slots never collide and switching files keeps prior thumbs warm.
 *
 * This is the standalone version of RotatePanel's inline render loop. RotatePanel
 * is intentionally NOT refactored onto this hook: its loop also captures each
 * page's baseline /Rotate in the same pass, so factoring it out would change
 * behavior and risk the (already-shipped, tested) rotate flow. ReorderPanel has
 * no such baseline need, so it consumes this hook directly.
 */
export function usePageThumbnails(active: PDFFile | null, selectedIndex: number) {
  const [pageCount, setPageCount] = useState(0);
  const [rendering, setRendering] = useState(false);
  // Persists across file switches; keyed by identity so it never goes stale.
  const cacheRef = useRef<Record<string, string>>({});
  const [, forceTick] = useState(0);

  const thumbKey = (page: number) =>
    active ? `${selectedIndex}:${active.size}:${active.name}#${page}` : `#${page}`;

  useEffect(() => {
    if (!active) {
      setPageCount(0);
      return;
    }
    let cancelled = false;
    setRendering(true);
    (async () => {
      try {
        const doc = await openPdf(active.data);
        if (cancelled) return;
        setPageCount(doc.numPages);
        for (let i = 0; i < doc.numPages; i++) {
          const key = `${selectedIndex}:${active.size}:${active.name}#${i}`;
          if (cacheRef.current[key]) continue;
          const page = await doc.getPage(i + 1);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: THUMB_SCALE });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = Math.max(1, Math.round(viewport.width));
            canvas.height = Math.max(1, Math.round(viewport.height));
            await page.render({ canvasContext: ctx, viewport }).promise;
            if (cancelled) return;
            cacheRef.current[key] = canvas.toDataURL("image/png");
            forceTick((n) => n + 1);
          }
        }
      } catch {
        // Render failures leave the affected thumbnails as file-icon fallbacks;
        // the panel still functions (drag/delete work on page indices, not thumbs).
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // File identity (slot + size + name) pins the render. `openPdf` is a stable
    // module import and is intentionally NOT a dep — see RotatePanel's note on
    // why an effect that calls setState must not list an unstable dependency.
  }, [active?.name, active?.data, active?.size, selectedIndex]);

  return {
    pageCount,
    rendering,
    thumbFor: (page: number) => cacheRef.current[thumbKey(page)],
  };
}
