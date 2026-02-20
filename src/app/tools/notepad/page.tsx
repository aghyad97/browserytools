import Notepad from "@/components/Notepad";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/notepad");
export default function Page() { return <Notepad />; }
