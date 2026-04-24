import type { AuthUser } from "@/store/auth-slice";

export function parseIdentityToken(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as {
      username?: string;
      sub?: string;
      email?: string;
      isVerified?: boolean;
      needsPasswordSetup?: boolean;
      tier?: string;
      maxSubdomainCount?: number;
      iat?: number;
      exp?: number;
      [key: string]: unknown;
    };

    return {
      username: decoded.username ?? null,
      email:
        typeof decoded.email === "string"
          ? decoded.email
          : typeof decoded.upn === "string"
            ? decoded.upn
            : null,
      subject: decoded.sub ?? null,
      isVerified: decoded.isVerified ?? null,
      needsPasswordSetup: decoded.needsPasswordSetup === true,
      tier:
        decoded.tier === "PLUS" || decoded.tier === "FREE"
          ? decoded.tier
          : null,
      maxSubdomainCount:
        typeof decoded.maxSubdomainCount === "number"
          ? decoded.maxSubdomainCount
          : null,
      issuedAt: typeof decoded.iat === "number" ? decoded.iat : null,
      expiresAt: typeof decoded.exp === "number" ? decoded.exp : null,
      claims: decoded,
    };
  } catch {
    return null;
  }
}
