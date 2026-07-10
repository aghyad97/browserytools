/**
 * Rail sponsor rotation config.
 *
 * Ships EMPTY on purpose — the rail's SponsorRotator renders nothing until a
 * real, paying sponsor exists (spec §3: "native only … nothing renders when
 * unsold"; §3 hard rule: no fake metrics/placeholder ads). Add a `Sponsor`
 * entry here to light the rotor up. Do NOT re-introduce the prototype's
 * fictional Vercel/ElevenLabs/Raycast entries.
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

export const SPONSORS: Sponsor[] = [];
