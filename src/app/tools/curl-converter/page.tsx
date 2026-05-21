import CurlConverter from "@/components/CurlConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/curl-converter");
export default function Page() { return <CurlConverter />; }
