// Minimal type declarations for gif.js (no official @types package).
// Covers the subset of the API used by the Video -> GIF converter.
declare module "gif.js" {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    workerScript?: string;
    width?: number;
    height?: number;
    repeat?: number;
    background?: string;
    transparent?: string | null;
    dither?: boolean | string;
    debug?: boolean;
  }

  interface GIFFrameOptions {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  }

  type GIFEvent = "start" | "progress" | "finished" | "abort";

  export default class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasImageSource | CanvasRenderingContext2D | ImageData,
      options?: GIFFrameOptions
    ): void;
    on(event: "progress", handler: (progress: number) => void): void;
    on(event: "finished", handler: (blob: Blob) => void): void;
    on(event: "start" | "abort", handler: () => void): void;
    render(): void;
    abort(): void;
  }
}
