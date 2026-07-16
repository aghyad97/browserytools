"use client";

import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { WebcamTesterPanel } from "@/components/media-tester/WebcamTesterPanel";
import { MicTesterPanel } from "@/components/media-tester/MicTesterPanel";

export default function MicCameraTester() {
  const tc = useTranslations("ToolsConfig");

  return (
    <ToolShell
      slug="mic-camera"
      title={tc("tools.mic-camera.name")}
      sub={tc("tools.mic-camera.description")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WebcamTesterPanel />
        <MicTesterPanel />
      </div>
    </ToolShell>
  );
}
