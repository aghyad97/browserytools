import GroupMaker from "@/components/GroupMaker";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/group-maker");

export default function GroupMakerPage() {
  return <GroupMaker />;
}
