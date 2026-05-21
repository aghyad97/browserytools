import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoEditor from "@/components/VideoEditor";

// ── Mock the GIF encoder ──────────────────────────────────────────────────────
// gif.js needs a real web worker which isn't available in happy-dom. Mock the
// class so the convert-to-GIF flow is exercised without encoding. render()
// drives the progress + finished callbacks synchronously.
const gifAddFrame = vi.fn();
const gifRender = vi.fn();
const gifAbort = vi.fn();
const gifHandlers: Record<string, ((arg?: unknown) => void)[]> = {};

vi.mock("gif.js", () => {
  class MockGIF {
    constructor() {
      gifHandlers.progress = [];
      gifHandlers.finished = [];
      gifHandlers.abort = [];
    }
    addFrame(...args: unknown[]) {
      gifAddFrame(...args);
    }
    on(event: string, handler: (arg?: unknown) => void) {
      (gifHandlers[event] ??= []).push(handler);
    }
    render() {
      gifRender();
      // Simulate async encoding completing on the next tick.
      setTimeout(() => {
        gifHandlers.progress?.forEach((h) => h(1));
        gifHandlers.finished?.forEach((h) =>
          h(new Blob(["GIF89a"], { type: "image/gif" }))
        );
      }, 0);
    }
    abort() {
      gifAbort();
      gifHandlers.abort?.forEach((h) => h());
    }
  }
  return { default: MockGIF };
});

// ── Mock the offscreen <video> created via document.createElement ─────────────
// happy-dom never fires loadedmetadata/seeked, so patch createElement to return
// a video stub that resolves those events and exposes dimensions/duration.
const realCreateElement = document.createElement.bind(document);
beforeEach(() => {
  gifAddFrame.mockClear();
  gifRender.mockClear();
  gifAbort.mockClear();

  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    const el = realCreateElement(tag);
    if (tag === "video") {
      let ct = 0;
      Object.defineProperty(el, "duration", {
        configurable: true,
        get: () => 4,
      });
      Object.defineProperty(el, "videoWidth", {
        configurable: true,
        get: () => 640,
      });
      Object.defineProperty(el, "videoHeight", {
        configurable: true,
        get: () => 360,
      });
      Object.defineProperty(el, "currentTime", {
        configurable: true,
        get: () => ct,
        set: (v: number) => {
          ct = v;
          setTimeout(() => {
            (el as HTMLVideoElement).onseeked?.(new Event("seeked"));
          }, 0);
        },
      });
      Object.defineProperty(el, "src", {
        configurable: true,
        set: () => {
          setTimeout(() => {
            (el as HTMLVideoElement).onloadedmetadata?.(new Event("loaded"));
          }, 0);
        },
        get: () => "blob:mock-url",
      });
    }
    return el;
  });
});

async function loadVideo() {
  const user = userEvent.setup();
  const { container } = render(<VideoEditor />);
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["data"], "clip.mp4", { type: "video/mp4" });
  await user.upload(input, file);
  // Wait until the editor view (with the GIF tab) renders.
  await screen.findByRole("tab", { name: /convert to gif/i });
  return user;
}

describe("VideoEditor — Convert to GIF", () => {
  it("renders the upload prompt initially", () => {
    render(<VideoEditor />);
    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument();
  });

  it("shows GIF controls after loading a video and switching to the GIF tab", async () => {
    const user = await loadVideo();
    await user.click(screen.getByRole("tab", { name: /convert to gif/i }));
    expect(
      screen.getByRole("button", { name: /convert to gif/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/output width/i)).toBeInTheDocument();
  });

  it("encodes a GIF, previews it, and enables download", async () => {
    const user = await loadVideo();
    await user.click(screen.getByRole("tab", { name: /convert to gif/i }));

    const convertBtn = screen.getByRole("button", {
      name: /convert to gif/i,
    });
    fireEvent.click(convertBtn);

    // Encoder is driven: frames added + render() called.
    await waitFor(() => expect(gifRender).toHaveBeenCalled());
    expect(gifAddFrame).toHaveBeenCalled();

    // Preview image appears and download button shows.
    const preview = await screen.findByAltText(/converted gif preview/i);
    expect(preview).toBeInTheDocument();

    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(URL.createObjectURL).toHaveBeenCalled();

    expect(
      screen.getByRole("button", { name: /download gif/i })
    ).toBeInTheDocument();
  });
});
