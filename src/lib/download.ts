/**
 * Single download pathway for every tool. Replaces the per-component
 * `document.createElement("a")` pattern (68 call sites at extraction time).
 *
 * Because every tool saves through here, this is also the one place that knows
 * when a tool has actually delivered something. Each public helper publishes a
 * `ToolResult` so the support receipt can react without any tool component
 * knowing it exists. Only measured facts are published: `downloadBlob` knows
 * its byte count, `downloadUrl` and `downloadDataUrl` do not and stay silent
 * about size rather than guess.
 */

import { emitToolResult } from "./tool-result";

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
  emitToolResult({ filename });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    clickAnchor(url, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
  emitToolResult({ filename, outputBytes: blob.size });
}

export function downloadText(text: string, filename: string, mime = "text/plain;charset=utf-8"): void {
  // Delegates to downloadBlob, which publishes the result. No emit here, or
  // every text save would report twice.
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  clickAnchor(dataUrl, filename);
  emitToolResult({ filename });
}
