import UrlEncoderDecoder from "@/components/UrlEncoderDecoder";
import { generateToolMetadata } from "@/lib/metadata";
import ToolSeoContent from "@/components/tool-seo/tool-seo-content";
export const metadata = generateToolMetadata("/tools/url-encoder");
export default function Page() { return (
    <>
      <UrlEncoderDecoder />
      <ToolSeoContent slug="url-encoder" />
    </>
  ); }
