import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoConverter from "@/components/VideoConverter";
import { __resetForTests } from "@/lib/media/ffmpeg";

// Canonical ffmpeg mock (CompressVideo / VideoToAudio pattern), extended with
// the "log" channel the converter reads duration + progress from, and
// terminate() for the cancel path.
let progressHandler: ((e: { progress: number; time: number }) => void) | null = null;
let logHandler: ((e: { type: string; message: string }) => void) | null = null;

const load = vi.fn().mockResolvedValue(undefined);
const writeFile = vi.fn().mockResolvedValue(undefined);
const readFile = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
const deleteFile = vi.fn().mockResolvedValue(undefined);
const terminate = vi.fn();

function emitHappyRun() {
  logHandler?.({ type: "stderr", message: "  Duration: 00:01:40.00, start: 0.000000, bitrate: 1 kb/s" });
  logHandler?.({ type: "stderr", message: "frame=  100 fps=25 q=28.0 size=1kB time=00:00:50.00 bitrate=1kbits/s speed=1x" });
  progressHandler?.({ progress: 0.5, time: 50_000_000 });
}

const exec = vi.fn().mockImplementation(async () => {
  emitHappyRun();
  return 0;
});

vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: class {
    on(event: string, cb: unknown) {
      if (event === "progress") progressHandler = cb as typeof progressHandler;
      if (event === "log") logHandler = cb as typeof logHandler;
    }
    off(event: string) {
      if (event === "progress") progressHandler = null;
      if (event === "log") logHandler = null;
    }
    load = load;
    writeFile = writeFile;
    exec = exec;
    readFile = readFile;
    deleteFile = deleteFile;
    terminate = terminate;
  },
}));
vi.mock("@ffmpeg/util", () => ({
  toBlobURL: vi.fn().mockResolvedValue("blob:mock-core"),
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([0])),
}));

beforeEach(() => {
  __resetForTests();
  progressHandler = null;
  logHandler = null;
  [load, writeFile, exec, readFile, deleteFile, terminate].forEach((f) => f.mockClear());
  exec.mockImplementation(async () => {
    emitHappyRun();
    return 0;
  });
});

async function uploadVideo(container: HTMLElement, name = "clip.mov") {
  const user = userEvent.setup();
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  await user.upload(input, new File(["x".repeat(1000)], name, { type: "video/quicktime" }));
  await screen.findByText(name);
  return user;
}

const convertButton = () => screen.getByTestId("tool-shell-primary");

