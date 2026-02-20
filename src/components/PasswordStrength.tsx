"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Eye, EyeOff, Copy, RefreshCw, Check, X, Shield, Lightbulb, Lock,
} from "lucide-react";
import { toast } from "sonner";
interface CheckItem { label: string; passed: boolean; }

interface StrengthResult {
  score: number;
  label: string;
  barColor: string;
  badgeBg: string;
  entropy: number;
  timeToCrack: string;
  checks: CheckItem[];
  tips: string[];
}

const COMMON_WORDS = [
  "password","123456","qwerty","abc123","111111","iloveyou","admin","letmein",
  "welcome","monkey","dragon","master","sunshine","princess","football","shadow",
  "superman","michael","654321","123321","000000","pass","test","guest","login",
  "hello","123123","1234567","12345678","1234567890",
];

const SEQUENTIAL_PATTERNS = [
  "0123","1234","2345","3456","4567","5678","6789","7890","abcd","bcde","cdef",
  "defg","efgh","fghi","ghij","qwer","wert","erty","rtyu","tyui","yuio","uiop",
  "asdf","sdfg","dfgh","zxcv","xcvb","cvbn",
];
function calcTimeToCrack(charsetSize: number, length: number): string {
  if (charsetSize === 0 || length === 0) return "Instant";
  const guessesPerSec = 1e10;
  const logSeconds = length * Math.log10(charsetSize) - Math.log10(guessesPerSec);
  if (logSeconds < 0) return "Less than 1 second";
  const sec = Math.pow(10, logSeconds);
  if (sec < 60) return `${Math.round(sec)} seconds`;
  if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
  if (sec < 86400) return `${Math.round(sec / 3600)} hours`;
  if (sec < 2592000) return `${Math.round(sec / 86400)} days`;
  if (sec < 31536000) return `${Math.round(sec / 2592000)} months`;
  const years = sec / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  return "Centuries";
}
function analyzePassword(password: string): StrengthResult {
  const emptyChecks: CheckItem[] = [
    { label: "At least 8 characters", passed: false },
    { label: "Uppercase letter (A-Z)", passed: false },
    { label: "Lowercase letter (a-z)", passed: false },
    { label: "Number (0-9)", passed: false },
    { label: "Special character (!@#$...)", passed: false },
    { label: "No common patterns", passed: false },
    { label: "12+ characters", passed: false },
  ];
  if (!password) {
    return {
      score: 0, label: "Very Weak", barColor: "bg-red-500",
      badgeBg: "bg-red-500", entropy: 0, timeToCrack: "Instant",
      checks: emptyChecks, tips: ["Enter a password to analyze its strength."],
    };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLong = password.length >= 8;
  const isVeryLong = password.length >= 12;
  const lower = password.toLowerCase();
  const hasCommon =
    COMMON_WORDS.some((w) => lower.includes(w)) ||
    SEQUENTIAL_PATTERNS.some((p) => lower.includes(p));
  let charset = 0;
  if (hasLower) charset += 26;
  if (hasUpper) charset += 26;
  if (hasNumber) charset += 10;
  if (hasSpecial) charset += 32;
  if (charset === 0) charset = 26;
  const entropy = Math.floor(password.length * Math.log2(charset));
  let score = 0;
  if (isLong) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (isVeryLong) score++;
  if (hasCommon) score = Math.max(0, score - 2);
  score = Math.min(4, Math.max(0, score));
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const barColors = ["bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500"];
  const badgeBgs = ["bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500"];
  const tips: string[] = [];
  if (!isLong) tips.push("Use at least 8 characters.");
  if (!isVeryLong) tips.push("Aim for 12+ characters for stronger security.");
  if (!hasUpper) tips.push("Add uppercase letters (A-Z).");
  if (!hasLower) tips.push("Add lowercase letters (a-z).");
  if (!hasNumber) tips.push("Include at least one number (0-9).");
  if (!hasSpecial) tips.push("Add special characters like !, @, #, $, %.");
  if (hasCommon) tips.push("Avoid common words, sequences, and patterns.");
  if (tips.length === 0) tips.push("Excellent password! Keep it safe and unique per site.");
  return {
    score, label: labels[score], barColor: barColors[score],
    badgeBg: badgeBgs[score], entropy,
    timeToCrack: calcTimeToCrack(charset, password.length),
    checks: [
      { label: "At least 8 characters", passed: isLong },
      { label: "Uppercase letter (A-Z)", passed: hasUpper },
      { label: "Lowercase letter (a-z)", passed: hasLower },
      { label: "Number (0-9)", passed: hasNumber },
      { label: "Special character (!@#$...)", passed: hasSpecial },
      { label: "No common patterns", passed: !hasCommon },
      { label: "12+ characters", passed: isVeryLong },
    ],
    tips,
  };
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SPEC = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generateStrongPassword(length = 20): string {
  const pool = UPPER + LOWER_CHARS + NUMS + SPEC;
  const required = [
    UPPER[Math.floor(Math.random() * UPPER.length)],
    LOWER_CHARS[Math.floor(Math.random() * LOWER_CHARS.length)],
    NUMS[Math.floor(Math.random() * NUMS.length)],
    SPEC[Math.floor(Math.random() * SPEC.length)],
  ];
  const rest = Array.from({ length: length - 4 }, () =>
    pool[Math.floor(Math.random() * pool.length)]
  );
  const chars = [...required, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const result = analyzePassword(password);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const handleGenerate = useCallback(() => {
    const pw = generateStrongPassword(20);
    setPassword(pw);
    setShowPassword(true);
    toast.success("Strong password generated");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Strength Checker
          </CardTitle>
          <CardDescription>
            Real-time analysis — your password never leaves your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-input">Password</Label>
            <div className="relative">
              <Input
                id="pw-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password to analyze..."
                className="pr-20 font-mono"
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => setShowPassword((v) => !v)} type="button">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {password && (
                  <Button variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => copyToClipboard(password)} type="button">
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerate} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate Strong Password
            </Button>
            {password && (
              <Button onClick={() => setPassword("")} variant="ghost" size="sm">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Strength Meter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Strength Analysis
            </span>
            {password && (
              <Badge className={`${result.badgeBg} text-white`}>
                {result.label}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Segmented bar */}
          <div className="space-y-1">
            <div className="flex gap-1 h-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    password && i <= result.score ? result.barColor : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Weak</span>
              <span>Very Strong</span>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold tabular-nums">{password.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Characters</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold tabular-nums">{result.entropy}</div>
              <div className="text-xs text-muted-foreground mt-1">Entropy (bits)</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-semibold leading-snug pt-1">{result.timeToCrack}</div>
              <div className="text-xs text-muted-foreground mt-1">Time to crack</div>
            </div>
          </div>
          {/* Checklist */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Requirements</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.checks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {check.passed ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tips to Improve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
