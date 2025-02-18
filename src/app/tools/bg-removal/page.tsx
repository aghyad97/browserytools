import BgRemoval from "@/components/BgRemoval";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Removal - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <BgRemoval />;
}
