import KeepAwake from "@/components/KeepAwake";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/keep-awake");
export default function Page() { return <KeepAwake />; }
