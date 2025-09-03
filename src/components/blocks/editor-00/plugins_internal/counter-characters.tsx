"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function CounterCharacters({
  charset = "UTF-16",
}: {
  charset?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [chars, setChars] = useState(0);
  const [words, setWords] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const text = editorState.read(() => {
        // naive plain text by grabbing root text content
        return editor.getRootElement()?.innerText ?? "";
      });
      setChars(text.length);
      setWords(text.trim() ? text.trim().split(/\s+/).length : 0);
    });
  }, [editor]);

  return (
    <div className="text-xs text-muted-foreground">
      {chars} characters | {words} words
    </div>
  );
}

export default CounterCharacters;
