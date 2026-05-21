import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompressVideo from "@/components/CompressVideo";

// ffmpeg.wasm must never run real WASM in tests. Mock the FFmpeg class and the
// util helpers so the compression path is exercised purely against the UI.
let progressHandler: ((e: { progress: number }) => void) | null = null;

const load = vi.fn().mockResolvedValue(undefined);
const writeFile = vi.fn().mockResolvedValue(undefined);
const exec = vi.fn().mockImplementation(async () => {
  progressHandler?.({ progress: 0.5 });
  progressHandler?.({ progress: 1 });
});
const readFile = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]));

vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: class {
    on(event: string, cb: (e: { progress: number }) => void) {
      if (event === "progress") progressHandler = cb;
    }
    off() {
      progressHandler = null;
    }
    load = load;
    writeFile = writeFile;
    exec = exec;
    readFile = readFile;
  },
}));

vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([0])),
}));

beforeEach(() => {
  progressHandler = null;
  load.mockClear();
  writeFile.mockClear();
  exec.mockClear();
  readFile.mockClear();
});

async function uploadVideo(container: HTMLElement) {
  const user = userEvent.setup();
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["x".repeat(1000)], "clip.mp4", { type: "video/mp4" });
  await user.upload(input, file);
  await screen.findByText("clip.mp4");
  return user;
}

describe("CompressVideo", () => {
  it("renders the idle upload prompt and controls", () => {
    render(<CompressVideo />);
    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /compress video/i })
    ).toBeDisabled();
  });

  it("enables compression once a file is selected", async () => {
    const { container } = render(<CompressVideo />);
    await uploadVideo(container);
    expect(
      screen.getByRole("button", { name: /compress video/i })
    ).toBeEnabled();
  });

  it("compresses through ffmpeg and shows the output + download", async () => {
    const { container } = render(<CompressVideo />);
    const user = await uploadVideo(container);

    await user.click(screen.getByRole("button", { name: /compress video/i }));

    await waitFor(() => expect(exec).toHaveBeenCalled());
    expect(load).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
    expect(readFile).toHaveBeenCalled();

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    // Download button becomes enabled once output is ready.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /download/i })).toBeEnabled()
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("passes the chosen CRF and libx264 codec to ffmpeg args", async () => {
    const { container } = render(<CompressVideo />);
    const user = await uploadVideo(container);
    await user.click(screen.getByRole("button", { name: /compress video/i }));

    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args).toContain("libx264");
    expect(args).toContain("-crf");
    expect(args).toContain("28");
  });
});
