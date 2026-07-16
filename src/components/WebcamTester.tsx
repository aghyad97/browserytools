"use client";

import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { WebcamTesterPanel } from "@/components/media-tester/WebcamTesterPanel";

const slug = "webcam-test";

export default function WebcamTester() {
  const tc = useTranslations("ToolsConfig");

  return (
    <ToolShell
      slug={slug}
      title={tc(`tools.${slug}.name` as never)}
      sub={tc(`tools.${slug}.description` as never)}
    >
      <div className="mx-auto max-w-3xl">
        <WebcamTesterPanel />
      </div>
    </ToolShell>
  );
}
