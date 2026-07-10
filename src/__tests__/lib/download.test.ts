import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadBlob, downloadText, downloadUrl } from "@/lib/download";

describe("download helpers", () => {
  let clicked: HTMLAnchorElement[] = [];
  let createURL: ReturnType<typeof vi.spyOn>;
  let revokeURL: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clicked = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push(this);
    });
    createURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    revokeURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("downloadBlob creates an object URL, clicks an anchor with the filename, then revokes", () => {
    downloadBlob(new Blob(["x"]), "out.png");
    expect(createURL).toHaveBeenCalledOnce();
    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe("out.png");
    expect(clicked[0].href).toContain("blob:mock-url");
    expect(revokeURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("downloadUrl clicks an anchor pointing at the given url without revoking it", () => {
    downloadUrl("blob:existing", "file.webm");
    expect(clicked[0].download).toBe("file.webm");
    expect(revokeURL).not.toHaveBeenCalled();
  });

  it("downloadText wraps text in a Blob with the given mime", () => {
    downloadText("hello", "notes.txt");
    expect(createURL).toHaveBeenCalledOnce();
    const blob = createURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("text/plain;charset=utf-8");
    expect(clicked[0].download).toBe("notes.txt");
  });
});
