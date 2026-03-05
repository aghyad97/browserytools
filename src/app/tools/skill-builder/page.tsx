import SkillBuilder from "@/components/SkillBuilder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/skill-builder");
export default function Page() { return <SkillBuilder />; }
