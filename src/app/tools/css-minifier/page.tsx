import CssMinifier from "@/components/CssMinifier";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/css-minifier");
export default function Page() { return <CssMinifier />; }
