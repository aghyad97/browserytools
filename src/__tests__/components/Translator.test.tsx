import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Translator from "@/components/Translator";

// Mock the shared HF runner so tests don't load a real model.
const translator = vi
  .fn()
  .mockResolvedValue([{ translation_text: "مرحبا بالعالم" }]);
const getPipeline = vi.fn().mockResolvedValue(translator);
vi.mock("@/lib/hf-pipeline", () => ({
  getPipeline: (...args: unknown[]) => getPipeline(...args),
  hasWebGPU: () => false,
}));

beforeEach(() => {
  getPipeline.mockClear();
  translator.mockClear();
  translator.mockResolvedValue([{ translation_text: "مرحبا بالعالم" }]);
});

describe("Translator", () => {
  it("renders source/target selects, input, and translate button", () => {
    render(<Translator />);
    expect(screen.getByRole("combobox", { name: "From" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "To" })).toBeInTheDocument();
    expect(screen.getByTestId("translator-output")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^translate$/i })
    ).toBeInTheDocument();
  });

  it("errors when translating empty text", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();
    render(<Translator />);
    await user.click(screen.getByRole("button", { name: /translate/i }));
    expect(toast.error).toHaveBeenCalled();
    expect(getPipeline).not.toHaveBeenCalled();
  });

  it("translates text and shows the output", async () => {
    const user = userEvent.setup();
    render(<Translator />);
    const input = screen.getByLabelText(/text to translate/i);
    await user.type(input, "Hello world");
    await user.click(screen.getByRole("button", { name: /translate/i }));

    await waitFor(() =>
      expect(screen.getByTestId("translator-output")).toHaveValue(
        "مرحبا بالعالم"
      )
    );
    expect(getPipeline).toHaveBeenCalledWith(
      "translation",
      expect.any(String),
      expect.objectContaining({ device: "auto" })
    );
    expect(translator).toHaveBeenCalledWith(
      "Hello world",
      expect.objectContaining({ src_lang: "en", tgt_lang: "ar" })
    );
  });

  it("swaps source and target languages and moves text", async () => {
    const user = userEvent.setup();
    render(<Translator />);
    const input = screen.getByLabelText(/text to translate/i);

    // Type, then swap: the swap should also move the input text out.
    await user.type(input, "Hello");
    await user.click(screen.getByRole("button", { name: /swap languages/i }));
    expect(input).toHaveValue("");

    // After swap, default en->ar becomes ar->en. Type new text and translate.
    await user.type(input, "مرحبا");
    await user.click(screen.getByRole("button", { name: /^translate$/i }));
    await waitFor(() =>
      expect(translator).toHaveBeenCalledWith(
        "مرحبا",
        expect.objectContaining({ src_lang: "ar", tgt_lang: "en" })
      )
    );
  });
});
