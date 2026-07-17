"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type Dict, loadDictionary } from "@/lib/word/dictionary";

type Status = "idle" | "loading" | "ready" | "error";

export function useDictionary(): { status: Status; dict: Dict | null; retry: () => void } {
  const [status, setStatus] = useState<Status>("loading");
  const [dict, setDict] = useState<Dict | null>(null);
  const [attempt, setAttempt] = useState(0);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    setStatus("loading");
    loadDictionary()
      .then((d) => {
        if (cancelled.current) return;
        setDict(d);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled.current) return;
        setStatus("error");
      });
    return () => {
      cancelled.current = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  return { status, dict, retry };
}
