/**
 * Pure math for a spin wheel. No DOM, no canvas — just angles and colors.
 *
 * Geometry convention:
 * - The pointer is fixed in the world at angle 0 ("top").
 * - The wheel's own segments are laid out in its local frame starting at
 *   local angle 0 and going clockwise: segment `i` spans
 *   `[i * segmentAngle, (i + 1) * segmentAngle)`, so its center sits at
 *   `(i + 0.5) * segmentAngle`.
 * - Rotating the wheel by `rotation` radians (clockwise-positive, matching
 *   canvas `ctx.rotate`) moves a point that sits at local angle `theta` to
 *   world angle `theta + rotation` (mod 2π).
 * - The segment under the pointer is therefore whichever segment's local
 *   angle range contains `theta = -rotation (mod 2π)`, since that is the
 *   local angle that maps to world angle 0.
 */

const TWO_PI = Math.PI * 2;

/** Fixed content palette for wheel segments — cycles for any segment count. */
const SEGMENT_PALETTE: readonly string[] = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

function normalizeAngle(angle: number): number {
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

/** Angular width of one of `count` equal segments, in radians. */
export function segmentAngle(count: number): number {
  return TWO_PI / count;
}

/** Deterministic fixed-palette color for a segment index, cycling for any index. */
export function segmentColor(index: number): string {
  const i = ((index % SEGMENT_PALETTE.length) + SEGMENT_PALETTE.length) % SEGMENT_PALETTE.length;
  return SEGMENT_PALETTE[i];
}

/**
 * Rotation (radians) to apply so the wheel lands with `targetIndex`'s
 * segment centered under the fixed top pointer, after spinning at least
 * `turns` full revolutions forward from `currentRotation`. Always strictly
 * greater than `currentRotation`.
 */
export function targetRotation(
  currentRotation: number,
  targetIndex: number,
  count: number,
  turns = 1,
): number {
  const segAngle = segmentAngle(count);
  const centerTheta = (targetIndex + 0.5) * segAngle;
  // We need normalizeAngle(-rotation) === centerTheta, i.e.
  // rotation ≡ -centerTheta (mod 2π).
  const desiredMod = normalizeAngle(-centerTheta);
  const currentMod = normalizeAngle(currentRotation);
  const forwardDelta = normalizeAngle(desiredMod - currentMod);

  let advance = forwardDelta + turns * TWO_PI;
  // Guard: if there's no fractional delta and no requested turns, force at
  // least one full revolution so the result is always strictly forward.
  if (advance <= 0) {
    advance += TWO_PI;
  }

  return currentRotation + advance;
}

/** Inverse of targetRotation: which segment index sits under the fixed top pointer. */
export function indexAtPointer(rotation: number, count: number): number {
  const segAngle = segmentAngle(count);
  const theta = normalizeAngle(-rotation);
  let index = Math.floor(theta / segAngle);
  if (index >= count) index = count - 1;
  if (index < 0) index = 0;
  return index;
}
