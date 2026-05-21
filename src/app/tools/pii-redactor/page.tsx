import PiiRedactor from "@/components/PiiRedactor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/pii-redactor");

export default function Page() {
  return <PiiRedactor />;
}
