import { useTranslation } from "react-i18next";

import { type ColumnDef, Table } from "@/components/ui/table";

import type { AdminUser } from "../../../lib";

interface UsersTableProps {
  readonly users: AdminUser[];
  readonly onUserClick: (userId: string) => void;
}

function UuidCell({ uuid }: { uuid: string }) {
  return <span className="truncate w-full">{uuid}</span>;
}

function SubdomainCountCell({
  subdomainCount,
  maxSubdomainCount,
  maxSubdomainCountOverride,
}: Pick<
  AdminUser,
  "subdomainCount" | "maxSubdomainCount" | "maxSubdomainCountOverride"
>) {
  return (
    <>
      {subdomainCount}/{maxSubdomainCount}
      {maxSubdomainCountOverride !== null && (
        <span className="ml-1 text-xs opacity-50">*</span>
      )}
    </>
  );
}

function getColumns(
  t: ReturnType<typeof useTranslation>["t"],
): ColumnDef<AdminUser>[] {
  return [
    {
      id: "email",
      header: t("admin.colEmail"),
      width: "2fr",
      compare: (a, b) => a.email.localeCompare(b.email),
      cell: (u) => u.email,
      cellClassName: "truncate",
    },
    {
      id: "uuid",
      header: t("admin.colUuid"),
      width: "2fr",
      compare: (a, b) => a.uuid.localeCompare(b.uuid),
      cell: (u) => <UuidCell uuid={u.uuid} />,
      cellClassName:
        "font-mono text-xs opacity-60 flex items-center overflow-hidden",
    },
    {
      id: "tier",
      header: t("admin.colTier"),
      compare: (a, b) => a.tier.localeCompare(b.tier),
      cell: (u) => u.tier,
      cellClassName: (u) =>
        `font-semibold ${u.tier === "PLUS" ? "text-btn-primary" : "opacity-70"}`,
    },
    {
      id: "subdomains",
      header: t("admin.colSubdomains"),
      compare: (a, b) => a.subdomainCount - b.subdomainCount,
      cell: (u) => (
        <SubdomainCountCell
          subdomainCount={u.subdomainCount}
          maxSubdomainCount={u.maxSubdomainCount}
          maxSubdomainCountOverride={u.maxSubdomainCountOverride}
        />
      ),
    },
    {
      id: "verified",
      header: t("admin.colVerified"),
      compare: (a, b) => Number(a.verified) - Number(b.verified),
      cell: (u) => (u.verified ? t("admin.yes") : t("admin.no")),
      cellClassName: (u) => (u.verified ? "text-green-600" : "opacity-40"),
    },
    {
      id: "planExpires",
      header: t("admin.colPlanExpires"),
      width: "1.5fr",
      compare: (a, b) =>
        (a.planExpiresAt ? new Date(a.planExpiresAt).getTime() : 0) -
        (b.planExpiresAt ? new Date(b.planExpiresAt).getTime() : 0),
      cell: (u) =>
        u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString() : "—",
      cellClassName: "opacity-60",
    },
  ];
}

export function UsersTable({ users, onUserClick }: UsersTableProps) {
  const { t } = useTranslation();
  const columns = getColumns(t);

  return (
    <Table
      columns={columns}
      rows={users}
      getRowKey={(u) => u.uuid}
      onRowClick={(u) => onUserClick(u.uuid)}
      initialSortColId="email"
    />
  );
}
