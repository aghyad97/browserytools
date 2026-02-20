import ImageResizer from "@/components/ImageResizer";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/image-resizer");
export default function Page() { return <ImageResizer />; }
