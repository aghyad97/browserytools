import MetaTagsGenerator from "@/components/MetaTagsGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/meta-tags");

export default function Page() {
  return <MetaTagsGenerator />;
}
