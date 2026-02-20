import CssGradientGenerator from "@/components/CssGradientGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/css-gradient");
export default function Page() { return <CssGradientGenerator />; }
