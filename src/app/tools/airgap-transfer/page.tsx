import { generateToolMetadata } from "@/lib/metadata";
import AirgapTransfer from "@/components/AirgapTransfer";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/airgap-transfer");

export default function AirgapTransferPage() {
  return (
    <>
      <AirgapTransfer />
      <ToolSeoContent slug="airgap-transfer" />
    </>
  );
}
