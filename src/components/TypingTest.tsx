"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Volume2, VolumeX, RotateCcw, RefreshCcw } from "lucide-react";

function generateParagraph(wordCount: number): string[] {
  const corpus =
    "the quick brown fox jumps over the lazy dog typing speed accuracy practice makes progress not perfection simplicity is the soul of efficiency measure twice cut once code craft learn build create focus clarity keyboard sound thock click rhythm flow concentrate improve daily consistent mindful deliberate repeat habits small steps big gains stay calm breathe posture fingers home row wrist neutral eyes on screen minimal errors high precision smooth motion steady pace stable cadence comfortable natural relaxed confident efficient reliable robust resilient adaptive skill mastery journey enjoy process keep going track metrics words per minute target goal milestone warmup cooldown stretch break hydration energy rest recovery sustainable routine challenge fun playful curiosity explore discover refine iterate polish hone sharpen edge maintain discipline kindness patience".split(
      " "
    );
  const result: string[] = [];
  while (result.length < wordCount) {
    result.push(corpus[Math.floor(Math.random() * corpus.length)]);
  }
  return result;
}

function calculateWpm(charactersTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const words = charactersTyped / 5; // standard WPM metric
  const minutes = elapsedMs / 60000;
  return Math.max(0, Math.round(words / minutes));
}

export default function TypingTest() {
  const [words, setWords] = useState<string[]>(() => generateParagraph(100));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  type Submission = {
    target: string;
    input: string;
    correctChars: number;
    totalChars: number;
  };
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const submittedCorrect = useMemo(
    () => submissions.reduce((sum, s) => sum + s.correctChars, 0),
    [submissions]
  );
  const submittedTotal = useMemo(
    () => submissions.reduce((sum, s) => sum + s.totalChars, 0),
    [submissions]
  );
  const liveCurrentCorrect = useMemo(() => {
    const target = words[currentIndex] ?? "";
    let count = 0;
    for (let i = 0; i < currentInput.length && i < target.length; i++) {
      if (currentInput[i] === target[i]) count++;
    }
    return count;
  }, [currentInput, words, currentIndex]);
  const totalTyped = submittedTotal + currentInput.length;
  const correctCount = submittedCorrect + liveCurrentCorrect;
  const errorCount = Math.max(0, totalTyped - correctCount);
  const accuracy =
    totalTyped === 0
      ? 100
      : Math.max(0, Math.round((correctCount / totalTyped) * 100));

  const nowMs = useRef<number>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const raf = requestAnimationFrame(function loop(ts) {
      nowMs.current = ts;
      setTick((t) => (t + 1) % 1000000);
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [isRunning]);

  const elapsedMs = useMemo(() => {
    if (!startedAt) return 0;
    if (endedAt) return Math.max(0, endedAt - startedAt);
    return Math.max(0, nowMs.current - startedAt);
  }, [startedAt, endedAt, tick]);

  const wpm = useMemo(
    () => calculateWpm(correctCount, elapsedMs),
    [correctCount, elapsedMs]
  );

  const ensureAudio = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    audioCtxRef.current = new Ctx();
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // mechanical-like click: short noise burst + high-pitched blip layered
      osc.type = "square";
      osc.frequency.value = 3200;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      // subtle lower thock
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.value = 180;
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.06);
    } catch (_e) {}
  }, [ensureAudio, soundEnabled]);

  const submitWord = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const target = words[currentIndex] ?? "";
      let correct = 0;
      const len = Math.max(input.length, target.length);
      for (let i = 0; i < len; i++) {
        if (input[i] && target[i] && input[i] === target[i]) correct++;
      }
      setSubmissions((prev) => [
        ...prev,
        { target, input, correctChars: correct, totalChars: input.length },
      ]);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentInput("");
      if (nextIndex >= words.length) {
        setIsRunning(false);
        setEndedAt(performance.now());
      }
    },
    [currentIndex, words]
  );

  const onChange = (value: string) => {
    if (!isRunning) {
      setIsRunning(true);
      setStartedAt(performance.now());
    }
    if (value.includes(" ")) {
      const parts = value.split(/\s+/);
      const last = parts.pop() ?? "";
      for (const token of parts) {
        if (token.length > 0) submitWord(token);
      }
      setCurrentInput(last);
    } else {
      setCurrentInput(value);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      playClick();
      submitWord(currentInput);
      return;
    }
    playClick();
  };

  const reset = () => {
    setCurrentInput("");
    setCurrentIndex(0);
    setSubmissions([]);
    setStartedAt(null);
    setEndedAt(null);
    setIsRunning(false);
  };

  const newText = () => {
    reset();
    setWords(generateParagraph(100));
  };

  return (
    <Card className="container mx-auto max-w-4xl mt-6">
      <CardHeader>
        <CardTitle>Typing Test</CardTitle>
        <CardDescription>
          Test your typing speed with optional mechanical keyboard clicks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={(v) => setSoundEnabled(Boolean(v))}
            />
            <Label
              htmlFor="sound"
              className="flex items-center gap-2 select-none"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              Click sounds
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={reset} title="Reset (same text)">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={newText} title="New text">
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-md bg-muted/50 text-base leading-7 font-mono select-none">
          {words.map((w, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            let cls = "text-muted-foreground";
            if (isPast) {
              const s = submissions[idx];
              const correctWord = s ? s.input === s.target : false;
              cls = correctWord ? "text-green-600" : "text-red-600";
            } else if (isCurrent) {
              cls = "text-foreground";
            }
            return (
              <span key={idx} className={cls}>
                {isCurrent ? (
                  <>
                    {w.split("").map((ch, i) => {
                      const typed = currentInput[i];
                      const isCorrect = typed != null && typed === ch;
                      const isWrong = typed != null && typed !== ch;
                      return (
                        <span
                          key={i}
                          className={
                            isCorrect
                              ? "text-green-600"
                              : isWrong
                              ? "text-red-600 underline decoration-red-400"
                              : undefined
                          }
                        >
                          {ch}
                        </span>
                      );
                    })}
                    {currentInput.length >= w.length ? (
                      <span className="inline-block w-px h-5 bg-foreground ml-[-1px] animate-pulse align-text-top" />
                    ) : null}
                  </>
                ) : (
                  w
                )}
                {idx < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor="typing" className="sr-only">
            Type here
          </Label>
          <Input
            id="typing"
            value={currentInput}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Start typing here..."
            autoFocus
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="WPM" value={wpm} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="Errors" value={errorCount} />
        </div>

        <div className="text-sm text-muted-foreground">
          {isRunning ? "Typing..." : endedAt ? "Completed" : "Idle"} ·{" "}
          {Math.floor(elapsedMs / 1000)}s
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-md border bg-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
