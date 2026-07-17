import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCTA } from "@/components/blog/ToolCTA";

// Blog posts today link their matching tool only as plain inline text — this
// component gives them a prominent, reusable CTA. The one hard rule: an
// unknown/mistyped slug must render nothing rather than crash the post.
// Name/description resolve through the global next-intl mock in
// test-setup.ts, which loads real messages/en.json — so these assertions
// double as a check that the "keep-awake" ToolsConfig.tools key still exists.

describe("ToolCTA", () => {
  it("renders a link to the tool with its localized name", () => {
    render(<ToolCTA slug="keep-awake" />);
    const link = screen.getByTestId("tool-cta");
    expect(link).toHaveAttribute("href", "/tools/keep-awake");
    expect(link).toHaveTextContent("Keep Awake");
  });

  it("renders the localized description and open-tool affordance", () => {
    render(<ToolCTA slug="keep-awake" />);
    const link = screen.getByTestId("tool-cta");
    expect(link).toHaveTextContent(/Prevent your laptop or phone from sleeping/);
    expect(link).toHaveTextContent(/Open the tool/);
  });

  it("renders nothing for an unknown slug", () => {
    const { container } = render(<ToolCTA slug="does-not-exist" />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("tool-cta")).not.toBeInTheDocument();
  });

  it("defaults to the card variant", () => {
    render(<ToolCTA slug="keep-awake" />);
    expect(screen.getByTestId("tool-cta")).toHaveAttribute("data-variant", "card");
  });

  it("renders the slimmer inline variant when requested", () => {
    render(<ToolCTA slug="keep-awake" variant="inline" />);
    expect(screen.getByTestId("tool-cta")).toHaveAttribute("data-variant", "inline");
  });
});
