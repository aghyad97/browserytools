import CodeHighlighter from "@/components/CodeHighlighter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code formatter - Web Tools Suite",
  description: "Collection of browser-based tools",
};

export default function Page() {
  return <CodeHighlighter />;
}
