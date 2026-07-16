"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMediaDevices } from "./useMediaDevices";

/**
 * Camera half of the mic/camera tester: device picker + live video preview.
 * Owns its own video-only stream lifecycle (start/stop + unmount teardown) so
 * it can stand alone as the `/tools/webcam-test` landing tool.
 */
export function WebcamTesterPanel() {
  const t = useTranslations("Tools.MicCameraTester");
  const { cameras } = useMediaDevices();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedCam, setSelectedCam] = useState<string>("");
  const [hasStream, setHasStream] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedCam && cameras[0]) setSelectedCam(cameras[0].deviceId);
  }, [cameras, selectedCam]);

  const stopCurrent = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setHasStream(false);
  }, []);

  const startPreview = async () => {
    try {
      stopCurrent();
      const s = await navigator.mediaDevices.getUserMedia({
        video: selectedCam ? { deviceId: { exact: selectedCam } } : true,
      });
      streamRef.current = s;
      setHasStream(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      toast.success(t("previewStarted"));
    } catch {
      toast.error(t("errorAccessingDevices"));
    }
  };

  useEffect(() => {
    return () => stopCurrent();
  }, [stopCurrent]);

  return (
    <div className="space-y-4">
      <SettingsCard>
        <OptionRow label={t("camera")} htmlFor="mct-camera">
          <Select value={selectedCam} onValueChange={setSelectedCam}>
            <SelectTrigger id="mct-camera">
              <SelectValue placeholder={t("chooseCamera")} />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((c) => (
                <SelectItem key={c.deviceId} value={c.deviceId}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionRow>

        <div className="flex gap-2">
          <Button onClick={startPreview}>{t("startPreview")}</Button>
          <Button variant="outline" onClick={stopCurrent} disabled={!hasStream}>
            {t("stop")}
          </Button>
        </div>
      </SettingsCard>

      <Card className="p-4">
        <div className="border rounded overflow-hidden bg-black/5 dark:bg-white/5">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video object-contain"
          />
        </div>
      </Card>
    </div>
  );
}
