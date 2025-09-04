import RichEditor from "@/components/RichEditor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/rich-editor");

export default function Page() {
  return (
    <div className="mx-auto p-4 max-w-6xl">
      <RichEditor />
    </div>
  );
}
