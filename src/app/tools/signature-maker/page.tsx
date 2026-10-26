import SignatureMaker from "@/components/SignatureMaker";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/signature-maker");

export default function Page() {
  return (
    <>
      <SignatureMaker />
      <ToolSeoContent slug="signature-maker" />
    </>
  );
}
