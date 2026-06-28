import GifMaker from "@/components/GifMaker";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/gif-maker");

export default function Page() {
  return <GifMaker />;
}
