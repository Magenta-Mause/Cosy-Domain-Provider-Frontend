import type { AdminSubdomain } from "@/api/admin-api";

export interface DnsEntry {
  name: string;
  type: string;
  value: string;
}

export function deriveDnsEntries(subdomain: AdminSubdomain): DnsEntry[] {
  const fqdn = subdomain.fqdn ?? subdomain.label;
  const entries: DnsEntry[] = [];
  if (subdomain.targetIp) {
    entries.push({ name: fqdn, type: "A", value: subdomain.targetIp });
  }
  if (subdomain.targetIpv6) {
    entries.push({ name: fqdn, type: "AAAA", value: subdomain.targetIpv6 });
  }
  return entries;
}
