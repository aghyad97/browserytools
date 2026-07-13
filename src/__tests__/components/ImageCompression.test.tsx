import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCompression from "@/components/ImageCompression";
import { downloadDataUrl } from "@/lib/download";

// The five-zone ToolShell pilot (file archetype). Drive the real flow:
// drop image → compress → download (via lib/download).

vi.mock("@/lib/download", () => ({
  downloadDataUrl: vi.fn(),
  downloadBlob: vi.fn(),
  downloadUrl: vi.fn(),
  downloadText: vi.fn(),
}));

// happy-dom does not fire <img> load events; resolve onload so the canvas
// compression pipeline can proceed.
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 200;
  height = 100;
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
});

async function uploadImage(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
  await user.upload(input, file);
}

describe("ImageCompression (ToolShell pilot)", () => {
  it("renders inside the shell: one h1, crumb, upload prompt", () => {
    render(<ImageCompression />);
    // ToolShell owns the single page h1.
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    // Category crumb from the shell.
    expect(screen.getByTestId("tool-shell-crumb")).toBeInTheDocument();
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
  });

  it("compresses a dropped image, then downloads via lib/download", async () => {
    const user = userEvent.setup();
    render(<ImageCompression />);

    await uploadImage(user);
    // Compress button enables once the image has loaded.
    const compress = await screen.findByRole("button", {
      name: /compress image/i,
    });
    await waitFor(() => expect(compress).toBeEnabled());

    const { toast } = await import("sonner");
    await user.click(compress);
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    // The shell's primary action is Download — enabled after compression.
    const primary = screen.getByTestId("tool-shell-primary");
    await waitFor(() => expect(primary).toBeEnabled());
    await user.click(primary);

    // Same filename convention as before the migration: <name>_compressed.<fmt>
    expect(downloadDataUrl).toHaveBeenCalledWith(
      expect.any(String),
      "photo_compressed.webp",
    );
  });

  it("keeps the download primary disabled until an image is compressed", () => {
    render(<ImageCompression />);
    expect(screen.getByTestId("tool-shell-primary")).toBeDisabled();
  });
});
