import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

import type { AdminSubdomain } from "../../../lib";
import { StatusBadge } from "./status-badge";

interface UserSubdomainsTableProps {
  subdomains: AdminSubdomain[];
}

export function UserSubdomainsTable({ subdomains }: UserSubdomainsTableProps) {
  const { t } = useTranslation();

  return (
    <FlatPanel className="p-0 overflow-hidden">
      <div
        className="grid text-sm"
        style={{ gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 1fr" }}
      >
        {[
          t("admin.colLabel"),
          t("admin.colFqdn"),
          t("admin.colStatus"),
          t("admin.colMode"),
          t("admin.colTargetIp"),
          t("admin.colCreated"),
        ].map((h) => (
          <div
            key={h}
            className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
          >
            {h}
          </div>
        ))}
        {subdomains.length === 0 && (
          <div className="col-span-6 px-3 py-4 opacity-50 text-center">
            {t("admin.noSubdomains")}
          </div>
        )}
        {subdomains.map((s) => (
          <Fragment key={s.uuid}>
            <div className="px-3 py-2.5 border-t border-foreground/10 font-mono truncate">
              {s.label}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70">
              {s.fqdn ?? "—"}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10">
              <StatusBadge status={s.status} />
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 opacity-70">
              {s.labelMode}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70">
              {s.targetIp ?? "—"}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 opacity-70">
              {new Date(s.createdAt).toLocaleDateString()}
            </div>
          </Fragment>
        ))}
      </div>
    </FlatPanel>
  );
}
