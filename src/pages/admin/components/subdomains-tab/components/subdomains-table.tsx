import { useTranslation } from "react-i18next";

import { type ColumnDef, Table } from "@/components/ui/table";

import type { AdminSubdomain } from "../../../lib";
import { subdomainStatusColor } from "../lib";

interface SubdomainsTableProps {
  subdomains: AdminSubdomain[];
  onSubdomainClick: (subdomainId: string) => void;
}

export function SubdomainsTable({
  subdomains,
  onSubdomainClick,
}: SubdomainsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<AdminSubdomain>[] = [
    {
      id: "label",
      header: t("admin.colLabel"),
      width: "2fr",
      compare: (a, b) => a.label.localeCompare(b.label),
      cell: (s) => s.label,
      cellClassName: "truncate font-mono",
    },
    {
      id: "fqdn",
      header: t("admin.colFqdn"),
      width: "2.5fr",
      compare: (a, b) => (a.fqdn ?? "").localeCompare(b.fqdn ?? ""),
      cell: (s) => s.fqdn ?? "—",
      cellClassName: "truncate opacity-70",
    },
    {
      id: "status",
      header: t("admin.colStatus"),
      compare: (a, b) => a.status.localeCompare(b.status),
      cell: (s) => s.status,
      cellClassName: (s) => subdomainStatusColor(s.status),
    },
    {
      id: "mode",
      header: t("admin.colMode"),
      compare: (a, b) => a.labelMode.localeCompare(b.labelMode),
      cell: (s) => s.labelMode,
      cellClassName: "opacity-70",
    },
    {
      id: "targetIp",
      header: t("admin.colTargetIpv4"),
      compare: (a, b) => (a.targetIp ?? "").localeCompare(b.targetIp ?? ""),
      cell: (s) => s.targetIp ?? "—",
      cellClassName: "truncate opacity-70",
    },
    {
      id: "owner",
      header: t("admin.colOwner"),
      width: "1.5fr",
      compare: (a, b) => a.ownerEmail.localeCompare(b.ownerEmail),
      cell: (s) => s.ownerEmail,
      cellClassName: "truncate opacity-70",
    },
    {
      id: "createdAt",
      header: t("admin.colCreated"),
      compare: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      cell: (s) => new Date(s.createdAt).toLocaleDateString(),
      cellClassName: "opacity-70",
    },
  ];

  return (
    <Table
      columns={columns}
      rows={subdomains}
      getRowKey={(s) => s.uuid}
      onRowClick={(s) => onSubdomainClick(s.uuid)}
      initialSortColId="createdAt"
      initialSortDir="desc"
    />
  );
}
