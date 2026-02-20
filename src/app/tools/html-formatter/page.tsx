import HtmlFormatter from "@/components/HtmlFormatter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/html-formatter");
export default function Page() { return <HtmlFormatter />; }
