// Minimal type declarations for mammoth's standalone browser bundle
// (mammoth/mammoth.browser.js). The main "mammoth" package ships types for
// its Node-capable entry point (lib/index.d.ts, resolved automatically by
// TS), but that .d.ts is not present alongside the browser bundle, so it
// needs its own ambient declaration. Shape mirrors lib/index.d.ts, trimmed
// to the browser-only input variant (ArrayBuffer, never a Node path/Buffer)
// and the subset of the API this codebase actually calls.
declare module "mammoth/mammoth.browser" {
  interface ArrayBufferInput {
    arrayBuffer: ArrayBuffer;
  }

  interface ConvertOptions {
    styleMap?: string | string[];
    includeEmbeddedStyleMap?: boolean;
    includeDefaultStyleMap?: boolean;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
  }

  interface Warning {
    type: "warning";
    message: string;
  }

  interface ConversionError {
    type: "error";
    message: string;
    error: unknown;
  }

  type Message = Warning | ConversionError;

  interface Result {
    value: string;
    messages: Message[];
  }

  const mammoth: {
    convertToHtml: (input: ArrayBufferInput, options?: ConvertOptions) => Promise<Result>;
  };

  export = mammoth;
}