describe("VideoConverter", () => {
  it("renders the dropzone and a disabled Convert until a file is chosen", () => {
    render(<VideoConverter />);
    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument();
    expect(convertButton()).toHaveTextContent(/convert/i);
    expect(convertButton()).toBeDisabled();
  });

  it("converts to MP4 by default with x264 + aac and offers a download", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    expect(convertButton()).toBeEnabled();
    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(1));

    const args = exec.mock.calls[0][0] as string[];
    expect(args).toContain("libx264");
    expect(args).toContain("aac");
    expect(args[args.length - 1]).toBe("output.mp4");
    expect(writeFile).toHaveBeenCalledWith("input.mov", expect.anything());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /download/i })).toBeEnabled()
    );
    // Both scratch files are removed from the ffmpeg FS afterwards.
    expect(deleteFile).toHaveBeenCalledWith("input.mov");
    expect(deleteFile).toHaveBeenCalledWith("output.mp4");
    // Converted-size stats appear.
    expect(screen.getByText(/converted size/i)).toBeInTheDocument();
  });

  it("passes the chosen format, resolution and audio mode to ffmpeg", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);

    await user.click(screen.getByLabelText(/output format/i));
    await user.click(await screen.findByRole("option", { name: /webm/i }));
    await user.click(screen.getByLabelText(/resolution/i));
    await user.click(await screen.findByRole("option", { name: "720p" }));
    await user.click(screen.getByLabelText(/^audio$/i));
    await user.click(await screen.findByRole("option", { name: /remove audio/i }));

    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args).toContain("libvpx-vp9");
    expect(args[args.indexOf("-vf") + 1]).toBe("scale=-2:720");
    expect(args).toContain("-an");
    expect(args[args.length - 1]).toBe("output.webm");
  });

  it("disables the audio control for GIF and produces a silent palette pipeline", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.click(screen.getByLabelText(/output format/i));
    await user.click(await screen.findByRole("option", { name: /gif/i }));
    expect(screen.getByLabelText(/^audio$/i)).toBeDisabled();
    expect(screen.getByText(/gif has no audio track/i)).toBeInTheDocument();

    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args[args.indexOf("-vf") + 1]).toContain("palettegen");
    expect(args).toContain("-an");
  });

  it("applies trim as an input seek and output duration", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.type(screen.getByLabelText(/trim start/i), "0:10");
    await user.type(screen.getByLabelText(/trim end/i), "1:00");
    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalled());
    const args = exec.mock.calls[0][0] as string[];
    expect(args.indexOf("-ss")).toBeLessThan(args.indexOf("-i"));
    expect(args[args.indexOf("-ss") + 1]).toBe("10");
    expect(args[args.indexOf("-t") + 1]).toBe("50");
  });

  it("rejects an inverted trim range without booting ffmpeg", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.type(screen.getByLabelText(/trim start/i), "2:00");
    await user.type(screen.getByLabelText(/trim end/i), "1:00");
    await user.click(convertButton());
    expect(await screen.findByText(/invalid trim/i)).toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
  });

  it("shows live progress (percent, speed, ETA) while converting", async () => {
    let finish: () => void = () => {};
    exec.mockImplementationOnce(
      () =>
        new Promise<number>((resolve) => {
          emitHappyRun();
          finish = () => resolve(0);
        })
    );
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.click(convertButton());

    const panel = await screen.findByTestId("vc-progress");
    // 50s of a 100s source encoded → 50%.
    await waitFor(() => expect(panel).toHaveTextContent("50%"));
    expect(panel).toHaveTextContent(/speed/i);
    expect(panel).toHaveTextContent(/time left/i);
    expect(convertButton()).toHaveTextContent(/cancel/i);

    finish();
    await waitFor(() => expect(screen.queryByTestId("vc-progress")).not.toBeInTheDocument());
    expect(convertButton()).toHaveTextContent(/convert/i);
  });

  it("cancels an in-flight conversion by terminating the worker", async () => {
    let reject: (e: Error) => void = () => {};
    exec.mockImplementationOnce(
      () =>
        new Promise<number>((_, rej) => {
          reject = rej;
        })
    );
    // Simulate ffmpeg.wasm: terminate() rejects the pending exec.
    terminate.mockImplementationOnce(() => reject(new Error("called FFmpeg.terminate()")));

    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.click(convertButton());
    await waitFor(() => expect(convertButton()).toHaveTextContent(/cancel/i));

    await user.click(convertButton());
    await waitFor(() => expect(terminate).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(convertButton()).toHaveTextContent(/convert/i));
    expect(convertButton()).toBeEnabled();
    // No result from a cancelled run.
    expect(screen.getByRole("button", { name: /download/i })).toBeDisabled();
    // Worker is gone — no FS cleanup calls were attempted.
    expect(deleteFile).not.toHaveBeenCalled();

    // A fresh engine boots on the next run (cache was dropped).
    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalledTimes(2));
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("surfaces a failure when ffmpeg exits non-zero", async () => {
    exec.mockImplementationOnce(async () => 1);
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.click(convertButton());
    await waitFor(() => expect(exec).toHaveBeenCalled());
    await waitFor(() => expect(convertButton()).toHaveTextContent(/convert/i));
    expect(screen.getByRole("button", { name: /download/i })).toBeDisabled();
  });

  it("swapping the file clears a previous result", async () => {
    const { container } = render(<VideoConverter />);
    const user = await uploadVideo(container);
    await user.click(convertButton());
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /download/i })).toBeEnabled()
    );
    await user.click(screen.getByRole("button", { name: /change/i }));
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(["y".repeat(10)], "other.mkv", { type: "" }));
    await screen.findByText("other.mkv");
    expect(screen.getByRole("button", { name: /download/i })).toBeDisabled();
  });
});
