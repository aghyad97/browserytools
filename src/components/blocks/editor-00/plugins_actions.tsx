"use client";

import { useState } from "react";
import { ActionsPlugin } from "./plugins_internal/actions-plugin";
import { ImportExport } from "./plugins_internal/import-export";
import { MarkdownToggle } from "./plugins_internal/markdown-toggle";
import { CounterCharacters } from "./plugins_internal/counter-characters";

export default function ActionsBar() {
  const [charset] = useState("UTF-16");
  return (
    <ActionsPlugin>
      <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-2">
        <div className="flex flex-1 justify-start">{/* left side */}</div>
        <div>
          <CounterCharacters charset={charset} />
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <MarkdownToggle />
          <ImportExport />
        </div>
      </div>
    </ActionsPlugin>
  );
}
