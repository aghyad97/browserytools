import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PiiRedactor from "@/components/PiiRedactor";

// Mock the shared HF runner so tests don't load a real model.
// The fake NER returns aggregated entities like the real pipeline:
// [{ entity_group, word, start, end }]. The component slices the original
// text by start/end, so the start/end must match the input string below.
const ner = vi.fn();
const getPipeline = vi.fn().mockResolvedValue((...args: unknown[]) =>
  ner(...args)
);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

// Sample text. Indices of "John Smith" => start 0, end 10.
const SAMPLE =
  "John Smith emailed me from john@acme.com and called 555-123-4567.";
const PER_START = SAMPLE.indexOf("John Smith");
const PER_END = PER_START + "John Smith".length;

beforeEach(() => {
  getPipeline.mockClear();
  ner.mockReset();
  ner.mockResolvedValue([
    { entity_group: "PER", word: "John Smith", start: PER_START, end: PER_END },
  ]);
});

async function detect(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByRole("textbox", { name: /text/i }), text);
  await user.click(screen.getByRole("button", { name: /detect/i }));
}

describe("PiiRedactor", () => {
  it("renders the input and detect button", () => {
    render(<PiiRedactor />);
    expect(screen.getByRole("textbox", { name: /text/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /detect/i })
    ).toBeInTheDocument();
  });

  it("errors when detecting empty text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await user.click(screen.getByRole("button", { name: /detect/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("calls the token-classification pipeline on wasm with aggregation", async () => {
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await detect(user, SAMPLE);

    await waitFor(() =>
      expect(screen.getByTestId("pii-output")).toBeInTheDocument()
    );
    expect(getPipeline).toHaveBeenCalledWith(
      "token-classification",
      expect.any(String),
      expect.objectContaining({ device: "wasm" })
    );
    expect(ner).toHaveBeenCalledWith(
      SAMPLE,
      expect.objectContaining({ aggregation_strategy: "simple" })
    );
  });

  it("redacts NER names plus regex emails and phone numbers", async () => {
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await detect(user, SAMPLE);

    const output = (await screen.findByTestId(
      "pii-output"
    )) as HTMLTextAreaElement;
    await waitFor(() => {
      expect(output.value).toContain("[PER_REDACTED]");
    });
    // Name from NER is replaced.
    expect(output.value).not.toContain("John Smith");
    // Email caught by regex.
    expect(output.value).toContain("[EMAIL_REDACTED]");
    expect(output.value).not.toContain("john@acme.com");
    // Phone caught by regex.
    expect(output.value).toContain("[PHONE_REDACTED]");
    expect(output.value).not.toContain("555-123-4567");
  });

  it("stops redacting a category when its checkbox is unchecked", async () => {
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await detect(user, SAMPLE);

    const output = (await screen.findByTestId(
      "pii-output"
    )) as HTMLTextAreaElement;
    await waitFor(() => expect(output.value).toContain("[EMAIL_REDACTED]"));

    // Uncheck the email category — the email should reappear in the output.
    await user.click(screen.getByTestId("pii-cat-EMAIL"));
    await waitFor(() => {
      expect(output.value).toContain("john@acme.com");
      expect(output.value).not.toContain("[EMAIL_REDACTED]");
    });
  });

  it("copies the redacted text to the clipboard", async () => {
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await detect(user, SAMPLE);
    await screen.findByTestId("pii-output");

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy.mock.calls[0][0]).toContain("[PER_REDACTED]");
  });

  it("reports when no personal information is detected", async () => {
    const { toast } = await import("sonner");
    ner.mockResolvedValue([]);
    const user = userEvent.setup();
    render(<PiiRedactor />);
    await detect(user, "the quick brown fox");
    await waitFor(() => expect(toast.info).toHaveBeenCalled());
  });
});
