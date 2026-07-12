import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Rail } from "@/components/layout/rail";

// The rail's live star badge fetches the GitHub API on mount. Stub fetch so the
// unit test never touches the network (and never flakes on it).
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve(null) })),
  );
});

// English short labels come straight from messages/en.json via the global
// next-intl mock (see src/test-setup.ts).
const CATEGORY_LABELS = [
  "Image",
  "File",
  "Media",
  "Text",
  "Data",
  "Math",
  "Productivity",
  "Dev",
  "Design",
  "Security",
  "AI",
];

describe("Rail", () => {
  it("renders all 11 translated category labels plus Everything", () => {
    render(<Rail />);

    // "Everything" pseudo-category resolves from the Rail namespace.
    expect(screen.getByText("Everything")).toBeInTheDocument();

    for (const label of CATEGORY_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // No raw i18n keys leaked through (proves the namespaces resolve).
    expect(screen.queryByText(/^categoriesShort\./)).toBeNull();
  });

  it("resolves the on-device status and nav strings from i18n", () => {
    render(<Rail />);
    expect(screen.getByText(/tools · on-device/)).toBeInTheDocument();
    // Blog intentionally removed from the rail (user ruling 2026-07-12).
    expect(screen.queryByText("Blog")).toBeNull();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    // The search pill moved out of the rail (⌘K / mobile-bar own search now).
    expect(screen.queryByText("Search")).toBeNull();
  });

  it("marks exactly the active category with a single dot indicator", () => {
    // activeCategory=null => the "Everything" row (id null) is the active one.
    const { rerender } = render(
      <Rail activeCategory={null} onCategory={() => {}} />,
    );
    let dots = screen.getAllByTestId("rail-active-dot");
    expect(dots).toHaveLength(1);
    expect(dots[0].closest("button")).toHaveTextContent("Everything");

    // Selecting a real category moves the single dot onto that row.
    rerender(
      <Rail activeCategory="imageTools" onCategory={() => {}} />,
    );
    dots = screen.getAllByTestId("rail-active-dot");
    expect(dots).toHaveLength(1);
    expect(dots[0].closest("button")).toHaveTextContent("Image");
  });

  it("renders the maker's real apps in the sponsor slot", () => {
    render(<Rail />);
    // SPONSORS carries real house apps (spec §3: live products, honest copy);
    // the rotor shows one at a time under the "From the maker" eyebrow.
    expect(screen.getByTestId("rail-sponsor")).toBeInTheDocument();
    expect(screen.getByText("From the maker")).toBeInTheDocument();
    expect(screen.getByText("KashfBank")).toBeInTheDocument();
  });
});
