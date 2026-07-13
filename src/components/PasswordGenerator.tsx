"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, RefreshCw, Shield, Lock, Key } from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { SettingsCard } from "@/components/shared/SettingsCard";
import { SliderRow } from "@/components/shared/SliderRow";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

export default function PasswordGenerator() {
  const t = useTranslations("Tools.PasswordGenerator");
  const tc = useTranslations("ToolsConfig");
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: t("strengthVeryWeak"),
    color: "text-red-500",
    feedback: [],
  });

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`~,;.<>";

  const generatePassword = useCallback(() => {
    let charset = "";

    if (options.includeUppercase) {
      charset += options.excludeSimilar
        ? uppercaseChars.replace(/[ILO]/g, "")
        : uppercaseChars;
    }

    if (options.includeLowercase) {
      charset += options.excludeSimilar
        ? lowercaseChars.replace(/[ilo]/g, "")
        : lowercaseChars;
    }

    if (options.includeNumbers) {
      charset += options.excludeSimilar
        ? numberChars.replace(/[01]/g, "")
        : numberChars;
    }

    if (options.includeSymbols) {
      charset += options.excludeAmbiguous
        ? symbolChars.replace(
            new RegExp(
              `[${ambiguousChars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`,
              "g"
            ),
            ""
          )
        : symbolChars;
    }

    if (charset === "") {
      toast.error(t("noCharset"));
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < options.length; i++) {
      generatedPassword += charset.charAt(
        Math.floor(Math.random() * charset.length)
      );
    }

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
  }, [options, toast]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (pwd.length < 8) {
      feedback.push(t("feedbackMin8"));
    } else if (pwd.length >= 12) {
      score += 25;
    } else {
      score += 15;
    }

    // Character variety checks
    if (/[a-z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push(t("feedbackAddLower"));
    }

    if (/[A-Z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push(t("feedbackAddUpper"));
    }

    if (/[0-9]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push(t("feedbackAddNumbers"));
    }

    if (/[^A-Za-z0-9]/.test(pwd)) {
      score += 15;
    } else {
      feedback.push(t("feedbackAddSymbols"));
    }

    // Pattern checks
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      feedback.push(t("feedbackAvoidRepeating"));
    }

    if (/123|abc|qwe|asd|zxc/i.test(pwd)) {
      score -= 10;
      feedback.push(t("feedbackAvoidPatterns"));
    }

    // Common words check (simplified)
    const commonWords = ["password", "123456", "qwerty", "admin", "letmein"];
    if (commonWords.some((word) => pwd.toLowerCase().includes(word))) {
      score -= 20;
      feedback.push(t("feedbackAvoidCommon"));
    }

    // Determine strength level
    let label: string;
    let color: string;

    if (score < 20) {
      label = t("strengthVeryWeak");
      color = "text-red-500";
    } else if (score < 40) {
      label = t("strengthWeak");
      color = "text-orange-500";
    } else if (score < 60) {
      label = t("strengthFair");
      color = "text-yellow-500";
    } else if (score < 80) {
      label = t("strengthGood");
      color = "text-blue-500";
    } else {
      label = t("strengthStrong");
      color = "text-green-500";
    }

    setStrength({
      score: Math.max(0, Math.min(100, score)),
      label,
      color,
      feedback: feedback.length > 0 ? feedback : [t("feedbackLooksGood")],
    });
  };

  const handleClear = () => {
    setPassword("");
    setStrength({
      score: 0,
      label: t("strengthVeryWeak"),
      color: "text-red-500",
      feedback: [],
    });
  };

  const handleOptionChange = (
    key: keyof PasswordOptions,
    value: boolean | number
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const generateMultiplePasswords = (count: number) => {
    const passwords = [];
    for (let i = 0; i < count; i++) {
      generatePassword();
      passwords.push(password);
    }
    return passwords;
  };

  return (
    <ToolShell
      slug="password-generator"
      title={tc("tools.password-generator.name")}
      sub={tc("tools.password-generator.description")}
    >
      <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Options */}
        <SettingsCard
          title={
            <span className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              {t("generatorOptionsTitle")}
            </span>
          }
          description={t("generatorOptionsDesc")}
        >
            {/* Length */}
            <SliderRow
              label={t("lengthLabel", { count: options.length })}
              display=""
              value={options.length}
              min={4}
              max={128}
              onChange={(v) => handleOptionChange("length", v)}
            />

            {/* Character Types */}
            <div className="space-y-4">
              <Label>{t("characterTypes")}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="text-sm">
                    {t("uppercase")}
                  </Label>
                  <Switch
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeUppercase", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="text-sm">
                    {t("lowercase")}
                  </Label>
                  <Switch
                    id="lowercase"
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeLowercase", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="text-sm">
                    {t("numbers")}
                  </Label>
                  <Switch
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeNumbers", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="text-sm">
                    {t("symbols")}
                  </Label>
                  <Switch
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) =>
                      handleOptionChange("includeSymbols", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <Label>{t("advancedOptions")}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exclude-similar" className="text-sm">
                    {t("excludeSimilar")}
                  </Label>
                  <Switch
                    id="exclude-similar"
                    checked={options.excludeSimilar}
                    onCheckedChange={(checked) =>
                      handleOptionChange("excludeSimilar", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="exclude-ambiguous" className="text-sm">
                    {t("excludeAmbiguous")} ({"{}[]()/\\'\"~,;.<>"})
                  </Label>
                  <Switch
                    id="exclude-ambiguous"
                    checked={options.excludeAmbiguous}
                    onCheckedChange={(checked) =>
                      handleOptionChange("excludeAmbiguous", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="w-4 h-4 me-2" />
              {t("generatePassword")}
            </Button>
        </SettingsCard>

        {/* Password Output */}
        <SettingsCard
          title={
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t("generatedPasswordTitle")}
            </span>
          }
          description={t("generatedPasswordDesc")}
        >
            {/* Password Display — kept bespoke: readOnly Input with an exact
                placeholder/value contract the tests assert on; OutputPanel's
                mono <pre> body doesn't carry the same interactive-input
                semantics. */}
            <div className="space-y-2">
              <Label>{t("passwordLabel")}</Label>
              <div className="flex gap-2">
                <Input
                  value={password}
                  readOnly
                  dir="ltr"
                  className="font-mono text-lg bg-muted"
                  placeholder={t("passwordPlaceholder")}
                />
                <CopyButton
                  text={password}
                  size="icon"
                  successMessage={t("copiedToClipboard")}
                  disabled={!password}
                />
              </div>
            </div>

            {/* Feedback */}
            {password && (
              <div className="space-y-2">
                <Label>{t("feedbackLabel")}</Label>
                <ul className="text-sm space-y-1">
                  {strength.feedback.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          item.includes("good") || item.includes("Good") || item.includes("جيدة") || item.includes("ممتازة")
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t("clear")}
              </Button>
            </div>
        </SettingsCard>
      </div>

      {/* Quick Generate */}
      <SettingsCard title={t("quickGenerate")} description={t("quickGenerateDesc")} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setOptions({
                  length: 8,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: false,
                  excludeSimilar: false,
                  excludeAmbiguous: false,
                });
                generatePassword();
              }}
            >
              {t("basicPreset")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOptions({
                  length: 12,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                  excludeSimilar: false,
                  excludeAmbiguous: false,
                });
                generatePassword();
              }}
            >
              {t("standardPreset")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOptions({
                  length: 16,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                  excludeSimilar: true,
                  excludeAmbiguous: true,
                });
                generatePassword();
              }}
            >
              {t("strongPreset")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOptions({
                  length: 24,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                  excludeSimilar: true,
                  excludeAmbiguous: true,
                });
                generatePassword();
              }}
            >
              {t("maximumPreset")}
            </Button>
          </div>
      </SettingsCard>

      {/* Security Tips */}
      <SettingsCard
        title={
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("securityTipsTitle")}
          </span>
        }
        className="mt-6"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                {t("tip1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                {t("tip2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                {t("tip3")}
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                {t("warn1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                {t("warn2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                {t("warn3")}
              </li>
            </ul>
          </div>
      </SettingsCard>
      </div>
    </ToolShell>
  );
}
