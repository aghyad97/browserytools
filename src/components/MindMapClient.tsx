"use client";

import dynamic from "next/dynamic";

// React Flow touches the DOM (ResizeObserver, measuring) so render it client-only.
const MindMap = dynamic(() => import("@/components/MindMap"), { ssr: false });

export default function MindMapClient() {
  return <MindMap />;
}
