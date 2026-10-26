import GroupMaker from "@/components/GroupMaker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/group-maker");

export default function GroupMakerPage() {
  return (
    <>
      <GroupMaker />
      <ToolSeoContent slug="group-maker" />
    </>
  );
}
