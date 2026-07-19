import mammoth from "mammoth/mammoth.browser";

/**
 * Parse an uploaded .docx into semantic HTML, entirely client-side. Feeds
 * Task 11's Word -> PDF tool, which renders this HTML and prints it to PDF.
 *
 * Deliberately imports mammoth's standalone browser bundle
 * (`mammoth/mammoth.browser.js`, per the package's own README) rather than
 * the package's default entry (`mammoth` -> `lib/index.js`). The default
 * entry's `lib/unzip.js` calls Node's `fs` directly; mammoth only swaps that
 * for a browser-safe module (`browser/unzip.js`, which accepts an
 * `arrayBuffer` instead of a `path`) via the `"browser"` field in
 * package.json, which is bundler-resolution behavior, not a language
 * guarantee. This wave already had a Node-only build leak into the client
 * bundle once (Task 6's pdf.js) by relying on exactly that kind of implicit
 * remap, so this file imports the artifact mammoth pre-built and ships
 * specifically for browser use instead: `mammoth.browser.js` is a
 * self-contained UMD bundle with no `fs`/`path`/Buffer-only calls (verified
 * by grepping the built file), and it only accepts `{ arrayBuffer }` as
 * input — there is no Node code path to accidentally take.
 */

export interface DocxParseResult {
  html: string;
  messages: string[];
}

async function toArrayBuffer(input: File | ArrayBuffer): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) return input;
  return input.arrayBuffer();
}

export async function docxToHtml(input: File | ArrayBuffer): Promise<DocxParseResult> {
  const arrayBuffer = await toArrayBuffer(input);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return {
    html: result.value,
    messages: result.messages.map((message) => message.message),
  };
}
