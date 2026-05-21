import ImageColorPicker from "@/components/ImageColorPicker";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-color-picker");

export default function Page() {
  return <ImageColorPicker />;
}
