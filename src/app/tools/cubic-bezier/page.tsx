import CubicBezier from "@/components/CubicBezier";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/cubic-bezier");
export default function Page() { return (
    <>
      <CubicBezier />
      <ToolSeoContent slug="cubic-bezier" />
    </>
  ); }
