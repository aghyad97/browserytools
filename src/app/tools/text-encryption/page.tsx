import TextEncryption from "@/components/TextEncryption";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-encryption");
export default function Page() { return <TextEncryption />; }
