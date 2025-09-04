import { generateToolMetadata } from "@/lib/metadata";
import JWTDecoder from "@/components/JWTDecoder";

export const metadata = generateToolMetadata("/tools/jwt-decoder");

export default function JWTDecoderPage() {
  return <JWTDecoder />;
}
