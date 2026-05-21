import Translator from "@/components/Translator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/translator");

export default function Page() {
  return <Translator />;
}
