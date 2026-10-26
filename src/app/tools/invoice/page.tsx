import InvoiceGenerator from "@/components/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/invoice");

export default function InvoicePage() {
  return (
    <>
      <InvoiceGenerator />
      <ToolSeoContent slug="invoice" />
    </>
  );
}
