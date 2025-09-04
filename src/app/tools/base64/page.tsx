import Base64Converter from "@/components/Base64Converter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/base64");

export default function Page() {
  return <Base64Converter />;
}
