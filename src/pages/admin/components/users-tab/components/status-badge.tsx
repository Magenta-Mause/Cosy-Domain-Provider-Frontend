import type { AdminSubdomain } from "../../../lib";
import { subdomainStatusColor } from "../../subdomains-tab/lib";

interface StatusBadgeProps {
  status: AdminSubdomain["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-sm ${subdomainStatusColor(status)}`}>{status}</span>
  );
}
