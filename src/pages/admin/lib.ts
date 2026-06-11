import type { AdminSubdomain } from "@/api/admin-api";

export const ADMIN_KEY_STORAGE = "admin_key";

export function getStoredAdminKey(): string {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}

export function subdomainStatusColor(status: AdminSubdomain["status"]): string {
  if (status === "ACTIVE") return "text-green-600";
  if (status === "FAILED") return "text-destructive";
  return "text-yellow-400";
}
