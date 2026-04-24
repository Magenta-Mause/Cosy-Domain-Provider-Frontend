import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

import type { AdminUser } from "../../../lib";

interface UsersTableProps {
  users: AdminUser[];
  onUserClick: (userId: string) => void;
}

export function UsersTable({ users, onUserClick }: UsersTableProps) {
  const { t } = useTranslation();

  return (
    <FlatPanel className="p-0 overflow-hidden">
      <div
        className="grid text-sm"
        style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1.5fr" }}
      >
        {[
          t("admin.colEmail"),
          t("admin.colUuid"),
          t("admin.colTier"),
          t("admin.colSubdomains"),
          t("admin.colVerified"),
          t("admin.colPlanExpires"),
        ].map((h) => (
          <div
            key={h}
            className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
          >
            {h}
          </div>
        ))}
        {users.map((u) => (
          <button
            key={u.uuid}
            type="button"
            className="contents group cursor-pointer"
            onClick={() => onUserClick(u.uuid)}
          >
            <div className="px-3 py-2.5 border-t border-foreground/10 truncate group-hover:bg-foreground/5 transition-colors">
              {u.email}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 font-mono text-xs truncate opacity-60 group-hover:bg-foreground/5 transition-colors flex items-center">
              {u.uuid}
            </div>
            <div
              className={`px-3 py-2.5 border-t border-foreground/10 font-semibold group-hover:bg-foreground/5 transition-colors ${u.tier === "PLUS" ? "text-btn-primary" : "opacity-70"}`}
            >
              {u.tier}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 group-hover:bg-foreground/5 transition-colors">
              {u.subdomainCount}/{u.maxSubdomainCount}
              {u.maxSubdomainCountOverride !== null && (
                <span className="ml-1 text-xs opacity-50">*</span>
              )}
            </div>
            <div
              className={`px-3 py-2.5 border-t border-foreground/10 group-hover:bg-foreground/5 transition-colors ${u.verified ? "text-green-600" : "opacity-40"}`}
            >
              {u.verified ? t("admin.yes") : t("admin.no")}
            </div>
            <div className="px-3 py-2.5 border-t border-foreground/10 opacity-60 group-hover:bg-foreground/5 transition-colors">
              {u.planExpiresAt
                ? new Date(u.planExpiresAt).toLocaleDateString()
                : "—"}
            </div>
          </button>
        ))}
      </div>
    </FlatPanel>
  );
}
