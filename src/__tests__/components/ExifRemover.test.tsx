import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExifRemover from "@/components/ExifRemover";

// Build a minimal JPEG with an APP1/Exif segment carrying IFD0 -> GPS IFD
// with latitude/longitude. Little-endian (II) for simplicity.
function buildExifJpeg(): ArrayBuffer {
  // We construct the TIFF block, then wrap it in APP1, then in a JPEG SOI shell.
  // TIFF layout (offsets relative to TIFF header start = tiffBase):
  //   0: "II" 0x2A00  (little endian, magic 42)
  //   4: IFD0 offset = 8
  //   8: IFD0 with 1 entry: GPS IFD pointer (0x8825) -> points to gpsOffset
  //  gpsOffset: GPS IFD with lat ref, lat, lon ref, lon
  const buf = new ArrayBuffer(512);
  const view = new DataView(buf);
  let p = 0;
  const u8 = (v: number) => { view.setUint8(p, v); p += 1; };

  // JPEG SOI
  u8(0xff); u8(0xd8);
  // APP1 marker
  u8(0xff); u8(0xe1);
  // length placeholder (2 bytes) — value not validated by parser
  u8(0x00); u8(0x00);
  // "Exif\0\0"
  u8(0x45); u8(0x78); u8(0x69); u8(0x66); u8(0x00); u8(0x00);

  const tiffBase = p; // start of TIFF header
  const setU16 = (off: number, v: number) => view.setUint16(tiffBase + off, v, true);
  const setU32 = (off: number, v: number) => view.setUint32(tiffBase + off, v, true);

  // TIFF header
  view.setUint8(tiffBase + 0, 0x49); // 'I'
  view.setUint8(tiffBase + 1, 0x49); // 'I'
  setU16(2, 42);
  setU32(4, 8); // IFD0 at offset 8

  // IFD0 @ offset 8: 1 entry
  setU16(8, 1);
  // entry 0: tag 0x8825 (GPS IFD pointer), type LONG(4), count 1, value=gpsOff
  const gpsOff = 40;
  setU16(10, 0x8825);
  setU16(12, 4);
  setU32(14, 1);
  setU32(18, gpsOff);
  // next IFD pointer
  setU32(22, 0);

  // GPS IFD @ gpsOff: 4 entries
  setU16(gpsOff, 4);
  let e = gpsOff + 2;
  const writeEntry = (tag: number, type: number, count: number, val: number) => {
    setU16(e, tag); setU16(e + 2, type); setU32(e + 4, count); setU32(e + 8, val); e += 12;
  };
  // LatRef "N\0\0\0" stored inline (ASCII type 2)
  writeEntry(0x0001, 2, 2, 0x0000004e); // 'N'
  // Latitude RATIONAL count 3 -> offset
  const latOff = gpsOff + 2 + 12 * 4 + 4; // after entries + next-ifd ptr
  writeEntry(0x0002, 5, 3, latOff);
  // LonRef "E"
  writeEntry(0x0003, 2, 2, 0x00000045); // 'E'
  // Longitude RATIONAL count 3 -> offset
  const lonOff = latOff + 24;
  writeEntry(0x0004, 5, 3, lonOff);
  // next IFD ptr
  setU32(e, 0); e += 4;

  // Latitude rationals: 37/1, 25/1, 1234/100
  setU32(latOff + 0, 37); setU32(latOff + 4, 1);
  setU32(latOff + 8, 25); setU32(latOff + 12, 1);
  setU32(latOff + 16, 1234); setU32(latOff + 20, 100);
  // Longitude rationals: 122/1, 5/1, 678/100
  setU32(lonOff + 0, 122); setU32(lonOff + 4, 1);
  setU32(lonOff + 8, 5); setU32(lonOff + 12, 1);
  setU32(lonOff + 16, 678); setU32(lonOff + 20, 100);

  return buf;
}

const EXIF_BUFFER = buildExifJpeg();

// Local FileReader mock that returns our crafted EXIF buffer (the global mock
// in test-setup returns an empty 8-byte buffer, which has no metadata).
class ExifFileReader {
  result: ArrayBuffer | null = null;
  onload: ((e: { target: ExifFileReader }) => void) | null = null;
  onerror: (() => void) | null = null;
  readAsArrayBuffer(_blob: Blob) {
    this.result = EXIF_BUFFER;
    setTimeout(() => { this.onload?.({ target: this }); }, 0);
  }
}

// Mock the Image element so img.onload fires synchronously-ish with dimensions.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 800;
  naturalHeight = 600;
  width = 800;
  height = 600;
  set src(_v: string) {
    setTimeout(() => { this.onload?.(); }, 0);
  }
}

describe("ExifRemover", () => {
  beforeEach(() => {
    vi.stubGlobal("FileReader", ExifFileReader as unknown as typeof FileReader);
    vi.stubGlobal("Image", MockImage as unknown as typeof Image);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the upload dropzone and privacy note", () => {
    render(<ExifRemover />);
    expect(screen.getByText("Drop photos here or click to upload")).toBeInTheDocument();
    expect(screen.getByText(/never uploaded to any server/i)).toBeInTheDocument();
  });

  it("reads & displays detected metadata, then exposes the cleaned download path via canvas toBlob", async () => {
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, "toBlob");
    render(<ExifRemover />);

    const input = screen.getByTestId("exif-file-input") as HTMLInputElement;
    const file = new File([new Uint8Array([0xff, 0xd8])], "vacation.jpg", { type: "image/jpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    // Detected metadata block (GPS) should appear.
    await waitFor(() => {
      expect(screen.getByTestId("exif-result")).toBeInTheDocument();
    });
    expect(screen.getByTestId("detected-metadata")).toBeInTheDocument();
    expect(screen.getByText("GPS location found")).toBeInTheDocument();
    // Location values rendered (degrees parsed from rationals).
    expect(screen.getByText(/37° 25'/)).toBeInTheDocument();

    // Cleaned image was produced via canvas.toBlob (the strip mechanism).
    expect(toBlobSpy).toHaveBeenCalled();

    // Download path: clicking download triggers an <a download> with _clean suffix.
    const createEl = document.createElement.bind(document);
    let downloadName = "";
    const spy = vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = createEl(tag) as HTMLElement;
      if (tag === "a") {
        Object.defineProperty(el, "click", { value: vi.fn(), writable: true });
        const orig = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, "download");
        void orig;
        (el as HTMLAnchorElement).addEventListener("click", () => {});
      }
      return el as HTMLElement;
    });

    const downloadBtn = screen.getByTestId("download-clean");
    // Capture the download attribute set on the created anchor.
    const anchorClickSpy = vi.fn();
    spy.mockImplementation((tag: string) => {
      const el = createEl(tag) as HTMLElement;
      if (tag === "a") {
        Object.defineProperty(el, "click", { value: anchorClickSpy });
        const setAttr = el.setAttribute.bind(el);
        el.setAttribute = (name: string, value: string) => {
          if (name === "download") downloadName = value;
          return setAttr(name, value);
        };
        Object.defineProperty(el, "download", {
          set(v: string) { downloadName = v; },
          get() { return downloadName; },
          configurable: true,
        });
      }
      return el as HTMLElement;
    });

    fireEvent.click(downloadBtn);

    expect(anchorClickSpy).toHaveBeenCalled();
    expect(downloadName).toBe("vacation_clean.jpg");

    spy.mockRestore();
    toBlobSpy.mockRestore();
  });
});
