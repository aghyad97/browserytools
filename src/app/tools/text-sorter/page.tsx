import TextSorter from "@/components/TextSorter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-sorter");
export default function Page() { return <TextSorter />; }
