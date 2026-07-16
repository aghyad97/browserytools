/**
 * Invoice Pro — honor-system unlock scaffold.
 *
 * This is intentionally client-side and honor-based. Unlocking flips a single
 * localStorage flag after the user visits the payment link and returns with
 * `?unlocked=pro`. There is NO server-side verification and this is NOT a
 * security boundary — anyone can set the flag by hand. That is a deliberate,
 * accepted trade-off for a low-stakes cosmetic template unlock.
 */

// Stripe payment link. Empty string ⇒ Pro templates ship as disabled
// "coming soon" previews with NO price and NO purchase CTA (no dead-end
// checkout). Set this to a real Stripe payment link to enable the $5 flow.
export const INVOICE_PRO_PAYMENT_LINK = "";

export const API_WAITLIST_MAILTO =
  "mailto:aaa1997aaa@gmail.com?subject=BrowseryTools%20invoice%20API%20waitlist";

const PRO_STORAGE_KEY = "bt-invoice-pro";

export function isInvoiceProUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockInvoicePro(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRO_STORAGE_KEY, "1");
  } catch {
    // Storage may be unavailable (private mode, quota) — silently ignore.
  }
}
