"use client";

import { useTranslations } from "next-intl";
import { ToolShell } from "@/components/template/tool-shell";
import { MicTesterPanel } from "@/components/media-tester/MicTesterPanel";

const slug = "mic-test";

export default function MicTester() {
  const tc = useTranslations("ToolsConfig");

  return (
    <ToolShell
      slug={slug}
      title={tc(`tools.${slug}.name` as never)}
      sub={tc(`tools.${slug}.description` as never)}
    >
      <div className="mx-auto max-w-2xl">
        <MicTesterPanel />
      </div>
    </ToolShell>
  );
}
