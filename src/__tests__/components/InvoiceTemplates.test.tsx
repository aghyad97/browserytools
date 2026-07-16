import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Record jsPDF construction + save calls, plus the ordered sequence of every
// drawing-method invocation (text/setFontSize/rect/etc.) into a single shared
// array. The sequence array is what lets the classic-template test snapshot
// the exact draw order — any future edit to that drawing block changes the
// snapshot and fails loudly. vi.hoisted so the vi.mock factory (hoisted above
// imports) can reference it.
const jspdf = vi.hoisted(() => {
  const save = vi.fn();
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const RECORDED_METHODS = [
    "setFontSize",
    "setFont",
    "setTextColor",
    "setFillColor",
    "setDrawColor",
    "setLineWidth",
    "text",
    "line",
    "rect",
    "roundedRect",
    "addImage",
    "splitTextToSize",
  ] as const;

  // Plain `function` (not an arrow) so `new jsPDF(...)` in the component
  // reliably invokes this implementation as a constructor — vitest warns
  // and can misbehave when a mock's constructor implementation is an arrow
  // function.
  const ctor = vi.fn(function jsPDFMock() {
    const instance: Record<string, unknown> = {
      internal: {
        pageSize: { getWidth: () => 595.28, getHeight: () => 841.89 },
      },
      save: (...args: unknown[]) => save(...args),
    };
    for (const method of RECORDED_METHODS) {
      instance[method] = (...args: unknown[]) => {
        calls.push({ method, args });
        // splitTextToSize must keep returning a usable single-line array so
        // downstream y-offset math (`notesLines.length * 4 + 6`) stays sane.
        if (method === "splitTextToSize") return [args[0]];
        return undefined;
      };
    }
    return instance;
  });

  return { save, ctor, calls };
});

vi.mock("jspdf", () => ({ default: jspdf.ctor }));

import InvoiceGenerator from "@/components/InvoiceGenerator";
import { useInvoiceStore, type InvoiceData } from "@/store/invoice-store";
import { isInvoiceProUnlocked, unlockInvoicePro } from "@/lib/pro-config";

// Fully deterministic invoice fixture — every field that feeds into the
// classic PDF draw sequence is fixed, so the snapshot never drifts on
// unrelated things like Date.now()-based invoice numbers.
const fixtureInvoice: InvoiceData = {
  id: "invoice-fixture",
  invoiceNumber: "INV-2026-000001",
  date: "2026-01-01",
  dueDate: "2026-01-31",
  company: {
    name: "Acme Co",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    country: "USA",
    email: "billing@acme.test",
    phone: "555-0100",
    website: "https://acme.test",
    taxId: "TAX-99887",
  },
  client: {
    name: "Client Inc",
    address: "456 Side Ave",
    city: "Shelbyville",
    state: "IL",
    zipCode: "62565",
    country: "USA",
    email: "client@test.com",
    phone: "555-0200",
  },
  items: [
    {
      id: "1",
      description: "Consulting",
      quantity: 2,
      rate: 100,
      amount: 200,
    },
  ],
  subtotal: 200,
  taxRate: 10,
  taxAmount: 15,
  discount: 50,
  total: 165,
  notes: "Thanks for your business.",
  terms: "Net 30",
  currency: "USD",
  pageSize: "a4",
  templateId: "classic",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

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
    // Belt-and-suspenders: the global test-setup beforeEach already clears
    // the localStorage mock, but the Pro-unlock flag is exactly the kind of
    // state that must never leak between tests in this file, so clear it
    // explicitly here too rather than relying on ordering elsewhere.
    localStorage.clear();
    useInvoiceStore.setState({ invoices: [], currentInvoice: null });
    jspdf.calls.length = 0;

    // The classic template formats dates with `toLocaleDateString()` and no
    // locale, so its output — and therefore this file's draw-sequence snapshot
    // — otherwise varies by the runner: day-first locally, month-first on US
    // CI. Pin en-GB/UTC here so the snapshot guards the DRAW SEQUENCE, not the
    // runner's locale. Production is unchanged: real users still see their own
    // locale's format.
    vi.spyOn(Date.prototype, "toLocaleDateString").mockImplementation(
      function (this: Date) {
        return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC" }).format(this);
      },
    );
  });

  afterEach(() => {
    // Restore only this spy — leave the hoisted jsPDF mock intact.
    vi.mocked(Date.prototype.toLocaleDateString).mockRestore?.();
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

  describe("export path invokes jsPDF", () => {
    it("classic template constructs jsPDF for the page size, saves invoice-<number>.pdf, and draws the exact original sequence", async () => {
      const user = userEvent.setup();
      useInvoiceStore.setState({
        invoices: [fixtureInvoice],
        currentInvoice: null,
      });
      render(<InvoiceGenerator />);
      await user.click(screen.getByRole("button", { name: /^open$/i }));
      await goToTab(user, /export/i);

      await user.click(screen.getByRole("button", { name: /download pdf/i }));

      expect(jspdf.ctor).toHaveBeenCalledWith({
        format: fixtureInvoice.pageSize,
      });
      expect(jspdf.save).toHaveBeenCalledWith(
        `invoice-${fixtureInvoice.invoiceNumber}.pdf`,
      );
      // Guards the byte-identical classic drawing block: any future edit to
      // it (reordered/added/removed text, font, or line calls) changes this
      // snapshot and fails the test.
      expect(jspdf.calls).toMatchSnapshot();
    });

    it("modern template (unlocked) constructs jsPDF and saves the invoice PDF", async () => {
      const user = userEvent.setup();
      await openEditor(user);
      const invoiceNumber =
        useInvoiceStore.getState().currentInvoice?.invoiceNumber;

      act(() => {
        unlockInvoicePro();
      });

      await goToTab(user, /preview/i);
      await user.click(screen.getByRole("button", { name: /modern/i }));
      await goToTab(user, /export/i);

      await user.click(screen.getByRole("button", { name: /download pdf/i }));

      expect(jspdf.ctor).toHaveBeenCalled();
      expect(jspdf.save).toHaveBeenCalledWith(`invoice-${invoiceNumber}.pdf`);
    });

    it("compact template (unlocked) constructs jsPDF and saves the invoice PDF", async () => {
      const user = userEvent.setup();
      await openEditor(user);
      const invoiceNumber =
        useInvoiceStore.getState().currentInvoice?.invoiceNumber;

      // Unlock via the same localStorage flag the honor-system flow sets,
      // exercising the other supported unlock path (not just the helper).
      localStorage.setItem("bt-invoice-pro", "1");

      await goToTab(user, /preview/i);
      await user.click(screen.getByRole("button", { name: /compact/i }));
      await goToTab(user, /export/i);

      await user.click(screen.getByRole("button", { name: /download pdf/i }));

      expect(jspdf.ctor).toHaveBeenCalled();
      expect(jspdf.save).toHaveBeenCalledWith(`invoice-${invoiceNumber}.pdf`);
    });
  });
});
