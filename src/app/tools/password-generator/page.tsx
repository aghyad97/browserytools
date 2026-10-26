import PasswordGenerator from "@/components/PasswordGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/password-generator");

export default function PasswordGeneratorPage() {
  return (
    <>
      <PasswordGenerator />
      <ToolSeoContent slug="password-generator" />
    </>
  );
}
