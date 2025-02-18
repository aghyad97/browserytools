import ColorCorrection from "@/components/ColorCorrection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Correction - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <ColorCorrection />;
}
