import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StructuredData from "@/components/StructuredData";

function readJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent ?? "{}");
}

describe("StructuredData website ItemList", () => {
  const { container } = render(<StructuredData type="website" />);
  const data = readJsonLd(container);
  const list = data.mainEntity.itemListElement as Array<{
    item: Record<string, unknown>;
  }>;

  it("lists tools and numberOfItems matches the item count", () => {
    expect(list.length).toBeGreaterThan(0);
    expect(data.mainEntity.numberOfItems).toBe(list.length);
  });

  it("emits no Offer on any item", () => {
    for (const { item } of list) {
      expect(item).not.toHaveProperty("offers");
    }
  });

  it("marks every item isAccessibleForFree", () => {
    for (const { item } of list) {
      expect(item.isAccessibleForFree).toBe(true);
    }
  });
});
