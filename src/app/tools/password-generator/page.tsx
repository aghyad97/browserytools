import PasswordGenerator from "@/components/PasswordGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/password-generator");

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}
