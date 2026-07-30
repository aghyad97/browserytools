"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ShieldCheck,
  KeyRound,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";
import { ToolShell } from "@/components/template/tool-shell";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateTotp,
  parseOtpauthUri,
  base32Decode,
  type TotpAlgorithm,
} from "@/lib/totp";
import { useTotpStore, type TotpAccount } from "@/store/totp-store";
import { decodeQrFromImageFile } from "@/lib/qr-decode";

type NewAccount = Omit<TotpAccount, "id">;
type AddSource = "manual" | "uri" | "qr";

interface PendingDuplicate {
  existingId: string;
  next: NewAccount;
  source: AddSource;
}

const RING_RADIUS = 14;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function CountdownRing({
  remaining,
  period,
  label,
}: {
  remaining: number;
  period: number;
  label: string;
}) {
  const offset = (1 - remaining / period) * RING_CIRCUMFERENCE;
  return (
    <div
      className="relative w-10 h-10 shrink-0"
      dir="ltr"
      aria-label={label}
    >
      <svg viewBox="0 0 32 32" className="w-10 h-10 -rotate-90">
        <circle
          cx="16"
          cy="16"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
        />
        <circle
          cx="16"
          cy="16"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
        {remaining}
      </span>
    </div>
  );
}

export default function TotpGenerator() {
  const t = useTranslations("Tools.TotpGenerator");
  const tCommon = useTranslations("Common");
  const tc = useTranslations("ToolsConfig");

  const accounts = useTotpStore((s) => s.accounts);
  const addAccount = useTotpStore((s) => s.addAccount);
  const removeAccount = useTotpStore((s) => s.removeAccount);
  const setPersisted = useTotpStore((s) => s.setPersisted);
  const replaceAccount = useTotpStore((s) => s.replaceAccount);

  // ---- Live codes ----
  const [now, setNow] = useState(() => Date.now());
  const [codes, setCodes] = useState<Record<string, string>>({});
  const stepsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const a of accounts) {
        const step = Math.floor(now / 1000 / a.period);
        if (stepsRef.current[a.id] !== step) {
          stepsRef.current[a.id] = step;
          const code = await generateTotp(a, now);
          if (!cancelled) {
            setCodes((prev) => ({ ...prev, [a.id]: code }));
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accounts, now]);

  // ---- Delete confirm ----
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---- Duplicate handling ----
  const [pendingDuplicate, setPendingDuplicate] =
    useState<PendingDuplicate | null>(null);

  function mapOtpauthError(err: unknown): string {
    const message = err instanceof Error ? err.message : "";
    switch (message) {
      case "not-otpauth":
        return t("errNotOtpauth");
      case "hotp-unsupported":
        return t("errHotp");
      case "migration-unsupported":
        return t("errMigration");
      case "missing-secret":
        return t("errMissingSecret");
      case "invalid-base32":
        return t("invalidSecret");
      default:
        return t("errNotOtpauth");
    }
  }

  function tryAddAccount(next: NewAccount, source: AddSource) {
    const existing = accounts.find(
      (a) => a.secret === next.secret && a.label === next.label
    );
    if (existing) {
      setPendingDuplicate({ existingId: existing.id, next, source });
      return;
    }
    addAccount(next);
    toast.success(t("accountAdded"));
    if (source === "manual") resetManualForm();
    if (source === "uri") resetUriForm();
    if (source === "qr") resetQrForm();
  }

  function finishDuplicate() {
    const source = pendingDuplicate?.source;
    setPendingDuplicate(null);
    if (source === "manual") resetManualForm();
    if (source === "uri") resetUriForm();
    if (source === "qr") resetQrForm();
  }

  function resolveReplace() {
    if (!pendingDuplicate) return;
    replaceAccount(pendingDuplicate.existingId, pendingDuplicate.next);
    toast.success(t("accountAdded"));
    finishDuplicate();
  }

  function resolveKeepBoth() {
    if (!pendingDuplicate) return;
    addAccount(pendingDuplicate.next);
    toast.success(t("accountAdded"));
    finishDuplicate();
  }

  // ---- Manual tab ----
  const [manualLabel, setManualLabel] = useState("");
  const [manualIssuer, setManualIssuer] = useState("");
  const [manualSecret, setManualSecret] = useState("");
  const [manualDigits, setManualDigits] = useState<6 | 8>(6);
  const [manualPeriod, setManualPeriod] = useState<30 | 60>(30);
  const [manualAlgorithm, setManualAlgorithm] =
    useState<TotpAlgorithm>("SHA-1");
  const [manualAdvanced, setManualAdvanced] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  function resetManualForm() {
    setManualLabel("");
    setManualIssuer("");
    setManualSecret("");
    setManualDigits(6);
    setManualPeriod(30);
    setManualAlgorithm("SHA-1");
    setManualAdvanced(false);
    setManualError(null);
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setManualError(null);
    if (!manualLabel.trim() || !manualSecret.trim()) return;
    try {
      base32Decode(manualSecret.trim());
    } catch {
      setManualError(t("invalidSecret"));
      return;
    }
    tryAddAccount(
      {
        label: manualLabel.trim(),
        issuer: manualIssuer.trim() || undefined,
        secret: manualSecret.trim(),
        algorithm: manualAlgorithm,
        digits: manualDigits,
        period: manualPeriod,
        persisted: false,
      },
      "manual"
    );
  }

  // ---- URI tab ----
  const [uriValue, setUriValue] = useState("");
  const [uriError, setUriError] = useState<string | null>(null);

  function resetUriForm() {
    setUriValue("");
    setUriError(null);
  }

  function handleUriSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUriError(null);
    try {
      const parsed = parseOtpauthUri(uriValue);
      tryAddAccount({ ...parsed, persisted: false }, "uri");
    } catch (err) {
      setUriError(mapOtpauthError(err));
    }
  }

  // ---- QR tab ----
  const [qrError, setQrError] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  function resetQrForm() {
    setQrError(null);
  }

  async function handleQrFile(file: File) {
    setQrError(null);
    let payload: string | null;
    try {
      payload = await decodeQrFromImageFile(file);
    } catch {
      setQrError(t("errImageDecode"));
      return;
    }
    if (!payload) {
      setQrError(t("errNoQr"));
      return;
    }
    try {
      const parsed = parseOtpauthUri(payload);
      tryAddAccount({ ...parsed, persisted: false }, "qr");
    } catch (err) {
      setQrError(mapOtpauthError(err));
    }
  }

  return (
    <ToolShell
      slug="totp-generator"
      title={tc("tools.totp-generator.name")}
      sub={tc("tools.totp-generator.description")}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 bg-muted/30 rounded-lg border p-4">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">{t("trustBanner")}</p>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-foreground">{t("emptyTitle")}</p>
            <p className="text-sm">{t("emptyHint")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const code = codes[account.id] ?? "";
              const half = Math.ceil(account.digits / 2);
              const formattedCode = code
                ? `${code.slice(0, half)} ${code.slice(half)}`
                : "";
              const remaining =
                account.period - (Math.floor(now / 1000) % account.period);

              return (
                <div
                  key={account.id}
                  className="flex items-center gap-4 bg-muted/30 rounded-lg border p-4"
                >
                  <CountdownRing
                    remaining={remaining}
                    period={account.period}
                    label={`${remaining} ${t("secondsLeft")}`}
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="min-w-0">
                      {account.issuer && (
                        <p className="text-xs text-muted-foreground truncate">
                          {account.issuer}
                        </p>
                      )}
                      <p className="font-medium truncate">{account.label}</p>
                    </div>
                    <span
                      className="font-mono text-2xl tracking-widest"
                      dir="ltr"
                    >
                      {formattedCode}
                    </span>

                    {deletingId === account.id ? (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-muted-foreground">
                          {t("deleteConfirm")}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            removeAccount(account.id);
                            setDeletingId(null);
                          }}
                        >
                          {t("confirm")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingId(null)}
                        >
                          {t("cancel")}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`totp-persist-${account.id}`}
                            checked={account.persisted}
                            onCheckedChange={(checked) =>
                              setPersisted(account.id, checked)
                            }
                            data-testid="totp-persist-toggle"
                          />
                          <label
                            htmlFor={`totp-persist-${account.id}`}
                            className="text-sm"
                          >
                            {t("persistToggle")}
                          </label>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingId(account.id)}
                        >
                          <Trash2 className="w-4 h-4 me-1" />
                          {t("deleteAccount")}
                        </Button>
                      </div>
                    )}
                    {deletingId !== account.id && (
                      <p className="text-xs text-muted-foreground">
                        {t("persistWarning")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={tCommon("copy")}
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      toast.success(t("copied"));
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <SettingsCard title={t("addAccount")}>
          {pendingDuplicate && (
            <div className="bg-muted/30 rounded-lg border p-4 space-y-3">
              <p className="text-sm">{t("duplicatePrompt")}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={resolveReplace}>
                  {t("replace")}
                </Button>
                <Button size="sm" variant="outline" onClick={resolveKeepBoth}>
                  {t("keepBoth")}
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="manual">
            <TabsList>
              <TabsTrigger value="manual">{t("tabManual")}</TabsTrigger>
              <TabsTrigger value="uri">{t("tabUri")}</TabsTrigger>
              <TabsTrigger value="qr">{t("tabQr")}</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <OptionRow label={t("labelLabel")} htmlFor="totp-label">
                  <Input
                    id="totp-label"
                    value={manualLabel}
                    onChange={(e) => setManualLabel(e.target.value)}
                    placeholder={t("labelPlaceholder")}
                    required
                  />
                </OptionRow>
                <OptionRow label={t("issuerLabel")} htmlFor="totp-issuer">
                  <Input
                    id="totp-issuer"
                    value={manualIssuer}
                    onChange={(e) => setManualIssuer(e.target.value)}
                    placeholder={t("issuerPlaceholder")}
                  />
                </OptionRow>
                <OptionRow label={t("secretLabel")} htmlFor="totp-secret">
                  <Input
                    id="totp-secret"
                    value={manualSecret}
                    onChange={(e) => setManualSecret(e.target.value)}
                    placeholder={t("secretPlaceholder")}
                    dir="ltr"
                    required
                  />
                </OptionRow>

                {manualError && (
                  <p className="text-sm text-destructive">{manualError}</p>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={() => setManualAdvanced((v) => !v)}
                >
                  {manualAdvanced ? (
                    <ChevronDown className="w-4 h-4 me-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 me-1" />
                  )}
                  {t("advanced")}
                </Button>

                {manualAdvanced && (
                  <div className="space-y-4">
                    <OptionRow label={t("digits")} htmlFor="totp-digits">
                      <Select
                        value={String(manualDigits)}
                        onValueChange={(v) =>
                          setManualDigits(v === "8" ? 8 : 6)
                        }
                      >
                        <SelectTrigger id="totp-digits">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </OptionRow>
                    <OptionRow label={t("period")} htmlFor="totp-period">
                      <Select
                        value={String(manualPeriod)}
                        onValueChange={(v) =>
                          setManualPeriod(v === "60" ? 60 : 30)
                        }
                      >
                        <SelectTrigger id="totp-period">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="60">60</SelectItem>
                        </SelectContent>
                      </Select>
                    </OptionRow>
                    <OptionRow label={t("algorithm")} htmlFor="totp-algorithm">
                      <Select
                        value={manualAlgorithm}
                        onValueChange={(v) =>
                          setManualAlgorithm(v as TotpAlgorithm)
                        }
                      >
                        <SelectTrigger id="totp-algorithm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHA-1">SHA-1</SelectItem>
                          <SelectItem value="SHA-256">SHA-256</SelectItem>
                          <SelectItem value="SHA-512">SHA-512</SelectItem>
                        </SelectContent>
                      </Select>
                    </OptionRow>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  {t("add")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="uri" className="space-y-4">
              <form onSubmit={handleUriSubmit} className="space-y-4">
                <OptionRow label={t("uriLabel")} htmlFor="totp-uri">
                  <Textarea
                    id="totp-uri"
                    value={uriValue}
                    onChange={(e) => setUriValue(e.target.value)}
                    placeholder={t("uriPlaceholder")}
                    dir="ltr"
                  />
                </OptionRow>
                {uriError && (
                  <p className="text-sm text-destructive">{uriError}</p>
                )}
                <Button type="submit" className="w-full">
                  {t("add")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("qrHint")}</p>
              <input
                ref={qrInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleQrFile(file);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => qrInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 me-2" />
                {t("chooseImage")}
              </Button>
              {qrError && (
                <p className="text-sm text-destructive">{qrError}</p>
              )}
            </TabsContent>
          </Tabs>
        </SettingsCard>
      </div>
    </ToolShell>
  );
}
