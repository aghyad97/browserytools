import ClipPathGenerator from "@/components/ClipPathGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/clip-path-generator");
export default function Page() { return <ClipPathGenerator />; }
