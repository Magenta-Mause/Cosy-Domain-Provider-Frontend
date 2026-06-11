import type { AdminSubdomain } from "@/api/admin-api";
import { subdomainStatusColor } from "../lib";

interface StatusBadgeProps {
  readonly status: AdminSubdomain["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-sm ${subdomainStatusColor(status)}`}>{status}</span>
  );
}
