import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ToolShell } from "@/components/template/tool-shell";

// ToolShell resolves category / crumb / related from tools-config and the
// Template + ToolsConfig i18n namespaces (real English messages via the global
// next-intl mock in src/test-setup.ts). image-compression lives in the
// imageTools category (short label "Image", 24 sibling tools).

describe("ToolShell", () => {
  it("renders the crumb: colored category short-label + tool name", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images. Right here.">
        <div>stage</div>
      </ToolShell>,
    );

    // Category short label resolved from ToolsConfig.categoriesShort.
    const cat = screen.getByTestId("tool-shell-crumb-cat");
    expect(cat).toHaveTextContent("Image");
    // Painted with the category foreground token (spec §3: crumb category name
    // in var(--bt-cat-<x>-fg)).
    expect(cat.getAttribute("style") ?? "").toContain("--bt-cat-image-fg");

    // Tool name (resolved from ToolsConfig.tools.<slug>.name) sits in the crumb.
    const crumb = within(screen.getByTestId("tool-shell-crumb"));
    expect(crumb.getByText("Image Compression")).toBeInTheDocument();
  });

  it("renders exactly one h1 (the title) — the smoke gate's invariant", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images. Right here.">
        <div>stage</div>
      </ToolShell>,
    );
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Compress images. Right here.");
  });

  it("appends the on-device promise to the sub", () => {
    render(
      <ToolShell
        slug="image-compression"
        title="Compress images."
        sub="Drop an image and drag the divider to compare."
      >
        <div>stage</div>
      </ToolShell>,
    );
    // Author sub + appended Template.onDevicePromise, in one line.
    expect(
      screen.getByText(
        /Drop an image and drag the divider to compare\..*nothing is uploaded, nothing is stored\./,
      ),
    ).toBeInTheDocument();
  });

  it("renders the on-device promise even with no author sub", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images.">
        <div>stage</div>
      </ToolShell>,
    );
    expect(
      screen.getByText(/nothing is uploaded, nothing is stored\./),
    ).toBeInTheDocument();
  });

  it("renders the stage children", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images.">
        <div data-testid="my-stage">the surface</div>
      </ToolShell>,
    );
    expect(screen.getByTestId("my-stage")).toHaveTextContent("the surface");
  });

  it("renders 3 same-category related tiles, excluding the current tool", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images.">
        <div>stage</div>
      </ToolShell>,
    );
    const tiles = screen.getAllByTestId("tool-shell-related-tile");
    expect(tiles).toHaveLength(3);
    // None of them is the current tool.
    for (const tile of tiles) {
      expect(tile).not.toHaveTextContent("Image Compression");
      // Every related tile is a link into the same category's tool space.
      expect(tile.getAttribute("href") ?? "").toMatch(/^\/tools\//);
    }
    // The Related section label resolves from the Template namespace.
    expect(screen.getByText("Related")).toBeInTheDocument();
  });

  it("renders the controls bar with children and the end-aligned dark primary", async () => {
    const onClick = vi.fn();
    render(
      <ToolShell
        slug="image-compression"
        title="Compress images."
        controls={<span data-testid="ctrl">quality</span>}
        primaryAction={{ label: "Download", onClick }}
      >
        <div>stage</div>
      </ToolShell>,
    );
    expect(screen.getByTestId("ctrl")).toBeInTheDocument();
    const primary = screen.getByTestId("tool-shell-primary");
    expect(primary).toHaveTextContent("Download");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(primary);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the primary action when requested", () => {
    render(
      <ToolShell
        slug="image-compression"
        title="Compress images."
        primaryAction={{ label: "Download", onClick: () => {}, disabled: true }}
      >
        <div>stage</div>
      </ToolShell>,
    );
    expect(screen.getByTestId("tool-shell-primary")).toBeDisabled();
  });

  it("omits the controls bar entirely when there are no controls or action", () => {
    render(
      <ToolShell slug="image-compression" title="Compress images.">
        <div>stage</div>
      </ToolShell>,
    );
    expect(screen.queryByTestId("tool-shell-controls")).toBeNull();
  });

  it("keeps related tiles within the same category (data tools example)", () => {
    render(
      <ToolShell slug="json-formatter" title="Format JSON.">
        <div>stage</div>
      </ToolShell>,
    );
    const related = within(screen.getByTestId("tool-shell-related"));
    const tiles = related.getAllByTestId("tool-shell-related-tile");
    expect(tiles).toHaveLength(3);
  });
});
