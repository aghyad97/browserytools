import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MetaTagsGenerator from "@/components/MetaTagsGenerator";

// happy-dom does not fire <img> load events. Stub naturalWidth/Height to the
// given dimensions, then dispatch a load event manually on the preview <img>.
function stubImageDims(w: number, h: number) {
  Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
    configurable: true,
    get() {
      return w;
    },
  });
  Object.defineProperty(HTMLImageElement.prototype, "naturalHeight", {
    configurable: true,
    get() {
      return h;
    },
  });
}

function fireImageLoad() {
  act(() => {
    document.querySelectorAll("img").forEach((img) => fireEvent.load(img));
  });
}

describe("MetaTagsGenerator", () => {
  it("renders inputs and shows missing-field warnings on an empty form", () => {
    render(<MetaTagsGenerator />);
    expect(screen.getByLabelText(/page title/i)).toBeInTheDocument();
    // All required tags missing -> several warnings shown.
    const warnings = screen.getAllByTestId("meta-warning");
    expect(warnings.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/missing title/i)).toBeInTheDocument();
  });

  it("updates the Google preview as the user types title and description", async () => {
    const user = userEvent.setup();
    render(<MetaTagsGenerator />);

    await user.type(screen.getByLabelText(/page title/i), "Hello World");
    await user.type(screen.getByLabelText(/^description$/i), "A great page");

    const google = screen.getByTestId("preview-google");
    expect(within(google).getByText("Hello World")).toBeInTheDocument();
    expect(within(google).getByText("A great page")).toBeInTheDocument();
  });

  it("generates og: and twitter: meta tags in the HTML output", async () => {
    const user = userEvent.setup();
    render(<MetaTagsGenerator />);

    await user.type(screen.getByLabelText(/page title/i), "My Title");
    await user.type(screen.getByLabelText(/og image url/i), "https://x.com/og.png");

    // Open Graph tab.
    await user.click(screen.getByRole("tab", { name: /open graph/i }));
    expect(screen.getByText(/og:title.*content="My Title"/)).toBeInTheDocument();
    expect(screen.getByText(/og:image.*https:\/\/x\.com\/og\.png/)).toBeInTheDocument();

    // Twitter tab.
    await user.click(screen.getByRole("tab", { name: /twitter card/i }));
    expect(screen.getByText(/twitter:card.*summary_large_image/)).toBeInTheDocument();
    expect(screen.getByText(/twitter:image/)).toBeInTheDocument();
  });

  it("parses pasted HTML head meta tags into the fields", async () => {
    const user = userEvent.setup();
    render(<MetaTagsGenerator />);

    const html = [
      '<meta property="og:title" content="Parsed Title">',
      '<meta name="description" content="Parsed description">',
      '<meta property="og:image" content="https://e.com/img.png">',
      '<meta property="og:url" content="https://e.com/page">',
    ].join("\n");

    await user.type(screen.getByLabelText(/paste existing/i), html);
    await user.click(screen.getByRole("button", { name: /parse & fill/i }));

    expect(screen.getByLabelText(/page title/i)).toHaveValue("Parsed Title");
    expect(screen.getByLabelText(/^description$/i)).toHaveValue("Parsed description");
    expect(screen.getByLabelText(/og image url/i)).toHaveValue("https://e.com/img.png");
    expect(screen.getByLabelText(/page url/i)).toHaveValue("https://e.com/page");
  });

  it("warns when the title exceeds the recommended length", async () => {
    const user = userEvent.setup();
    render(<MetaTagsGenerator />);

    const longTitle = "x".repeat(80);
    await user.type(screen.getByLabelText(/page title/i), longTitle);

    expect(screen.getByText(/keep it under 60/i)).toBeInTheDocument();
  });

  it("warns when the OG image is smaller than recommended dimensions", async () => {
    stubImageDims(400, 200);
    const user = userEvent.setup();
    render(<MetaTagsGenerator />);
    await user.type(screen.getByLabelText(/og image url/i), "https://e.com/small.png");
    // The preview <img> mounts on a tab that shows an image (Facebook).
    await user.click(screen.getByRole("tab", { name: /facebook/i }));
    fireImageLoad();

    expect(await screen.findByText(/recommended at least 1200×630/i)).toBeInTheDocument();
  });
});
