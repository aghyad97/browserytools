import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Record jsPDF construction + save calls. Hoisted so the vi.mock factory can
// reference them (vi.mock is hoisted above imports).
const jspdf = vi.hoisted(() => {
  const save = vi.fn();
  const ctor = vi.fn(() => ({
    internal: { pageSize: { getWidth: () => 595.28, getHeight: () => 841.89 } },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    setFillColor: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    rect: vi.fn(),
    roundedRect: vi.fn(),
    addImage: vi.fn(),
    splitTextToSize: vi.fn((t: string) => [t]),
    save,
  }));
  return { save, ctor };
});

vi.mock("jspdf", () => ({ default: jspdf.ctor }));

import InvoiceGenerator from "@/components/InvoiceGenerator";
import { useInvoiceStore } from "@/store/invoice-store";
import { isInvoiceProUnlocked, unlockInvoicePro } from "@/lib/pro-config";

async function openEditor(user: ReturnType<typeof userEvent.setup>) {
  render(<InvoiceGenerator />);
  // Manager view shows first — create a fresh invoice to reach the editor.
  await user.click(screen.getByRole("button", { name: /new invoice/i }));
}

async function goToTab(
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) {
  await user.click(screen.getByRole("tab", { name }));
}

describe("InvoiceGenerator — templates + Pro gating", () => {
  beforeEach(() => {
    useInvoiceStore.setState({ invoices: [], currentInvoice: null });
  });

  it("renders three template tiles on the preview tab", async () => {
    const user = userEvent.setup();
    await openEditor(user);
    await goToTab(user, /preview/i);

    expect(screen.getByRole("button", { name: /classic/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /modern/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /compact/i })).toBeInTheDocument();
  });

  it("classic (default) leaves the export button enabled", async () => {
    const user = userEvent.setup();
    await openEditor(user);
    await goToTab(user, /export/i);

    const download = screen.getByRole("button", { name: /download pdf/i });
    expect(download).not.toBeDisabled();
  });

  it("selecting a Pro template while locked disables export and shows an upsell", async () => {
    const user = userEvent.setup();
    await openEditor(user);

    await goToTab(user, /preview/i);
    await user.click(screen.getByRole("button", { name: /modern/i }));

    await goToTab(user, /export/i);
    const download = screen.getByRole("button", { name: /download pdf/i });
    expect(download).toBeDisabled();
    // Upsell CTA is visible on the export tab when a locked Pro template is picked.
    expect(
      screen.getByRole("button", { name: /unlock pro/i }),
    ).toBeInTheDocument();
  });

  it("with an empty payment link the upsell dialog shows no price", async () => {
    const user = userEvent.setup();
    await openEditor(user);

    await goToTab(user, /preview/i);
    await user.click(screen.getByRole("button", { name: /modern/i }));

    await goToTab(user, /export/i);
    await user.click(screen.getByRole("button", { name: /unlock pro/i }));

    // Coming-soon copy present in the dialog, no "$5" dead-end CTA anywhere.
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$5/)).not.toBeInTheDocument();
  });

  it("unlocking Pro enables export for a Pro template", async () => {
    const user = userEvent.setup();
    await openEditor(user);

    await goToTab(user, /preview/i);
    await user.click(screen.getByRole("button", { name: /compact/i }));

    await goToTab(user, /export/i);
    expect(
      screen.getByRole("button", { name: /download pdf/i }),
    ).toBeDisabled();

    // Honor-system unlock, then re-render — the component re-reads the flag.
    act(() => {
      unlockInvoicePro();
    });
    expect(isInvoiceProUnlocked()).toBe(true);

    // Re-open editor to force a fresh render that reads the unlocked flag.
    await user.click(screen.getByRole("tab", { name: /preview/i }));
    await user.click(screen.getByRole("tab", { name: /export/i }));

    expect(
      screen.getByRole("button", { name: /download pdf/i }),
    ).not.toBeDisabled();
  });
});
