/**
 * Single download pathway for every tool. Replaces the per-component
 * `document.createElement("a")` pattern (68 call sites at extraction time).
 */

function clickAnchor(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadUrl(url: string, filename: string): void {
  clickAnchor(url, filename);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    clickAnchor(url, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadText(text: string, filename: string, mime = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  clickAnchor(dataUrl, filename);
}
