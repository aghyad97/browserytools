"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { ToolShell } from "@/components/template/tool-shell";
import { CopyButton } from "@/components/shared/CopyButton";
import { SettingsCard, OptionRow } from "@/components/shared/SettingsCard";
import { OutputPanel } from "@/components/shared/OutputPanel";

interface JWTPayload {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  errors: string[];
  expiration?: Date;
  issuedAt?: Date;
  notBefore?: Date;
}

export default function JWTDecoder() {
  const t = useTranslations("Tools.JWTDecoder");
  const tc = useTranslations("ToolsConfig");
  const [jwtToken, setJwtToken] = useState<string>("");
  const [decodedJWT, setDecodedJWT] = useState<JWTPayload | null>(null);
  const [showSignature, setShowSignature] = useState<boolean>(false);

  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    str += "=".repeat((4 - (str.length % 4)) % 4);
    // Replace URL-safe characters
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    try {
      return atob(str);
    } catch (error) {
      throw new Error("Invalid base64 encoding");
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const isTokenExpired = (exp: number): boolean => {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  };

  const isTokenNotYetValid = (nbf: number): boolean => {
    const now = Math.floor(Date.now() / 1000);
    return nbf > now;
  };

  const decodeJWT = (token: string): JWTPayload => {
    const errors: string[] = [];
    let isValid = true;

    try {
      // Split the JWT into its three parts
      const parts = token.split(".");

      if (parts.length !== 3) {
        errors.push("JWT must have exactly 3 parts separated by dots");
        isValid = false;
        return {
          header: {},
          payload: {},
          signature: "",
          isValid: false,
          errors,
        };
      }

      const [headerPart, payloadPart, signaturePart] = parts;

      // Decode header
      let header: any = {};
      try {
        const headerJson = base64UrlDecode(headerPart);
        header = JSON.parse(headerJson);
      } catch (error) {
        errors.push("Invalid header encoding or JSON");
        isValid = false;
      }

      // Decode payload
      let payload: any = {};
      try {
        const payloadJson = base64UrlDecode(payloadPart);
        payload = JSON.parse(payloadJson);
      } catch (error) {
        errors.push("Invalid payload encoding or JSON");
        isValid = false;
      }

      // Validate standard claims
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && isTokenExpired(payload.exp)) {
        errors.push("Token has expired");
        isValid = false;
      }

      if (payload.nbf && isTokenNotYetValid(payload.nbf)) {
        errors.push("Token is not yet valid (nbf)");
        isValid = false;
      }

      if (payload.iat && payload.iat > now + 60) {
        // Allow 1 minute tolerance
        errors.push("Token issued in the future (iat)");
        isValid = false;
      }

      return {
        header,
        payload,
        signature: signaturePart,
        isValid,
        errors,
        expiration: payload.exp ? new Date(payload.exp * 1000) : undefined,
        issuedAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
        notBefore: payload.nbf ? new Date(payload.nbf * 1000) : undefined,
      };
    } catch (error) {
      errors.push("Failed to decode JWT");
      return {
        header: {},
        payload: {},
        signature: "",
        isValid: false,
        errors,
      };
    }
  };

  const handleDecode = () => {
    if (!jwtToken.trim()) {
      toast.error(t("emptyToken"));
      return;
    }

    const result = decodeJWT(jwtToken.trim());
    setDecodedJWT(result);

    if (result.isValid) {
      toast.success(t("decodedSuccess"));
    } else {
      toast.error(t("decodedFailed"));
    }
  };

  const clearAll = () => {
    setJwtToken("");
    setDecodedJWT(null);
  };

  const loadSampleJWT = () => {
    // Sample JWT for demonstration (expired token)
    const sampleJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setJwtToken(sampleJWT);
  };

  return (
    <ToolShell
      slug="jwt-decoder"
      title={tc("tools.jwt-decoder.name")}
      sub={tc("tools.jwt-decoder.description")}
    >
      <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <SettingsCard
          title={
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("inputTitle")}
            </span>
          }
          description={t("inputDesc")}
        >
            <OptionRow label={t("jwtTokenLabel")} htmlFor="jwt-input">
              <Textarea
                id="jwt-input"
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder={t("jwtTokenPlaceholder")}
                dir="ltr"
                className="min-h-[120px] font-mono text-sm"
              />
            </OptionRow>

            <div className="flex gap-2">
              <Button onClick={handleDecode} className="flex-1">
                {t("decodeJWT")}
              </Button>
              <Button onClick={loadSampleJWT} variant="outline">
                {t("loadSample")}
              </Button>
              <Button onClick={clearAll} variant="outline">
                {t("clear")}
              </Button>
            </div>

            {jwtToken && (
              <div className="text-xs text-muted-foreground" dir="ltr">
                {t("tokenLength", { count: jwtToken.length })}
              </div>
            )}
        </SettingsCard>

        {/* Validation Status */}
        <SettingsCard title={t("validationStatus")}>
            {decodedJWT ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {decodedJWT.isValid ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-green-600">
                        {t("validJWT")}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-600">
                        {t("invalidJWT")}
                      </span>
                    </>
                  )}
                </div>

                {decodedJWT.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {decodedJWT.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {decodedJWT.expiration && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">{t("tokenTimeline")}</h4>
                    <div className="space-y-1 text-sm">
                      {decodedJWT.issuedAt && (
                        <div className="flex justify-between">
                          <span>{t("issuedAt")}</span>
                          <span dir="ltr">
                            {formatTimestamp(
                              decodedJWT.issuedAt.getTime() / 1000
                            )}
                          </span>
                        </div>
                      )}
                      {decodedJWT.notBefore && (
                        <div className="flex justify-between">
                          <span>{t("notBefore")}</span>
                          <span dir="ltr">
                            {formatTimestamp(
                              decodedJWT.notBefore.getTime() / 1000
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{t("expires")}</span>
                        <span
                          dir="ltr"
                          className={
                            isTokenExpired(
                              decodedJWT.expiration.getTime() / 1000
                            )
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {formatTimestamp(
                            decodedJWT.expiration.getTime() / 1000
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>{t("enterTokenPrompt")}</p>
              </div>
            )}
        </SettingsCard>
      </div>

      {/* Decoded Content */}
      {decodedJWT && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Header */}
          <OutputPanel
            title={t("header")}
            text={JSON.stringify(decodedJWT.header, null, 2)}
            copySuccessMessage={t("copiedToClipboard")}
            copyErrorMessage={t("copyFailed")}
          >
            <>
              <pre className="text-xs p-3 max-h-60" dir="ltr">
                {JSON.stringify(decodedJWT.header, null, 2)}
              </pre>
              <div className="px-3 pb-3 flex flex-wrap gap-1">
                {decodedJWT.header.alg && (
                  <Badge variant="outline">
                    {t("algorithm")} {decodedJWT.header.alg}
                  </Badge>
                )}
                {decodedJWT.header.typ && (
                  <Badge variant="outline">{t("type")} {decodedJWT.header.typ}</Badge>
                )}
              </div>
            </>
          </OutputPanel>

          {/* Payload */}
          <OutputPanel
            title={t("payload")}
            text={JSON.stringify(decodedJWT.payload, null, 2)}
            copySuccessMessage={t("copiedToClipboard")}
            copyErrorMessage={t("copyFailed")}
          >
            <>
              <pre className="text-xs p-3 max-h-60" dir="ltr">
                {JSON.stringify(decodedJWT.payload, null, 2)}
              </pre>
              <div className="px-3 pb-3 flex flex-wrap gap-1">
                {decodedJWT.payload.sub && (
                  <Badge variant="outline">
                    {t("subject")} {decodedJWT.payload.sub}
                  </Badge>
                )}
                {decodedJWT.payload.iss && (
                  <Badge variant="outline">
                    {t("issuer")} {decodedJWT.payload.iss}
                  </Badge>
                )}
                {decodedJWT.payload.aud && (
                  <Badge variant="outline">
                    {t("audience")} {decodedJWT.payload.aud}
                  </Badge>
                )}
              </div>
            </>
          </OutputPanel>

          {/* Signature — kept bespoke: needs an extra show/hide toggle button
              in the header alongside copy, which OutputPanel's API has no
              slot for. */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("signature")}
                <div className="flex gap-1">
                  <Button
                    onClick={() => setShowSignature(!showSignature)}
                    variant="ghost"
                    size="sm"
                  >
                    {showSignature ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <CopyButton
                    text={decodedJWT.signature}
                    size="icon"
                    successMessage={t("copiedToClipboard")}
                    errorMessage={t("copyFailed")}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs bg-muted p-3 rounded font-mono break-all" dir="ltr">
                {showSignature
                  ? decodedJWT.signature
                  : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {t("signatureLength", { count: decodedJWT.signature.length })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* JWT Information */}
      <SettingsCard title={t("jwtInformation")} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">{t("standardClaims")}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>iss:</strong> {t("claimIss")}
                </li>
                <li>
                  <strong>sub:</strong> {t("claimSub")}
                </li>
                <li>
                  <strong>aud:</strong> {t("claimAud")}
                </li>
                <li>
                  <strong>exp:</strong> {t("claimExp")}
                </li>
                <li>
                  <strong>nbf:</strong> {t("claimNbf")}
                </li>
                <li>
                  <strong>iat:</strong> {t("claimIat")}
                </li>
                <li>
                  <strong>jti:</strong> {t("claimJti")}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t("securityNotes")}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("secNote1")}</li>
                <li>• {t("secNote2")}</li>
                <li>• {t("secNote3")}</li>
                <li>• {t("secNote4")}</li>
                <li>• {t("secNote5")}</li>
              </ul>
            </div>
          </div>
      </SettingsCard>
      </div>
    </ToolShell>
  );
}
