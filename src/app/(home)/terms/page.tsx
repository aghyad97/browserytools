import { generatePageMetadata } from "@/lib/metadata";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata = generatePageMetadata(
  "Terms of Use",
  "BrowseryTools is free, AGPL-3.0 licensed software provided as-is, with no warranty.",
  "/terms"
);

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
