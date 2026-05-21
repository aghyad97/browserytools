import SignatureMaker from "@/components/SignatureMaker";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/signature-maker");

export default function Page() {
  return <SignatureMaker />;
}
