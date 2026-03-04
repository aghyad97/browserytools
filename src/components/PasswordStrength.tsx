"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
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
function calcTimeToCrack(charsetSize: number, length: number): number | null {
  if (charsetSize === 0 || length === 0) return null; // "Instant"
  const guessesPerSec = 1e10;
  const logSeconds = length * Math.log10(charsetSize) - Math.log10(guessesPerSec);
  if (logSeconds < 0) return -1; // "Less than 1 second"
  return Math.pow(10, logSeconds);
}

interface AnalysisData {
  score: number;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isLong: boolean;
  isVeryLong: boolean;
  hasCommon: boolean;
  charset: number;
  entropy: number;
  timeToCrackSec: number | null;
}

function analyzePasswordData(password: string): AnalysisData | null {
  if (!password) return null;
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
  return { score, hasUpper, hasLower, hasNumber, hasSpecial, isLong, isVeryLong, hasCommon, charset, entropy, timeToCrackSec: calcTimeToCrack(charset, password.length) };
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
  const t = useTranslations("Tools.PasswordStrength");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const data = analyzePasswordData(password);

  const formatTimeToCrack = (sec: number | null): string => {
    if (sec === null) return t("strengthInstant");
    if (sec === -1) return t("strengthLessThan1s");
    if (sec < 60) return t("strengthSeconds", { n: Math.round(sec) });
    if (sec < 3600) return t("strengthMinutes", { n: Math.round(sec / 60) });
    if (sec < 86400) return t("strengthHours", { n: Math.round(sec / 3600) });
    if (sec < 2592000) return t("strengthDays", { n: Math.round(sec / 86400) });
    if (sec < 31536000) return t("strengthMonths", { n: Math.round(sec / 2592000) });
    const years = sec / 31536000;
    if (years < 1000) return t("strengthYears", { n: Math.round(years) });
    if (years < 1e6) return t("strengthThousandYears", { n: Math.round(years / 1000) });
    if (years < 1e9) return t("strengthMillionYears", { n: Math.round(years / 1e6) });
    return t("strengthCenturies");
  };

  const barColors = ["bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500"];
  const badgeBgs = ["bg-red-500","bg-orange-500","bg-yellow-500","bg-blue-500","bg-green-500"];
  const strengthLabels = [t("veryWeak"), t("strengthWeak"), t("strengthFair"), t("strengthStrong"), t("veryStrong")];

  const score = data?.score ?? 0;
  const barColor = barColors[score];
  const badgeBg = badgeBgs[score];
  const strengthLabel = strengthLabels[score];
  const entropy = data?.entropy ?? 0;
  const timeToCrack = formatTimeToCrack(data?.timeToCrackSec ?? null);

  const checks: { label: string; passed: boolean }[] = [
    { label: t("checkMin8"), passed: data?.isLong ?? false },
    { label: t("checkUpper"), passed: data?.hasUpper ?? false },
    { label: t("checkLower"), passed: data?.hasLower ?? false },
    { label: t("checkNumber"), passed: data?.hasNumber ?? false },
    { label: t("checkSpecial"), passed: data?.hasSpecial ?? false },
    { label: t("checkNoCommon"), passed: data ? !data.hasCommon : false },
    { label: t("check12Plus"), passed: data?.isVeryLong ?? false },
  ];

  const tips: string[] = [];
  if (!data) {
    tips.push(t("tipEnterPassword"));
  } else {
    if (!data.isLong) tips.push(t("tipMin8"));
    if (!data.isVeryLong) tips.push(t("tip12Plus"));
    if (!data.hasUpper) tips.push(t("tipAddUpper"));
    if (!data.hasLower) tips.push(t("tipAddLower"));
    if (!data.hasNumber) tips.push(t("tipAddNumber"));
    if (!data.hasSpecial) tips.push(t("tipAddSpecial"));
    if (data.hasCommon) tips.push(t("tipAvoidCommon"));
    if (tips.length === 0) tips.push(t("tipExcellent"));
  }

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("failedToCopy"));
    }
  }, [t]);

  const handleGenerate = useCallback(() => {
    const pw = generateStrongPassword(20);
    setPassword(pw);
    setShowPassword(true);
    toast.success(t("strongPasswordGenerated"));
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-input">{t("passwordLabel")}</Label>
            <div className="relative">
              <Input
                id="pw-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="pr-20 font-mono"
                dir="ltr"
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
              {t("generateStrongPassword")}
            </Button>
            {password && (
              <Button onClick={() => setPassword("")} variant="ghost" size="sm">
                {t("clear")}
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
              {t("strengthAnalysisTitle")}
            </span>
            {password && (
              <Badge className={`${badgeBg} text-white`}>
                {strengthLabel}
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
                    password && i <= score ? barColor : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("veryWeak")}</span>
              <span>{t("veryStrong")}</span>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold tabular-nums">{password.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("charactersLabel")}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-2xl font-bold tabular-nums">{entropy}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("entropyLabel")}</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-semibold leading-snug pt-1">{timeToCrack}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("timeToCrackLabel")}</div>
            </div>
          </div>
          {/* Checklist */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("requirementsLabel")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checks.map((check, idx) => (
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
            {t("tipsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tips.map((tip, idx) => (
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
