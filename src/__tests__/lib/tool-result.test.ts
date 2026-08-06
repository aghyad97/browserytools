import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { onToolResult, emitToolResult, type ToolResult } from "@/lib/tool-result";
import { downloadBlob, downloadText, downloadUrl, downloadDataUrl } from "@/lib/download";

describe("tool-result bus", () => {
  it("delivers results to subscribers and stops after unsubscribe", () => {
    const seen: ToolResult[] = [];
    const off = onToolResult((r) => seen.push(r));

    emitToolResult({ filename: "a.txt" });
    expect(seen).toEqual([{ filename: "a.txt" }]);

    off();
    emitToolResult({ filename: "b.txt" });
    expect(seen).toHaveLength(1);
  });

  it("isolates a throwing listener so other listeners and the caller survive", () => {
    const seen: string[] = [];
    const offBad = onToolResult(() => {
      throw new Error("listener exploded");
    });
    const offGood = onToolResult((r) => seen.push(r.filename));

    expect(() => emitToolResult({ filename: "c.txt" })).not.toThrow();
    expect(seen).toEqual(["c.txt"]);

    offBad();
    offGood();
  });
});

describe("download helpers publish tool results", () => {
  let seen: ToolResult[];
  let off: () => void;

  beforeEach(() => {
    seen = [];
    off = onToolResult((r) => seen.push(r));
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    off();
    vi.restoreAllMocks();
  });

  it("downloadBlob reports the filename and the measured byte count", () => {
    downloadBlob(new Blob(["12345"]), "out.png");
    expect(seen).toEqual([{ filename: "out.png", outputBytes: 5 }]);
  });

  it("downloadText reports exactly once (it delegates to downloadBlob)", () => {
    downloadText("hello", "notes.txt");
    expect(seen).toHaveLength(1);
    expect(seen[0].filename).toBe("notes.txt");
  });

  it("omits the byte count when the pathway cannot measure it, never guessing", () => {
    downloadUrl("blob:existing", "clip.webm");
    downloadDataUrl("data:text/plain;base64,aGk=", "hi.txt");
    expect(seen).toEqual([{ filename: "clip.webm" }, { filename: "hi.txt" }]);
    expect(seen.every((r) => r.outputBytes === undefined)).toBe(true);
  });
});
