import PasswordStrength from "@/components/PasswordStrength";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/password-strength");
export default function Page() { return <PasswordStrength />; }
