"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export interface MediaDeviceInfoLite {
  deviceId: string;
  label: string;
}

/**
 * Enumerates the available cameras and microphones and keeps the lists fresh
 * across `devicechange` events. Extracted verbatim from MicCameraTester's
 * `listDevices` so the mic/webcam panels can share one source of truth without
 * each holding its own device selection state.
 */
export function useMediaDevices() {
  const t = useTranslations("Tools.MicCameraTester");
  const [cameras, setCameras] = useState<MediaDeviceInfoLite[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfoLite[]>([]);

  const refresh = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices
        .filter((d) => d.kind === "videoinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" }));
      const microphones = devices
        .filter((d) => d.kind === "audioinput" && d.deviceId)
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }));
      setCameras(cams);
      setMics(microphones);
    } catch {
      toast.error(t("errorListingDevices"));
    }
  }, [t]);

  useEffect(() => {
    refresh();
    navigator.mediaDevices.addEventListener?.("devicechange", refresh);
    return () => {
      navigator.mediaDevices.removeEventListener?.("devicechange", refresh);
    };
  }, [refresh]);

  return { cameras, mics, refresh };
}
