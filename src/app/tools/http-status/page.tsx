import HttpStatusCodes from "@/components/HttpStatusCodes";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/http-status");
export default function Page() { return <HttpStatusCodes />; }
