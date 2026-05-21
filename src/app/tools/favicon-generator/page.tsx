import FaviconGenerator from "@/components/FaviconGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/favicon-generator");

export default function Page() {
  return <FaviconGenerator />;
}
