"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { Button } from "@/components/ui/button";

export function MarkdownToggle() {
  const [editor] = useLexicalComposerContext();

  const handleExportMarkdown = () => {
    let md = "";
    editor.update(() => {
      md = $convertToMarkdownString(TRANSFORMERS);
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMarkdown = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,text/markdown";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      editor.update(() => {
        $convertFromMarkdownString(text, TRANSFORMERS);
      });
    };
    input.click();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleImportMarkdown}>
        MD In
      </Button>
      <Button size="sm" onClick={handleExportMarkdown}>
        MD Out
      </Button>
    </div>
  );
}

export default MarkdownToggle;
