import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageToText from "@/components/ImageToText";

// Mock tesseract.js — never run real OCR (it would download WASM + traineddata).
// createWorker returns a worker whose recognize() resolves to a fixed string and
// whose terminate() is a no-op.
const recognize = vi.fn().mockResolvedValue({
  data: { text: "Hello from the image" },
});
const terminate = vi.fn().mockResolvedValue(undefined);
const createWorker = vi.fn().mockResolvedValue({ recognize, terminate });

vi.mock("tesseract.js", () => ({
  createWorker: (...args: unknown[]) => createWorker(...args),
}));

beforeEach(() => {
  createWorker.mockClear();
  recognize.mockClear();
  recognize.mockResolvedValue({ data: { text: "Hello from the image" } });
  terminate.mockClear();
});

async function uploadImage() {
  const user = userEvent.setup();
  const input = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const file = new File(["imgdata"], "scan.png", { type: "image/png" });
  await user.upload(input, file);
  return user;
}

describe("ImageToText", () => {
  it("renders the upload prompt, language selector, and privacy note", () => {
    render(<ImageToText />);
    expect(screen.getByText(/drop your image here/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByText(/runs entirely on your device/i)
    ).toBeInTheDocument();
  });

  it("uploads an image, runs OCR, and shows the recognized text", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(createWorker).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(recognize).toHaveBeenCalledTimes(1));

    // The recognized text lands in the editable output textarea.
    const output = (await screen.findByLabelText(
      /recognized text/i
    )) as HTMLTextAreaElement;
    await waitFor(() =>
      expect(output.value).toBe("Hello from the image")
    );

    const { toast } = await import("sonner");
    expect(toast.success).toHaveBeenCalled();
    expect(terminate).toHaveBeenCalled();
  });

  it("copies the recognized text to the clipboard", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));
    await waitFor(() => expect(recognize).toHaveBeenCalled());
    await screen.findByDisplayValue("Hello from the image");

    const spy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    await user.click(screen.getByRole("button", { name: /^copy$/i }));

    expect(spy).toHaveBeenCalledWith("Hello from the image");
  });

  it("uses the selected language when creating the worker", async () => {
    render(<ImageToText />);
    const user = await uploadImage();

    await user.click(screen.getByRole("button", { name: /extract text/i }));

    await waitFor(() => expect(createWorker).toHaveBeenCalled());
    // First positional arg to createWorker is the language code.
    expect(createWorker.mock.calls[0][0]).toBe("eng");
  });
});
