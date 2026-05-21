import CubicBezier from "@/components/CubicBezier";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/cubic-bezier");
export default function Page() { return <CubicBezier />; }
