import TotpGenerator from "@/components/TotpGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/totp-generator");

export default function Page() {
  return <TotpGenerator />;
}
