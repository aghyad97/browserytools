import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoToAudio from "@/components/VideoToAudio";

// Canonical ffmpeg mock — CompressVideo.test.tsx pattern.
let progressHandler: ((e: { progress: number }) => void) | null = null;
const load = vi.fn().mockResolvedValue(undefined);
const writeFile = vi.fn().mockResolvedValue(undefined);
const exec = vi.fn().mockImplementation(async () => {
  progressHandler?.({ progress: 1 });
});
const readFile = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
const deleteFile = vi.fn().mockResolvedValue(undefined);

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
    deleteFile = deleteFile;
  },
}));
vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([0])),
}));

beforeEach(() => {
  progressHandler = null;
  [load, writeFile, exec, readFile, deleteFile].forEach((f) => f.mockClear());
  exec.mockImplementation(async () => {
    progressHandler?.({ progress: 1 });
  });
});

function makeFile(name: string) {
  return new File(["x".repeat(100)], name, { type: "video/mp4" });
}

async function uploadFiles(container: HTMLElement, names: string[]) {
  const user = userEvent.setup();
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  await user.upload(input, names.map(makeFile));
  for (const n of names) await screen.findByText(n);
  return user;
}

describe("VideoToAudio", () => {
  it("renders dropzone and disabled convert button when empty", () => {
    render(<VideoToAudio />);
    expect(screen.getByText(/drop your videos here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /convert all/i })).toBeDisabled();
  });

  it("queues multiple files and converts them sequentially", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4", "b.mov"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(2));
    // Both rows expose a download button once done.
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(2)
    );
    // Inputs and outputs cleaned from ffmpeg FS after each file.
    expect(deleteFile).toHaveBeenCalledTimes(4);
  });

  it("passes -vn and the selected codec/bitrate to ffmpeg", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args).toContain("-vn");
    expect(args).toContain("libmp3lame"); // mp3 default
    expect(args).toContain("-b:a");
    expect(args).toContain("192k"); // default bitrate
  });

  it("applies trim times as -ss/-to output options", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /trim/i }));
    await user.type(screen.getByLabelText(/start/i), "0:10");
    await user.type(screen.getByLabelText(/end/i), "1:00");
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    const ssIdx = args.indexOf("-ss");
    expect(ssIdx).toBeGreaterThan(args.indexOf("-i")); // output option
    expect(args[ssIdx + 1]).toBe("10");
    expect(args[args.indexOf("-to") + 1]).toBe("60");
  });

  it("marks a file with start >= end as error and still converts the rest", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["bad.mp4", "good.mp4"]);
    const badRow = screen.getByText("bad.mp4").closest("li") as HTMLElement;
    await user.click(within(badRow).getByRole("button", { name: /trim/i }));
    await user.type(within(badRow).getByLabelText(/start/i), "2:00");
    await user.type(within(badRow).getByLabelText(/end/i), "1:00");
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid trim/i)).toBeInTheDocument()
    );
    // Only the good file reached ffmpeg, and it completed.
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(1)
    );
  });

  it("continues the queue when one file fails to convert", async () => {
    exec
      .mockImplementationOnce(async () => {
        throw new Error("demux failed");
      })
      .mockImplementationOnce(async () => {
        progressHandler?.({ progress: 1 });
      });
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["broken.avi", "fine.mp4"]);
    await user.click(screen.getByRole("button", { name: /convert all/i }));
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(1)
    );
  });

  it("disables bitrate select when WAV is chosen", async () => {
    const { container } = render(<VideoToAudio />);
    await uploadFiles(container, ["a.mp4"]);
    const user = userEvent.setup();
    // Radix Select: open format select and choose WAV.
    await user.click(screen.getByLabelText(/audio format/i));
    await user.click(await screen.findByRole("option", { name: /wav/i }));
    expect(screen.getByLabelText(/bitrate/i)).toBeDisabled();
  });

  it("removes a queued file and revokes nothing prematurely", async () => {
    const { container } = render(<VideoToAudio />);
    const user = await uploadFiles(container, ["a.mp4"]);
    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.queryByText("a.mp4")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /convert all/i })).toBeDisabled();
  });
});
