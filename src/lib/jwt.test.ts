import { describe, expect, it } from "vitest";
import { parseIdentityToken } from "./jwt";

function encodePayload(payload: Record<string, unknown>): string {
  const encoded = btoa(JSON.stringify(payload))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  return `header.${encoded}.signature`;
}

describe("parseIdentityToken", () => {
  it("parses a full token with all standard fields", () => {
    const payload = {
      username: "alice",
      sub: "user-42",
      email: "alice@example.com",
      isVerified: true,
      needsPasswordSetup: false,
      isMfaEnabled: true,
      tier: "PLUS",
      maxSubdomainCount: 5,
      iat: 1700000000,
      exp: 1700003600,
    };

    const result = parseIdentityToken(encodePayload(payload));

    expect(result).toEqual({
      username: "alice",
      email: "alice@example.com",
      subject: "user-42",
      isVerified: true,
      needsPasswordSetup: false,
      isMfaEnabled: true,
      tier: "PLUS",
      maxSubdomainCount: 5,
      issuedAt: 1700000000,
      expiresAt: 1700003600,
      claims: payload,
    });
  });

  it("resolves email from upn when email field is absent", () => {
    const payload = { upn: "bob@corp.com", sub: "user-99" };

    const result = parseIdentityToken(encodePayload(payload));

    expect(result?.email).toBe("bob@corp.com");
  });

  it("prefers email over upn when both are present", () => {
    const payload = { email: "primary@example.com", upn: "upn@corp.com" };

    const result = parseIdentityToken(encodePayload(payload));

    expect(result?.email).toBe("primary@example.com");
  });

  it("returns null email when neither email nor upn is present", () => {
    const result = parseIdentityToken(encodePayload({ sub: "anon" }));

    expect(result?.email).toBeNull();
  });

  it("defaults needsPasswordSetup to false when not present", () => {
    const result = parseIdentityToken(encodePayload({ sub: "u1" }));

    expect(result?.needsPasswordSetup).toBe(false);
  });

  it("defaults isMfaEnabled to false when not present", () => {
    const result = parseIdentityToken(encodePayload({ sub: "u1" }));

    expect(result?.isMfaEnabled).toBe(false);
  });

  it("defaults username and subject to null when not present", () => {
    const result = parseIdentityToken(encodePayload({}));

    expect(result?.username).toBeNull();
    expect(result?.subject).toBeNull();
  });

  it("rejects unknown tier values and returns null for tier", () => {
    const result = parseIdentityToken(encodePayload({ tier: "ENTERPRISE" }));

    expect(result?.tier).toBeNull();
  });

  it("accepts FREE and PLUS as valid tiers", () => {
    expect(parseIdentityToken(encodePayload({ tier: "FREE" }))?.tier).toBe(
      "FREE",
    );
    expect(parseIdentityToken(encodePayload({ tier: "PLUS" }))?.tier).toBe(
      "PLUS",
    );
  });

  it("returns null maxSubdomainCount when the field is not a number", () => {
    const result = parseIdentityToken(
      encodePayload({ maxSubdomainCount: "5" }),
    );

    expect(result?.maxSubdomainCount).toBeNull();
  });

  it("returns null for a token with fewer than three parts", () => {
    expect(parseIdentityToken("onlyone")).toBeNull();
    expect(parseIdentityToken("header.payload")).toBeNull();
  });

  it("returns null for a token whose payload is not valid base64 JSON", () => {
    expect(parseIdentityToken("header.!!!invalid!!!.sig")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseIdentityToken("")).toBeNull();
  });
});
