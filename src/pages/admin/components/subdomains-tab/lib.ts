import type { AdminSubdomain } from "../../lib";

export function subdomainStatusColor(
  status: AdminSubdomain["status"],
): string {
  if (status === "ACTIVE") return "text-green-600";
  if (status === "FAILED") return "text-destructive";
  return "text-yellow-400";
}
