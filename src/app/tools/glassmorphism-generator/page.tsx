import GlassmorphismGenerator from "@/components/GlassmorphismGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/glassmorphism-generator");
export default function Page() { return <GlassmorphismGenerator />; }
