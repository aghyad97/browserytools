import ContrastChecker from "@/components/ContrastChecker";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/contrast-checker");
export default function Page() { return <ContrastChecker />; }
