import BgRemoval from "@/components/BgRemoval";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/bg-removal");

export default function Page() {
  return <BgRemoval />;
}
