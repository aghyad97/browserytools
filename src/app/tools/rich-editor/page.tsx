import RichEditor from "@/components/RichEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rich Text Editor - Web Tools Suite",
  description: "A powerful, browser-based rich text editor.",
};

export default function Page() {
  return (
    <div className="mx-auto p-4 max-w-6xl">
      <RichEditor />
    </div>
  );
}
