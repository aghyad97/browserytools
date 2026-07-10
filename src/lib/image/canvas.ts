/**
 * Shared canvas plumbing for image tools. Replaces per-component
 * canvasToBlob/loadImage copies (10 components at extraction time).
 */

export function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = typeof src === "string" ? src : URL.createObjectURL(src);
    const revoke = () => {
      if (typeof src !== "string") URL.revokeObjectURL(url);
    };
    const img = new Image();
    img.onload = () => {
      revoke();
      resolve(img);
    };
    img.onerror = () => {
      revoke();
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Resolves null on encode failure — deliberately matching the contract of
 * all 10 pre-existing local helpers so call-site `if (!blob)` guards keep
 * working unchanged during migration.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export function drawToCanvas(img: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}
