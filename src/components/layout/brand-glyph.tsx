/**
 * BrandGlyph — the final lowercase "b" mark (hooked ascender + circle bowl).
 *
 * Monoline glyph inlined from .superpowers/sdd/brand-b-glyph.svg. Uses
 * stroke="currentColor" so it inherits the surrounding text colour and themes
 * for free (white on the dark rail tile via the tile's `color: var(--bt-bg)`,
 * ink on light contexts).
 *
 * The square viewBox centres the portrait glyph (260×320) with cap-safe margin
 * so the round stroke caps never clip. Default stroke is slightly thickened
 * (23) so the monoline holds up at the small sizes it renders at.
 */
export function BrandGlyph({
  size = 16,
  strokeWidth = 23,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-44 -14 348 348"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <path d="M51.5 10H61C77.0163 10 90 22.9837 90 39V281C90 297.016 77.0163 310 61 310H10" />
        <circle cx="173" cy="233" r="77" />
      </g>
    </svg>
  );
}
