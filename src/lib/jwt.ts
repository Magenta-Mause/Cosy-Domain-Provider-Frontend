import type { AuthUser } from "@/store/auth-slice";

export function parseIdentityToken(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { username?: string; sub?: string };
    const username = decoded.username ?? decoded.sub;
    return username ? { username } : null;
  } catch {
    return null;
  }
}
