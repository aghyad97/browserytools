import JsonFormatter from "@/components/JsonFormatter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/json-formatter");
export default function Page() { return <JsonFormatter />; }
