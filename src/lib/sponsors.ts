/**
 * Rail "From the maker" rotation — real apps by the site's author.
 *
 * Spec §3 honesty rules bind: real, live products, real icons, truthful copy.
 * Copy (tag/desc/cta) is localized via Rail.maker.<id>.* — the app NAMES stay
 * English in every locale (brand names don't translate).
 */

export interface Sponsor {
  /** i18n id under Rail.maker.* */
  id: string;
  /** App icon path under /public (real product icon). */
  icon: string;
  /** Brand name — rendered as-is in every locale. */
  name: string;
  href: string;
}

/** Milliseconds each sponsor stays on screen before rotating. */
export const ROTATE_MS = 10_000;

export const SPONSORS: Sponsor[] = [
  { id: "kashfbank", icon: "/makers/kashfbank.png", name: "KashfBank", href: "https://kashfbank.com" },
  { id: "superbilled", icon: "/makers/superbilled.png", name: "SuperBilled", href: "https://superbilled.com" },
];
