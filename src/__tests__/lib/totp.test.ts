import { describe, it, expect } from "vitest";
import {
  base32Decode,
  generateTotp,
  parseOtpauthUri,
  type TotpAlgorithm,
} from "@/lib/totp";

// RFC 4648 §6 encoder — test-local helper so RFC 6238 seeds can be fed to the
// base32-only public API without hand-computed constants.
function base32Encode(bytes: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}
const ascii = (s: string) => new TextEncoder().encode(s);

describe("base32Decode", () => {
  it("decodes RFC 4648 test vectors", () => {
    expect(new TextDecoder().decode(base32Decode("MZXW6==="))).toBe("foo");
    expect(new TextDecoder().decode(base32Decode("MZXW6YTBOI======"))).toBe(
      "foobar"
    );
  });
  it("is case-insensitive and ignores spaces/hyphens/padding", () => {
    expect(new TextDecoder().decode(base32Decode("mzxw 6ytb-oi"))).toBe(
      "foobar"
    );
  });
  it("throws invalid-base32 on illegal characters", () => {
    expect(() => base32Decode("MZXW1")).toThrow("invalid-base32"); // '1' not in alphabet
    expect(() => base32Decode("")).toThrow("invalid-base32");
  });
});

describe("generateTotp — RFC 6238 Appendix B vectors", () => {
  // Seeds per the RFC: 20 bytes for SHA-1, 32 for SHA-256, 64 for SHA-512.
  const seed20 = base32Encode(ascii("12345678901234567890"));
  const seed32 = base32Encode(ascii("12345678901234567890123456789012"));
  const seed64 = base32Encode(
    ascii(
      "1234567890123456789012345678901234567890123456789012345678901234"
    )
  );
  const cases: Array<[number, TotpAlgorithm, string, string]> = [
    [59, "SHA-1", seed20, "94287082"],
    [59, "SHA-256", seed32, "46119246"],
    [59, "SHA-512", seed64, "90693936"],
    [1111111109, "SHA-1", seed20, "07081804"],
    [1234567890, "SHA-256", seed32, "91819424"],
    [2000000000, "SHA-512", seed64, "38618901"],
  ];
  it.each(cases)("T=%s %s → %s", async (t, algorithm, secret, expected) => {
    const code = await generateTotp(
      { secret, algorithm, digits: 8, period: 30 },
      t * 1000
    );
    expect(code).toBe(expected);
  });
  it("produces 6-digit zero-padded codes by default params", async () => {
    const code = await generateTotp(
      { secret: seed20, algorithm: "SHA-1", digits: 6, period: 30 },
      59 * 1000
    );
    expect(code).toBe("287082");
    expect(code).toHaveLength(6);
  });
});

describe("parseOtpauthUri", () => {
  it("parses a full URI", () => {
    const p = parseOtpauthUri(
      "otpauth://totp/GitHub:octocat?secret=MZXW6YTBOI&issuer=GitHub&algorithm=SHA256&digits=8&period=60"
    );
    expect(p).toEqual({
      label: "octocat",
      issuer: "GitHub",
      secret: "MZXW6YTBOI",
      algorithm: "SHA-256",
      digits: 8,
      period: 60,
    });
  });
  it("applies defaults SHA-1 / 6 digits / 30s and splits Issuer:label", () => {
    const p = parseOtpauthUri("otpauth://totp/ACME%3Auser%40x.com?secret=MZXW6YTBOI");
    expect(p.issuer).toBe("ACME");
    expect(p.label).toBe("user@x.com");
    expect(p.algorithm).toBe("SHA-1");
    expect(p.digits).toBe(6);
    expect(p.period).toBe(30);
  });
  it("rejects hotp, migration, non-otpauth, and missing secret", () => {
    expect(() => parseOtpauthUri("otpauth://hotp/x?secret=MZXW6YTBOI&counter=0")).toThrow("hotp-unsupported");
    expect(() => parseOtpauthUri("otpauth-migration://offline?data=abc")).toThrow("migration-unsupported");
    expect(() => parseOtpauthUri("https://example.com")).toThrow("not-otpauth");
    expect(() => parseOtpauthUri("otpauth://totp/x")).toThrow("missing-secret");
  });
});
