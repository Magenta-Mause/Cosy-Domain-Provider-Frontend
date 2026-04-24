import { useTranslation } from "react-i18next";

import { type ColumnDef, Table } from "@/components/ui/table";

import type { AdminSubdomain } from "../../../lib";
import { StatusBadge } from "./status-badge";

interface UserSubdomainsTableProps {
  subdomains: AdminSubdomain[];
  onSubdomainClick: (subdomainId: string) => void;
}

export function UserSubdomainsTable({ subdomains, onSubdomainClick }: UserSubdomainsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<AdminSubdomain>[] = [
    {
      id: "label",
      header: t("admin.colLabel"),
      width: "2fr",
      cell: (s) => s.label,
      cellClassName: "font-mono truncate",
    },
    {
      id: "fqdn",
      header: t("admin.colFqdn"),
      width: "2.5fr",
      cell: (s) => s.fqdn ?? "—",
      cellClassName: "truncate opacity-70",
    },
    {
      id: "status",
      header: t("admin.colStatus"),
      cell: (s) => <StatusBadge status={s.status} />,
    },
    {
      id: "mode",
      header: t("admin.colMode"),
      cell: (s) => s.labelMode,
      cellClassName: "opacity-70",
    },
    {
      id: "targetIp",
      header: t("admin.colTargetIp"),
      cell: (s) => s.targetIp ?? "—",
      cellClassName: "truncate opacity-70",
    },
    {
      id: "createdAt",
      header: t("admin.colCreated"),
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
      emptyMessage={t("admin.noSubdomains")}
    />
  );
}
