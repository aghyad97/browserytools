import { generateToolMetadata } from "@/lib/metadata";
import AirgapTransfer from "@/components/AirgapTransfer";

export const metadata = generateToolMetadata("/tools/airgap-transfer");

export default function AirgapTransferPage() {
  return <AirgapTransfer />;
}
