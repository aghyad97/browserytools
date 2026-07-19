import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import WordToPdf from "@/components/WordToPdf";

// Mock the mammoth-backed parser — never run the real WASM/xmldom-backed
// pipeline in unit tests.
const docxToHtml = vi.fn();
vi.mock("@/lib/docx/parse", () => ({
  docxToHtml: (...args: unknown[]) => docxToHtml(...args),
}));

// DOMPurify's tree-walking sanitizer relies on DOM internals that happy-dom
// — this suite's test environment — does not implement closely enough to be
// trustworthy: under happy-dom it can leave a live <script> tag intact
// depending on sibling order (e.g. '<p>x</p><script>...</script>' survives
// unstripped), rather than merely over-stripping. That's a test-environment
// gap, not a bug in the component. Mocked here as an identity passthrough so
// this file only exercises UI wiring (preview rendering, warnings, print,
// file-swap races) with deterministic markup. The real sanitizing behavior —
// script/onerror/javascript: neutralization plus preservation of legitimate
// document markup — is covered against the real DOMPurify library under
// jsdom in src/__tests__/lib/sanitize-html.test.ts.
vi.mock("dompurify", () => ({
  default: { sanitize: (html: string) => html },
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

function makeFile(name = "report.docx") {
  return new File(["fake-docx-bytes"], name, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

const SAMPLE_RESULT = {
  html: "<h1>Report Title</h1><p>Hello world</p>",
  messages: [],
};

beforeEach(() => {
  docxToHtml.mockReset();
  vi.mocked(toast.error).mockReset();
  vi.mocked(toast.success).mockReset();
  docxToHtml.mockResolvedValue(SAMPLE_RESULT);
});

afterEach(() => {
  document.body.classList.remove("bt-print-word-doc");
  vi.restoreAllMocks();
});

describe("WordToPdf", () => {
  it("renders the dropzone and a disabled print action", () => {
    render(<WordToPdf />);
    expect(screen.getByTestId("word-to-pdf-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /print.*save as pdf/i }),
    ).toBeDisabled();
  });

  it("calls docxToHtml when a .docx is dropped", async () => {
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    const file = makeFile();
    await user.upload(input, file);

    await waitFor(() => expect(docxToHtml).toHaveBeenCalledTimes(1));
    expect(docxToHtml).toHaveBeenCalledWith(file);
  });

  it("renders the returned HTML in the preview container", async () => {
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const preview = await screen.findByTestId("word-to-pdf-preview");
    expect(preview).toHaveTextContent("Report Title");
    expect(preview).toHaveTextContent("Hello world");
    expect(preview.querySelector("h1")).not.toBeNull();
  });

  it("pins the preview container to an explicit direction, independent of UI locale", async () => {
    // Regression: the preview used to inherit the app's `dir`, so an LTR
    // .docx rendered right-to-left under the Arabic UI — and window.print()
    // then produced a PDF that misrepresented the source document. The
    // container must carry the CONVERTED DOCUMENT's direction explicitly.
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const preview = await screen.findByTestId("word-to-pdf-preview");
    expect(preview.getAttribute("dir")).toBe("ltr");
  });

  it("shows mammoth's messages as a conversion-warnings list when non-empty", async () => {
    docxToHtml.mockResolvedValue({
      html: "<p>Body text</p>",
      messages: [
        "An image was ignored because it could not be resolved",
        "A style was not mapped",
      ],
    });
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const warnings = await screen.findByTestId("word-to-pdf-warnings");
    expect(warnings).toHaveTextContent("An image was ignored because it could not be resolved");
    expect(warnings).toHaveTextContent("A style was not mapped");
  });

  it("does not render a warnings panel when messages is empty", async () => {
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    await screen.findByTestId("word-to-pdf-preview");
    expect(screen.queryByTestId("word-to-pdf-warnings")).not.toBeInTheDocument();
  });

  it("clicking the print action calls window.print()", async () => {
    // happy-dom doesn't implement window.print, so it must be stubbed
    // (rather than spied on) before it can be asserted against.
    const printSpy = vi.fn();
    window.print = printSpy;
    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    const printBtn = await screen.findByRole("button", { name: /print.*save as pdf/i });
    await waitFor(() => expect(printBtn).not.toBeDisabled());
    await user.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(document.body.classList.contains("bt-print-word-doc")).toBe(true);

    window.dispatchEvent(new Event("afterprint"));
    expect(document.body.classList.contains("bt-print-word-doc")).toBe(false);
  });

  it("resets prior results when the file is changed (no stale preview)", async () => {
    let resolveSecond: (value: typeof SAMPLE_RESULT) => void = () => {};
    docxToHtml
      .mockResolvedValueOnce(SAMPLE_RESULT)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );

    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile("first.docx"));

    await screen.findByTestId("word-to-pdf-preview");

    const changeInput = screen.getByTestId(
      "word-to-pdf-change-input",
    ) as HTMLInputElement;
    await user.upload(changeInput, makeFile("second.docx"));

    // The old preview must disappear immediately, before the second parse
    // resolves — it must not linger as stale state.
    await waitFor(() =>
      expect(screen.queryByTestId("word-to-pdf-preview")).not.toBeInTheDocument(),
    );

    resolveSecond({ html: "<p>only the second file</p>", messages: [] });

    const preview = await screen.findByTestId("word-to-pdf-preview");
    expect(preview).toHaveTextContent("only the second file");
  });

  it("recovers to a usable state when docxToHtml rejects (toast + can pick another file)", async () => {
    docxToHtml.mockReset();
    docxToHtml.mockRejectedValueOnce(new Error("boom"));

    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile("bad.docx"));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));

    // Not stuck mid-parse: the parsing indicator is gone and the file info
    // (with its enabled "Change" control) is showing.
    expect(screen.queryByTestId("word-to-pdf-parsing")).not.toBeInTheDocument();
    const changeBtn = screen.getByRole("button", { name: /change/i });
    expect(changeBtn).not.toBeDisabled();

    // The user can pick another file and it goes through normally.
    docxToHtml.mockResolvedValueOnce(SAMPLE_RESULT);
    const changeInput = screen.getByTestId(
      "word-to-pdf-change-input",
    ) as HTMLInputElement;
    await user.upload(changeInput, makeFile("good.docx"));

    const preview = await screen.findByTestId("word-to-pdf-preview");
    expect(preview).toHaveTextContent("Report Title");
  });

  it("disables the Change button while a parse is in flight, to prevent a file-swap race", async () => {
    let resolveParse: (value: typeof SAMPLE_RESULT) => void = () => {};
    docxToHtml.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveParse = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<WordToPdf />);

    const input = screen.getByTestId("word-to-pdf-input") as HTMLInputElement;
    await user.upload(input, makeFile());

    // While docxToHtml is still in flight, the Change control (rendered once
    // the file-info bar appears) must be disabled — otherwise the user can
    // swap in a new file whose parse clears state out from under the
    // in-flight one, and a stale result could render under the new file's UI.
    const changeBtn = await screen.findByRole("button", { name: /change/i });
    expect(changeBtn).toBeDisabled();

    resolveParse(SAMPLE_RESULT);
    await waitFor(() => expect(changeBtn).not.toBeDisabled());
  });
});
