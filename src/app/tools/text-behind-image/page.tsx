import TextBehindImage from "@/components/TextBehindImage";
import { generateToolMetadata } from "@/lib/metadata";
import "@/app/fonts.css";

export const metadata = generateToolMetadata("/tools/text-behind-image");

export default function TextBehindImagePage() {
  return <TextBehindImage />;
}
