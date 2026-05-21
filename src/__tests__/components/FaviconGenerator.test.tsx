import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FaviconGenerator from "@/components/FaviconGenerator";

// JSZip is dynamically imported in the download path. Mock it so we can assert
// which entries get written into the archive without running real zipping.
const zipFile = vi.fn();
const generateAsync = vi
  .fn()
  .mockResolvedValue(new Blob(["zip"], { type: "application/zip" }));
vi.mock("jszip", () => ({
  default: class MockJSZip {
    file = zipFile;
    generateAsync = generateAsync;
  },
}));

// happy-dom does not fire load events for <img>; resolve onload synchronously
// so the generation path can proceed after src assignment.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 64;
  height = 64;
  private _src = "";
  set src(value: string) {
    this._src = value;
    setTimeout(() => this.onload?.(), 0);
  }
  get src() {
    return this._src;
  }
}

beforeEach(() => {
  vi.stubGlobal("Image", MockImage);
  zipFile.mockClear();
  generateAsync.mockClear();
});

async function uploadImage() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], "logo.png", { type: "image/png" });
  await user.upload(input, file);
  // Source preview appears once the FileReader resolves.
  await screen.findByAltText("Source image");
  return user;
}

describe("FaviconGenerator", () => {
  it("renders the upload prompt and generate button", () => {
    render(<FaviconGenerator />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate favicons/i })
    ).toBeInTheDocument();
  });

  it("generates the favicon set from an uploaded image", async () => {
    render(<FaviconGenerator />);
    const user = await uploadImage();

    await user.click(
      screen.getByRole("button", { name: /generate favicons/i })
    );

    // All six preview sizes should render.
    await screen.findByAltText("16x16");
    expect(screen.getByAltText("512x512")).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalled();

    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });

  it("zips all outputs (PNGs + favicon.ico + manifest + snippet) on download", async () => {
    render(<FaviconGenerator />);
    const user = await uploadImage();

    await user.click(
      screen.getByRole("button", { name: /generate favicons/i })
    );
    await screen.findByAltText("16x16");

    await user.click(screen.getByRole("button", { name: /download zip/i }));

    await waitFor(() => expect(generateAsync).toHaveBeenCalled());

    const names = zipFile.mock.calls.map((c) => c[0]);
    expect(names).toContain("favicon-16x16.png");
    expect(names).toContain("favicon-32x32.png");
    expect(names).toContain("apple-touch-icon.png");
    expect(names).toContain("favicon-512x512.png");
    expect(names).toContain("favicon.ico");
    expect(names).toContain("site.webmanifest");
    expect(names).toContain("favicon-snippet.html");
  });

  it("generates from a letter without an uploaded image", async () => {
    const user = userEvent.setup();
    render(<FaviconGenerator />);

    // Switch to the letter/emoji tab.
    await user.click(screen.getByRole("tab", { name: /letter/i }));
    const glyphInput = await screen.findByTestId("glyph-input");
    await user.clear(glyphInput);
    await user.type(glyphInput, "Z");

    await user.click(
      screen.getByRole("button", { name: /generate favicons/i })
    );

    await screen.findByAltText("32x32");
    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
  });
});
