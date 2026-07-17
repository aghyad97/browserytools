"use client";

import { useCallback, useEffect, useState } from "react";
import { type Dict, loadDictionary } from "@/lib/word/dictionary";

type Status = "idle" | "loading" | "ready" | "error";

export function useDictionary(): { status: Status; dict: Dict | null; retry: () => void } {
  const [status, setStatus] = useState<Status>("loading");
  const [dict, setDict] = useState<Dict | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadDictionary()
      .then((d) => {
        if (cancelled) return;
        setDict(d);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  return { status, dict, retry };
}
