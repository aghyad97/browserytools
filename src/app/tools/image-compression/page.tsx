import ImageCompression from "@/components/ImageCompression";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compression - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <ImageCompression />;
}
