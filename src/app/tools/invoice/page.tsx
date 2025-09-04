import InvoiceGenerator from "@/components/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/invoice");

export default function InvoicePage() {
  return <InvoiceGenerator />;
}
