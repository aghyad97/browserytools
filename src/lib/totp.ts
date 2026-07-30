/**
 * RFC 6238 TOTP over native WebCrypto — zero dependencies.
 * Secrets never leave this module's call stack; nothing is logged or fetched.
 */
export type TotpAlgorithm = "SHA-1" | "SHA-256" | "SHA-512";

export interface TotpParams {
  secret: string; // base32
  algorithm: TotpAlgorithm;
  digits: 6 | 8;
  period: number; // seconds
}

export interface ParsedOtpauth extends TotpParams {
  label: string;
  issuer?: string;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s-]/g, "").replace(/=+$/, "");
  if (clean.length === 0) throw new Error("invalid-base32");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error("invalid-base32");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  if (out.length === 0) throw new Error("invalid-base32");
  return new Uint8Array(out);
}

export async function generateTotp(
  params: TotpParams,
  timestampMs: number = Date.now()
): Promise<string> {
  const { secret, algorithm, digits, period } = params;
  const keyBytes = base32Decode(secret);
  const counter = Math.floor(timestampMs / 1000 / period);
  const msg = new Uint8Array(8);
  // 8-byte big-endian counter; JS bitwise ops are 32-bit, so use division
  // for the high word instead of >> 32.
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(binCode % 10 ** digits).padStart(digits, "0");
}

const ALGORITHM_MAP: Record<string, TotpAlgorithm> = {
  SHA1: "SHA-1",
  SHA256: "SHA-256",
  SHA512: "SHA-512",
  "SHA-1": "SHA-1",
  "SHA-256": "SHA-256",
  "SHA-512": "SHA-512",
};

export function parseOtpauthUri(uri: string): ParsedOtpauth {
  const trimmed = uri.trim();
  if (trimmed.toLowerCase().startsWith("otpauth-migration://")) {
    throw new Error("migration-unsupported");
  }
  if (!trimmed.toLowerCase().startsWith("otpauth://")) {
    throw new Error("not-otpauth");
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("not-otpauth");
  }
  const type = url.host.toLowerCase();
  if (type === "hotp") throw new Error("hotp-unsupported");
  if (type !== "totp") throw new Error("not-otpauth");

  const secret = url.searchParams.get("secret");
  if (!secret) throw new Error("missing-secret");
  base32Decode(secret); // validate early — throws invalid-base32

  let rawLabel: string;
  try {
    rawLabel = decodeURIComponent(url.pathname.replace(/^\//, ""));
  } catch {
    throw new Error("not-otpauth");
  }
  const colonIdx = rawLabel.indexOf(":");
  const labelIssuer = colonIdx >= 0 ? rawLabel.slice(0, colonIdx).trim() : undefined;
  const label = (colonIdx >= 0 ? rawLabel.slice(colonIdx + 1) : rawLabel).trim();
  const issuer = url.searchParams.get("issuer") ?? labelIssuer;

  const algorithm =
    ALGORITHM_MAP[(url.searchParams.get("algorithm") ?? "SHA1").toUpperCase()] ??
    "SHA-1";
  const digitsParam = Number(url.searchParams.get("digits") ?? 6);
  const digits: 6 | 8 = digitsParam === 8 ? 8 : 6;
  const periodParam = Number(url.searchParams.get("period") ?? 30);
  const period =
    Number.isFinite(periodParam) && periodParam > 0 ? periodParam : 30;

  return { label, issuer: issuer || undefined, secret, algorithm, digits, period };
}
