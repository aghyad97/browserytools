"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Copy, Lock, Unlock, RefreshCw, Trash2, Shield, Info, KeyRound } from "lucide-react";
import { toast } from "sonner";

// ---- Crypto helpers ----

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" } as Pbkdf2Params,
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const combined = new Uint8Array(16 + 12 + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(ciphertext), 28);
  return toBase64(combined.buffer);
}

async function decryptText(encrypted: string, password: string): Promise<string> {
  const combined = fromBase64(encrypted.trim());
  if (combined.length < 29) throw new Error("Invalid encrypted data");
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

function generateRandomKey(length = 24): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const arr = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}
export default function TextEncryption() {
  const t = useTranslations("Tools.TextEncryption");
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch { toast.error(t("failedToCopy")); }
  }, [t]);
  const doEncrypt = async () => {
    if (!inputText.trim()) { toast.error(t("enterTextToEncrypt")); return; }
    if (!password) { toast.error(t("enterEncryptionPassword")); return; }
    setIsProcessing(true); setError(null);
    try {
      const result = await encryptText(inputText, password);
      setOutputText(result);
      toast.success(t("encryptedSuccess"));
    } catch (e) {
      const msg = (e instanceof Error ? e.message : t("encryptionFailed"));
      setError(msg); toast.error(t("encryptionFailed"));
    } finally { setIsProcessing(false); }
  };

  const doDecrypt = async () => {
    if (!inputText.trim()) { toast.error(t("enterTextToDecrypt")); return; }
    if (!password) { toast.error(t("enterDecryptionPassword")); return; }
    setIsProcessing(true); setError(null);
    try {
      const result = await decryptText(inputText, password);
      setOutputText(result);
      toast.success(t("decryptedSuccess"));
    } catch {
      const msg = t("decryptionFailed");
      setError(msg); toast.error(msg);
    } finally { setIsProcessing(false); }
  };

  const doClear = () => { setInputText(""); setOutputText(""); setError(null); };
  const doGenerateKey = () => {
    setPassword(generateRandomKey(24));
    setShowPassword(true);
    toast.success(t("randomKeyGenerated"));
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Security note */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          {t("securityNote")}
        </AlertDescription>
      </Alert>
      {/* Password input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {t("encryptionKeyTitle")}
          </CardTitle>
          <CardDescription>
            {t("encryptionKeyDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="enc-password">{t("passwordKeyLabel")}</Label>
            <div className="relative">
              <Input
                id="enc-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="pr-10 font-mono"
                dir="ltr"
                autoComplete="off"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowPassword((v) => !v)} type="button">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={doGenerateKey} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("generateRandomKey")}
          </Button>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>{t("algorithmInfo")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>{t("kdfInfo")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Main input/output */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("textEncryptionTitle")}
          </CardTitle>
          <CardDescription>
            {t("textEncryptionDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enc-input">{t("inputTextLabel")}</Label>
            <Textarea
              id="enc-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t("inputTextPlaceholder")}
              className="min-h-[120px] font-mono text-sm"
              dir="ltr"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-wrap gap-2">
            <Button onClick={doEncrypt} disabled={isProcessing} className="gap-2">
              <Lock className="h-4 w-4" />
              {isProcessing ? t("processing") : t("encrypt")}
            </Button>
            <Button onClick={doDecrypt} disabled={isProcessing} variant="outline" className="gap-2">
              <Unlock className="h-4 w-4" />
              {t("decrypt")}
            </Button>
            <Button onClick={doClear} variant="ghost" className="gap-2">
              <Trash2 className="h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
          {outputText && (
            <div className="space-y-2">
              <Label>{t("outputLabel")}</Label>
              <div className="relative">
                <Textarea
                  value={outputText}
                  readOnly
                  dir="ltr"
                  className="min-h-[120px] font-mono text-sm bg-muted pr-12"
                />
                <Button
                  variant="ghost" size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => copyToClipboard(outputText)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}