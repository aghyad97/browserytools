"use client";

import { useEffect, useState } from "react";
import {
  estimatedDownloadBytes,
  type OnDeviceModelKey,
} from "@/lib/on-device-models";

/**
 * Client-only estimate of what THIS visitor's browser will download for an
 * on-device AI model — see src/lib/on-device-models.ts for the real byte
 * counts (sourced from the HF Hub API).
 *
 * Starts as `null` (nothing renders) and resolves after mount: WebGPU
 * detection reads `navigator`, which isn't available during SSR, so
 * resolving synchronously would render a different number on the server than
 * the browser produces on hydration — the same class of mismatch ToolTile's
 * `showNew` mount-gating avoids for `isToolNew`.
 */
export function useEstimatedModelSize(key: OnDeviceModelKey): number | null {
  const [bytes, setBytes] = useState<number | null>(null);
  useEffect(() => setBytes(estimatedDownloadBytes(key)), [key]);
  return bytes;
}
