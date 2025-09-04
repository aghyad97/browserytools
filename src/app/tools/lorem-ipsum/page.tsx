import LoremIpsumGenerator from "@/components/LoremIpsumGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/lorem-ipsum");

export default function LoremIpsumPage() {
  return <LoremIpsumGenerator />;
}
