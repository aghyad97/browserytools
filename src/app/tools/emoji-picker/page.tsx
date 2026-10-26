import EmojiPicker from "@/components/EmojiPicker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/emoji-picker");
export default function Page() { return (
    <>
      <EmojiPicker />
      <ToolSeoContent slug="emoji-picker" />
    </>
  ); }
