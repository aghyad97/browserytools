"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "./blocks/editor-00/editor";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function RichEditor() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  return (
    <div>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
      />
    </div>
  );
}
