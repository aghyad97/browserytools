import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZeroShotClassifier from "@/components/ZeroShotClassifier";

// Mock the shared HF runner so tests don't load a real model.
// Zero-shot output: parallel labels[]/scores[] arrays.
const classifier = vi.fn().mockResolvedValue({
  sequence: "",
  labels: ["billing", "feedback", "urgent"],
  scores: [0.7, 0.2, 0.1],
});
const getPipeline = vi.fn().mockResolvedValue(classifier);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

beforeEach(() => {
  getPipeline.mockClear();
  classifier.mockClear();
  classifier.mockResolvedValue({
    sequence: "",
    labels: ["billing", "feedback", "urgent"],
    scores: [0.7, 0.2, 0.1],
  });
});

describe("ZeroShotClassifier", () => {
  it("renders the text input and classify button", () => {
    render(<ZeroShotClassifier />);
    expect(
      screen.getByRole("textbox", { name: /text/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /classify/i })
    ).toBeInTheDocument();
  });

  it("errors when classifying empty text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<ZeroShotClassifier />);
    await user.click(screen.getByRole("button", { name: /classify/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("errors when there are no labels", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<ZeroShotClassifier />);
    await user.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Please refund my last payment"
    );
    await user.click(screen.getByRole("button", { name: /classify/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("classifies text with custom labels and renders ranked results sorted by score", async () => {
    const user = userEvent.setup();
    render(<ZeroShotClassifier />);

    await user.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Please refund my last payment"
    );
    // Add labels via the labels input (Enter commits a chip).
    const labelsInput = screen.getByRole("textbox", {
      name: /candidate labels/i,
    });
    await user.type(labelsInput, "urgent{Enter}");
    await user.type(labelsInput, "billing{Enter}");
    await user.type(labelsInput, "feedback{Enter}");

    await user.click(screen.getByRole("button", { name: /classify/i }));

    await waitFor(() =>
      expect(screen.getByTestId("zsc-results")).toBeInTheDocument()
    );

    // Correct task + model + wasm device passed.
    expect(getPipeline).toHaveBeenCalledWith(
      "zero-shot-classification",
      expect.any(String),
      expect.objectContaining({ device: "wasm" })
    );
    // Classifier receives the text and the candidate labels.
    expect(classifier).toHaveBeenCalledWith(
      "Please refund my last payment",
      expect.arrayContaining(["urgent", "billing", "feedback"]),
      expect.objectContaining({ multi_label: false })
    );

    // Results render sorted by score descending: billing (0.7), feedback (0.2), urgent (0.1).
    const results = screen.getByTestId("zsc-results");
    expect(within(results).getByText("billing")).toBeInTheDocument();
    expect(within(results).getByText("70.0%")).toBeInTheDocument();

    const text = results.textContent ?? "";
    expect(text.indexOf("billing")).toBeLessThan(text.indexOf("feedback"));
    expect(text.indexOf("feedback")).toBeLessThan(text.indexOf("urgent"));
  });

  it("passes multi_label=true when the toggle is enabled", async () => {
    const user = userEvent.setup();
    render(<ZeroShotClassifier />);

    await user.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Great product but the invoice was wrong"
    );
    const labelsInput = screen.getByRole("textbox", {
      name: /candidate labels/i,
    });
    await user.type(labelsInput, "billing, feedback{Enter}");

    await user.click(screen.getByLabelText(/multi-label/i));
    await user.click(screen.getByRole("button", { name: /classify/i }));

    await waitFor(() => expect(classifier).toHaveBeenCalled());
    expect(classifier).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["billing", "feedback"]),
      expect.objectContaining({ multi_label: true })
    );
  });
});
