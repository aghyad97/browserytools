import MemeGenerator from "@/components/MemeGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/meme-generator");

export default function Page() {
  return <MemeGenerator />;
}
