import MindMapClient from "@/components/MindMapClient";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/mind-map");

export default function Page() {
  return <MindMapClient />;
}
