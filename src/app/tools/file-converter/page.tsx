import FileConverter from "@/components/FileConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/file-converter");
export default function Page() { return <FileConverter />; }
