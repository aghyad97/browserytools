import TotpGenerator from "@/components/TotpGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/totp-generator");

export default function Page() {
  return (
    <>
      <TotpGenerator />
      <ToolSeoContent slug="totp-generator" />
    </>
  );
}
