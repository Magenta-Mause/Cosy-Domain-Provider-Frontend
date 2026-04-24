import type { AdminSubdomain } from "../../lib";

export type SortKey = "label" | "createdAt";
export type SortDir = "asc" | "desc";

export function sortSubdomains(
  subdomains: AdminSubdomain[],
  sortBy: SortKey,
  sortDir: SortDir,
): AdminSubdomain[] {
  return [...subdomains].sort((a, b) => {
    const mult = sortDir === "asc" ? 1 : -1;
    if (sortBy === "label") return mult * a.label.localeCompare(b.label);
    return (
      mult *
      (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    );
  });
}

export function subdomainStatusColor(
  status: AdminSubdomain["status"],
): string {
  if (status === "ACTIVE") return "text-green-600";
  if (status === "FAILED") return "text-destructive";
  return "text-yellow-400";
}
