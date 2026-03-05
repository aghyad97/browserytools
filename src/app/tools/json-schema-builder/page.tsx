import JsonSchemaBuilder from "@/components/JsonSchemaBuilder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/json-schema-builder");
export default function Page() { return <JsonSchemaBuilder />; }
