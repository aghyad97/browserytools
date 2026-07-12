/**
 * Rail "From the maker" rotation — real apps by the site's author.
 *
 * Spec §3 honesty rules still bind: every entry must be a real, live product
 * with a working href, its real icon, and truthful copy. No fake metrics, no
 * fictional placeholder brands. The rail label is Rail.sponsorLabel
 * ("From the maker").
 */

export interface Sponsor {
  /** App icon path under /public (real product icon, not a letter tile). */
  icon: string;
  name: string;
  tag: string;
  desc: string;
  cta: string;
  href?: string;
}

/** Milliseconds each sponsor stays on screen before rotating. */
export const ROTATE_MS = 10_000;

export const SPONSORS: Sponsor[] = [
  {
    icon: "/makers/kashfbank.png",
    name: "KashfBank",
    tag: "Bank statements → CSV",
    desc: "Convert any bank statement PDF into clean CSV & Excel.",
    cta: "Try it",
    href: "https://kashfbank.com",
  },
  {
    icon: "/makers/superbilled.png",
    name: "SuperBilled",
    tag: "Superbills for therapists",
    desc: "Insurance-ready superbills for private-pay therapists.",
    cta: "Visit",
    href: "https://superbilled.com",
  },
];
