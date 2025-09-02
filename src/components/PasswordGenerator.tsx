"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, RotateCcw, RefreshCw, Shield, Lock, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NumberFlow from "@number-flow/react";

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
    label: "Very Weak",
    color: "text-red-500",
    feedback: [],
  });
  const { toast } = useToast();

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
      toast({
        title: "No character set selected",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
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
      feedback.push("Use at least 8 characters");
    } else if (pwd.length >= 12) {
      score += 25;
    } else {
      score += 15;
    }

    // Character variety checks
    if (/[a-z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push("Add lowercase letters");
    }

    if (/[A-Z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push("Add uppercase letters");
    }

    if (/[0-9]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push("Add numbers");
    }

    if (/[^A-Za-z0-9]/.test(pwd)) {
      score += 15;
    } else {
      feedback.push("Add symbols");
    }

    // Pattern checks
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      feedback.push("Avoid repeating characters");
    }

    if (/123|abc|qwe|asd|zxc/i.test(pwd)) {
      score -= 10;
      feedback.push("Avoid common patterns");
    }

    // Common words check (simplified)
    const commonWords = ["password", "123456", "qwerty", "admin", "letmein"];
    if (commonWords.some((word) => pwd.toLowerCase().includes(word))) {
      score -= 20;
      feedback.push("Avoid common words");
    }

    // Determine strength level
    let label: string;
    let color: string;

    if (score < 20) {
      label = "Very Weak";
      color = "text-red-500";
    } else if (score < 40) {
      label = "Weak";
      color = "text-orange-500";
    } else if (score < 60) {
      label = "Fair";
      color = "text-yellow-500";
    } else if (score < 80) {
      label = "Good";
      color = "text-blue-500";
    } else {
      label = "Strong";
      color = "text-green-500";
    }

    setStrength({
      score: Math.max(0, Math.min(100, score)),
      label,
      color,
      feedback: feedback.length > 0 ? feedback : ["Password looks good!"],
    });
  };

  const handleCopy = () => {
    if (!password) {
      toast({
        title: "No password to copy",
        description: "Please generate a password first.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard",
      description: "The password has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    setPassword("");
    setStrength({
      score: 0,
      label: "Very Weak",
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-muted-foreground">
          Generate secure, random passwords with customizable options and
          strength analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Generator Options
            </CardTitle>
            <CardDescription>
              Customize your password generation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length */}
            <div className="space-y-2">
              <Label>
                Length: <NumberFlow value={options.length} /> characters
              </Label>
              <Slider
                min={4}
                max={128}
                step={1}
                value={[options.length]}
                onValueChange={(value) =>
                  handleOptionChange("length", value[0])
                }
                className="w-full"
              />
            </div>

            {/* Character Types */}
            <div className="space-y-4">
              <Label>Character Types</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="text-sm">
                    Uppercase (A-Z)
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
                    Lowercase (a-z)
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
                    Numbers (0-9)
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
                    Symbols (!@#$...)
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
              <Label>Advanced Options</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exclude-similar" className="text-sm">
                    Exclude Similar (il1Lo0O)
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
                    Exclude Ambiguous ({"{}[]()/\\'\"~,;.<>"})
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
          </CardContent>
        </Card>

        {/* Password Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Generated Password
            </CardTitle>
            <CardDescription>
              Your secure password with strength analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Display */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input
                  value={password}
                  readOnly
                  className="font-mono text-lg bg-muted"
                  placeholder="Generated password will appear here..."
                />
                <Button onClick={handleCopy} disabled={!password} size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password Strength</Label>
                  <span className={`font-semibold ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.score < 20
                        ? "bg-red-500"
                        : strength.score < 40
                        ? "bg-orange-500"
                        : strength.score < 60
                        ? "bg-yellow-500"
                        : strength.score < 80
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Score: <NumberFlow value={strength.score} />
                  /100
                </div>
              </div>
            )}

            {/* Feedback */}
            {password && (
              <div className="space-y-2">
                <Label>Feedback</Label>
                <ul className="text-sm space-y-1">
                  {strength.feedback.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          item.includes("good") || item.includes("Good")
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
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Generate */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Generate</CardTitle>
          <CardDescription>
            Generate passwords with common configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              Basic (8 chars)
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
              Standard (12 chars)
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
              Strong (16 chars)
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
              Maximum (24 chars)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Password Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                Use at least 12 characters for better security
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                Include uppercase, lowercase, numbers, and symbols
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                Avoid common words and patterns
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                Don't reuse passwords across accounts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                Don't use personal information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                Don't share passwords with others
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
