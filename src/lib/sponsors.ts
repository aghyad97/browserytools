/**
 * Rail "From the maker" rotation — real apps by the site's author.
 *
 * Spec §3 honesty rules still bind: every entry must be a real, live product
 * with a working href and truthful copy. No fake metrics, no fictional
 * placeholder brands (the prototype's Vercel/ElevenLabs/Raycast entries must
 * never return). The rail label is Rail.sponsorLabel ("From the maker").
 */

export interface Sponsor {
  /** Single-letter mark shown in the logo tile. */
  initial: string;
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
    initial: "K",
    name: "KashfBank",
    tag: "Bank statements → CSV",
    desc: "Convert any bank statement PDF into clean CSV & Excel.",
    cta: "Try it",
    href: "https://kashfbank.com",
  },
  {
    initial: "S",
    name: "SuperBilled",
    tag: "Superbills for therapists",
    desc: "Insurance-ready superbills for private-pay therapists.",
    cta: "Visit",
    href: "https://superbilled.com",
  },
  {
    initial: "K",
    name: "KalimaLab",
    tag: "The Arabic Language API",
    desc: "Arabic NLP & dictionary API — 117 endpoints, 128k lemmas.",
    cta: "Explore",
    href: "https://kalimalab.com",
  },
  {
    initial: "L",
    name: "Leen Studio",
    tag: "AI Instagram analyzer",
    desc: "Predict virality before you post your next Reel.",
    cta: "Visit",
    href: "https://leen.studio",
  },
];
