import SqlFormatter from "@/components/SqlFormatter";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/sql-formatter");
export default function Page() { return (
    <>
      <SqlFormatter />
      <ToolSeoContent slug="sql-formatter" />
    </>
  ); }
