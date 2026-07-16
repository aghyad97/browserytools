import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileText } from "lucide-react";
import { ToolTile } from "@/components/shared/ToolTile";
import { isToolNew } from "@/lib/tools-config";

// The "NEW" pill was regressed to nothing when the redesign replaced ToolCard
// with ToolTile (which had no badge). These lock in that a tile gated new via
// isToolNew renders the pill (real English "New" from Common) and an old one
// does not. Label resolves through the global next-intl mock in test-setup.ts.

const base = {
  href: "/tools/example",
  slug: "example",
  icon: FileText,
  name: "Example Tool",
  catLabel: "IMAGE",
};

describe("ToolTile NEW badge", () => {
  it("renders the NEW pill when isNew is true", () => {
    render(<ToolTile {...base} isNew />);
    const badge = screen.getByTestId("tool-tile-new");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("New");
  });

  it("does not render the pill when isNew is false or omitted", () => {
    const { rerender } = render(<ToolTile {...base} isNew={false} />);
    expect(screen.queryByTestId("tool-tile-new")).not.toBeInTheDocument();
    rerender(<ToolTile {...base} />);
    expect(screen.queryByTestId("tool-tile-new")).not.toBeInTheDocument();
  });

  it("shows the pill for a tool created today and hides it for an old one", () => {
    const today = new Date().toISOString().slice(0, 10);
    render(<ToolTile {...base} isNew={isToolNew(today)} />);
    expect(screen.getByTestId("tool-tile-new")).toBeInTheDocument();

    render(<ToolTile {...base} slug="old" href="/tools/old" isNew={isToolNew("2020-01-01")} />);
    expect(screen.queryAllByTestId("tool-tile-new")).toHaveLength(1);
  });
});
