import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

import type { AdminSubdomain } from "../../../lib";
import { type SortDir, type SortKey, subdomainStatusColor } from "../lib";
import { SortBtn } from "./sort-btn";

interface SubdomainsTableProps {
  subdomains: AdminSubdomain[];
  sortBy: SortKey;
  sortDir: SortDir;
  onToggleSort: (key: SortKey) => void;
  onSubdomainClick: (subdomainId: string) => void;
}

export function SubdomainsTable({
  subdomains,
  sortBy,
  sortDir,
  onToggleSort,
  onSubdomainClick,
}: SubdomainsTableProps) {
  const { t } = useTranslation();

  const headers: { label: string; sortKey?: SortKey }[] = [
    { label: t("admin.colLabel"), sortKey: "label" },
    { label: t("admin.colFqdn") },
    { label: t("admin.colStatus") },
    { label: t("admin.colMode") },
    { label: t("admin.colTargetIpv4") },
    { label: t("admin.colOwner") },
    { label: t("admin.colCreated"), sortKey: "createdAt" },
  ];

  return (
    <FlatPanel className="p-0 overflow-hidden">
      <div
        className="grid text-sm"
        style={{ gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 1.5fr 1fr" }}
      >
        {headers.map(({ label, sortKey }) => (
          <div
            key={label}
            className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
          >
            {sortKey ? (
              <SortBtn
                sortKey={sortKey}
                label={label}
                activeSortBy={sortBy}
                sortDir={sortDir}
                onToggle={onToggleSort}
              />
            ) : (
              label
            )}
          </div>
        ))}
        {subdomains.map((s) => (
          <button
            key={s.uuid}
            type="button"
            className="contents group cursor-pointer"
            onClick={() => onSubdomainClick(s.uuid)}
          >
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate font-mono group-hover:bg-foreground/5 transition-colors">
              {s.label}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70 group-hover:bg-foreground/5 transition-colors">
              {s.fqdn ?? "—"}
            </div>
            <div
              className={`px-3 py-2.5 border-t border-foreground/10 group-hover:bg-foreground/5 transition-colors ${subdomainStatusColor(s.status)}`}
            >
              {s.status}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 opacity-70 group-hover:bg-foreground/5 transition-colors">
              {s.labelMode}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70 group-hover:bg-foreground/5 transition-colors">
              {s.targetIp ?? "—"}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70 group-hover:bg-foreground/5 transition-colors">
              {s.ownerEmail}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 opacity-70 group-hover:bg-foreground/5 transition-colors">
              {new Date(s.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </FlatPanel>
  );
}
