import type { AuthUser } from "@/store/auth-slice";

function resolveEmail(decoded: {
  email?: string;
  upn?: unknown;
  [key: string]: unknown;
}): string | null {
  if (typeof decoded.email === "string") return decoded.email;
  if (typeof decoded.upn === "string") return decoded.upn;
  return null;
}

export function parseIdentityToken(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replaceAll("-", "+").replaceAll("_", "/")),
    ) as {
      username?: string;
      sub?: string;
      email?: string;
      isVerified?: boolean;
      needsPasswordSetup?: boolean;
      isMfaEnabled?: boolean;
      tier?: string;
      maxSubdomainCount?: number;
      iat?: number;
      exp?: number;
      [key: string]: unknown;
    };

    return {
      username: decoded.username ?? null,
      email: resolveEmail(decoded),
      subject: decoded.sub ?? null,
      isVerified: decoded.isVerified ?? null,
      needsPasswordSetup: decoded.needsPasswordSetup === true,
      isMfaEnabled: decoded.isMfaEnabled === true,
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
