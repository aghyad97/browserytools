import CssShadow from "@/components/CssShadow";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/css-shadow");

export default function Page() {
  return <CssShadow />;
}
