import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextSummarizer from "@/components/TextSummarizer";

// Mock the shared HF runner so tests don't load a real model.
const summarizer = vi
  .fn()
  .mockResolvedValue([{ summary_text: "A short summary." }]);
const getPipeline = vi.fn().mockResolvedValue(summarizer);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

beforeEach(() => {
  getPipeline.mockClear();
  summarizer.mockClear();
  summarizer.mockResolvedValue([{ summary_text: "A short summary." }]);
});

describe("TextSummarizer", () => {
  it("renders the input and summarize button", () => {
    render(<TextSummarizer />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^summarize$/i })
    ).toBeInTheDocument();
  });

  it("errors when summarizing empty text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<TextSummarizer />);
    await user.click(screen.getByRole("button", { name: /^summarize$/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("summarizes text and shows the output", async () => {
    const user = userEvent.setup();
    render(<TextSummarizer />);
    await user.type(
      screen.getByRole("textbox"),
      "This is a long piece of text that needs summarizing."
    );
    await user.click(screen.getByRole("button", { name: /^summarize$/i }));

    await waitFor(() =>
      expect(screen.getByTestId("summary-result")).toBeInTheDocument()
    );
    expect(getPipeline).toHaveBeenCalledWith(
      "summarization",
      expect.any(String),
      expect.objectContaining({ device: "wasm" })
    );
    expect(screen.getByTestId("summary-result")).toHaveTextContent(
      "A short summary."
    );
  });

  it("copies the summary to the clipboard", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<TextSummarizer />);
    await user.type(screen.getByRole("textbox"), "Some long text to condense.");
    await user.click(screen.getByRole("button", { name: /^summarize$/i }));
    await waitFor(() =>
      expect(screen.getByTestId("summary-result")).toBeInTheDocument()
    );

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(spy).toHaveBeenCalledWith("A short summary.");
    expect(toast.success).toHaveBeenCalled();
  });
});
