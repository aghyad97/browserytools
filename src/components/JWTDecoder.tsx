"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copiedToClipboard"));
    } catch (err) {
      toast.error(t("copyFailed"));
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("inputTitle")}
            </CardTitle>
            <CardDescription>
              {t("inputDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jwt-input">{t("jwtTokenLabel")}</Label>
              <Textarea
                id="jwt-input"
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder={t("jwtTokenPlaceholder")}
                dir="ltr"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

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
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t("validationStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Decoded Content */}
      {decodedJWT && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("header")}
                <Button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(decodedJWT.header, null, 2))
                  }
                  variant="ghost"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60" dir="ltr">
                {JSON.stringify(decodedJWT.header, null, 2)}
              </pre>
              <div className="mt-2 flex flex-wrap gap-1">
                {decodedJWT.header.alg && (
                  <Badge variant="outline">
                    {t("algorithm")} {decodedJWT.header.alg}
                  </Badge>
                )}
                {decodedJWT.header.typ && (
                  <Badge variant="outline">{t("type")} {decodedJWT.header.typ}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("payload")}
                <Button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(decodedJWT.payload, null, 2))
                  }
                  variant="ghost"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60" dir="ltr">
                {JSON.stringify(decodedJWT.payload, null, 2)}
              </pre>
              <div className="mt-2 flex flex-wrap gap-1">
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
            </CardContent>
          </Card>

          {/* Signature */}
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
                  <Button
                    onClick={() => copyToClipboard(decodedJWT.signature)}
                    variant="ghost"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("jwtInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
