import SkillBuilder from "@/components/SkillBuilder";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/skill-builder");
export default function Page() { return (
    <>
      <SkillBuilder />
      <ToolSeoContent slug="skill-builder" />
    </>
  ); }
