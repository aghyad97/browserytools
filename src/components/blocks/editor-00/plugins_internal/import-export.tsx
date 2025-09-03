"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";

export function ImportExport() {
  const [editor] = useLexicalComposerContext();

  const handleExport = async () => {
    const json = editor.getEditorState().toJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-state.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const state = JSON.parse(text);
        editor.setEditorState(editor.parseEditorState(state));
      } catch {}
    };
    input.click();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleImport}>
        Import
      </Button>
      <Button size="sm" onClick={handleExport}>
        Export
      </Button>
    </div>
  );
}

export default ImportExport;
