import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SentimentAnalyzer from "@/components/SentimentAnalyzer";

// Mock the shared HF runner so tests don't load a real model.
const classifier = vi
  .fn()
  .mockResolvedValue([{ label: "POSITIVE", score: 0.99 }]);
const getPipeline = vi.fn().mockResolvedValue(classifier);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

beforeEach(() => {
  getPipeline.mockClear();
  classifier.mockClear();
  classifier.mockResolvedValue([{ label: "POSITIVE", score: 0.99 }]);
});

describe("SentimentAnalyzer", () => {
  it("renders the input and analyze button", () => {
    render(<SentimentAnalyzer />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /analyze/i })
    ).toBeInTheDocument();
  });

  it("errors when analyzing empty text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<SentimentAnalyzer />);
    await user.click(screen.getByRole("button", { name: /analyze/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("classifies text and shows a positive result", async () => {
    const user = userEvent.setup();
    render(<SentimentAnalyzer />);
    await user.type(screen.getByRole("textbox"), "I love this!");
    await user.click(screen.getByRole("button", { name: /analyze/i }));

    await waitFor(() =>
      expect(screen.getByTestId("sentiment-result")).toBeInTheDocument()
    );
    expect(getPipeline).toHaveBeenCalledWith(
      "text-classification",
      expect.any(String),
      expect.objectContaining({ device: "wasm" })
    );
    expect(classifier).toHaveBeenCalledWith("I love this!");
  });

  it("shows a negative result", async () => {
    classifier.mockResolvedValue([{ label: "NEGATIVE", score: 0.95 }]);
    const user = userEvent.setup();
    render(<SentimentAnalyzer />);
    await user.type(screen.getByRole("textbox"), "This is terrible");
    await user.click(screen.getByRole("button", { name: /analyze/i }));
    await waitFor(() =>
      expect(screen.getByTestId("sentiment-result")).toHaveTextContent(
        /negative/i
      )
    );
  });
});
