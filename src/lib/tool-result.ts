/**
 * Aha-moment bus.
 *
 * `download.ts` is the single download pathway for the whole product (62
 * component consumers at time of writing), so every "the tool just did the
 * thing" moment passes through one place. This module turns that moment into
 * an event the support receipt renders, with zero edits to any tool component.
 *
 * Hard rule: this bus only ever carries facts the caller actually measured.
 * A field the pathway cannot know is left `undefined` and simply not rendered,
 * never estimated. The receipt prints real numbers or nothing.
 */

export interface ToolResult {
  /** Output filename, exactly as saved. */
  filename: string;
  /** Output size in bytes. Omitted when the pathway cannot know it. */
  outputBytes?: number;
  /** Input size in bytes. Only set when a tool reports it explicitly. */
  inputBytes?: number;
  /** Processing duration in ms. Only set when a tool reports it explicitly. */
  ms?: number;
}

type Listener = (result: ToolResult) => void;

const listeners = new Set<Listener>();

/** Subscribe to tool results. Returns an unsubscribe function. */
export function onToolResult(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Publish a tool result. Called by `download.ts` for every save, and available
 * to any tool that knows richer numbers (input size, processing time) than the
 * download pathway can see.
 *
 * Listener errors are swallowed on purpose: a broken receipt must never take
 * down a user's download.
 */
export function emitToolResult(result: ToolResult): void {
  for (const listener of [...listeners]) {
    try {
      listener(result);
    } catch {
      /* a listener fault must never break the download that triggered it */
    }
  }
}
