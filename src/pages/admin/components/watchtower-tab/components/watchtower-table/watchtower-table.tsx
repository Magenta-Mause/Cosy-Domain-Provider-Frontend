import { useTranslation } from "react-i18next";

import type { AdminWatchtowerScan } from "@/api/admin-api";
import { type ColumnDef, Table } from "@/components/ui/table";

import { categoryAccent, formatPaths } from "../../lib";
import { WatchtowerBadge } from "../watchtower-badge";

interface WatchtowerTableProps {
  readonly scans: AdminWatchtowerScan[];
  readonly onSelect: (uuid: string) => void;
}

export function WatchtowerTable({ scans, onSelect }: WatchtowerTableProps) {
  const { t } = useTranslation("admin");

  const columns: ColumnDef<AdminWatchtowerScan>[] = [
    {
      id: "category",
      header: t("watchtower.colStatus"),
      compare: (a, b) => a.category.localeCompare(b.category),
      cell: (s) => <WatchtowerBadge category={s.category} />,
    },
    {
      id: "label",
      header: t("watchtower.colSubdomain"),
      width: "1.2fr",
      compare: (a, b) => a.label.localeCompare(b.label),
      cell: (s) => s.label,
      cellClassName: "truncate font-mono",
    },
    {
      id: "summary",
      header: t("watchtower.colVerdict"),
      width: "2.2fr",
      compare: (a, b) => a.summary.localeCompare(b.summary),
      cell: (s) => s.summary,
      cellClassName: (s) => `truncate ${categoryAccent(s.category).text}`,
    },
    {
      id: "paths",
      header: t("watchtower.colPaths"),
      compare: (a, b) => a.visitedPaths.length - b.visitedPaths.length,
      cell: (s) => formatPaths(s.visitedPaths),
      cellClassName: "truncate opacity-70",
    },
    {
      id: "review",
      header: t("watchtower.colReview"),
      compare: (a, b) => a.reviewStatus.localeCompare(b.reviewStatus),
      cell: (s) => t(`watchtower.review.${s.reviewStatus}`),
      cellClassName: "opacity-70",
    },
    {
      id: "scannedAt",
      header: t("watchtower.colScanned"),
      compare: (a, b) =>
        new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime(),
      cell: (s) => new Date(s.scannedAt).toLocaleString(),
      cellClassName: "opacity-70",
    },
  ];

  return (
    <Table
      columns={columns}
      rows={scans}
      getRowKey={(s) => s.uuid}
      onRowClick={(s) => onSelect(s.uuid)}
      emptyMessage={t("watchtower.empty")}
    />
  );
}
