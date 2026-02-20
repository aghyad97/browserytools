import UrlEncoderDecoder from "@/components/UrlEncoderDecoder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/url-encoder");
export default function Page() { return <UrlEncoderDecoder />; }
