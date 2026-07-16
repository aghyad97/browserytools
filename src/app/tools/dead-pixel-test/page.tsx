import DeadPixelTest from "@/components/DeadPixelTest";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/dead-pixel-test");

export default function Page() {
  return <DeadPixelTest />;
}
