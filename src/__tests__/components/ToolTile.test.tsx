import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { FileText } from "lucide-react";
import { ToolTile } from "@/components/shared/ToolTile";

// The per-tool NEW badge was regressed to nothing when the redesign replaced
// ToolCard (which owned the badge) with ToolTile (which had none). These lock
// in the restored pill: driven by creationDate through isToolNew, and — the
// subtle part — kept out of the server HTML so a stale prerender can't ship a
// badge that hydration then rips away.
// Label resolves through the global next-intl mock in test-setup.ts.

const base = {
  href: "/tools/example",
  slug: "example",
  icon: FileText,
  name: "Example Tool",
  catLabel: "IMAGE",
};

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

describe("ToolTile NEW badge", () => {
  it("badges a tool created today", () => {
    render(<ToolTile {...base} creationDate={daysAgo(0)} />);
    expect(screen.getByTestId("tool-tile-new")).toHaveTextContent("New");
  });

  it("does not badge a tool well outside the isToolNew window", () => {
    render(<ToolTile {...base} creationDate={daysAgo(60)} />);
    expect(screen.queryByTestId("tool-tile-new")).not.toBeInTheDocument();
  });

  it("does not badge a tile given no creationDate", () => {
    render(<ToolTile {...base} />);
    expect(screen.queryByTestId("tool-tile-new")).not.toBeInTheDocument();
  });

  // The mount gate: isToolNew reads the clock, so a page prerendered inside the
  // window but served after it lapses would otherwise mismatch on hydration.
  // Server output must carry no badge even for a brand-new tool.
  it("omits the badge from server-rendered HTML", () => {
    const html = renderToString(<ToolTile {...base} creationDate={daysAgo(0)} />);
    expect(html).not.toContain("tool-tile-new");
    expect(html).toContain("Example Tool");
  });
});
