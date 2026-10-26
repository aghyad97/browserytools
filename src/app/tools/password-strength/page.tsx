import PasswordStrength from "@/components/PasswordStrength";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/password-strength");
export default function Page() { return (
    <>
      <PasswordStrength />
      <ToolSeoContent slug="password-strength" />
    </>
  ); }
