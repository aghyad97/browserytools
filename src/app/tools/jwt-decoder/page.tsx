import { generateToolMetadata } from "@/lib/metadata";
import JWTDecoder from "@/components/JWTDecoder";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";

export const metadata = generateToolMetadata("/tools/jwt-decoder");

export default function JWTDecoderPage() {
  return (
    <>
      <JWTDecoder />
      <ToolSeoContent slug="jwt-decoder" />
    </>
  );
}
