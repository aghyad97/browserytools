import ExifViewer from "@/components/ExifViewer";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/exif-viewer");
export default function Page() { return <ExifViewer />; }
