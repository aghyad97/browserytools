import { generatePageMetadata } from "@/lib/metadata";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata = generatePageMetadata(
  "Privacy Policy",
  "How BrowseryTools handles your data: no accounts, on-device processing, and aggregate analytics only.",
  "/privacy"
);

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
