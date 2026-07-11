/* AUTO-GENERATED from src/brand/logo.svg — run: bun run brand */
/**
 * BrandGlyph — the current brand mark, inlined from src/brand/logo.svg.
 *
 * Black/#000 fill and stroke in the source are rewritten to currentColor so
 * the mark themes for free (white on the dark rail tile, ink on light
 * contexts). Do not hand-edit — change src/brand/logo.svg and run
 * `bun run brand` instead.
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
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="500" height="500" fill="currentColor"/>
      <circle cx="750" cy="750" r="250" fill="currentColor"/>
      <path d="M500 1000C433.696 1000 370.107 973.661 323.223 926.777C276.339 879.893 250 816.304 250 750C250 683.696 276.339 620.107 323.223 573.223C370.107 526.339 433.696 500 500 500L500 750L500 1000Z" fill="currentColor"/>
      <path d="M1000 500C1000 467.17 993.534 434.661 980.97 404.329C968.406 373.998 949.991 346.438 926.777 323.223C903.562 300.009 876.002 281.594 845.671 269.03C815.339 256.466 782.83 250 750 250C717.17 250 684.661 256.466 654.329 269.03C623.998 281.594 596.438 300.009 573.223 323.223C550.009 346.438 531.594 373.998 519.03 404.329C506.466 434.661 500 467.17 500 500L750 500H1000Z" fill="currentColor"/>
    </svg>
  );
}
