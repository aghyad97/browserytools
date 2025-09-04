import ZipTool from "@/components/ZipTools";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/zip");

export default function Page() {
  return <ZipTool />;
}
