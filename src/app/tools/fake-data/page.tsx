import FakeDataGenerator from "@/components/FakeDataGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/fake-data");
export default function Page() { return (
    <>
      <FakeDataGenerator />
      <ToolSeoContent slug="fake-data" />
    </>
  ); }
