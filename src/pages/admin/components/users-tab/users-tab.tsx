import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FlatPanel } from "@/components/pixel/panel";
import { type AdminUser, adminApi } from "../../lib";

interface UsersTabProps {
  adminKey: string;
}

export function UsersTab({ adminKey }: UsersTabProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getUsers(adminKey)
      .then(setUsers)
      .catch(() => setError(t("admin.loadUsersError")))
      .finally(() => setIsLoading(false));
  }, [adminKey, t]);

  if (isLoading) return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>;

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
            onClick={() =>
              navigate({ to: "/admin/users/$userId", params: { userId: u.uuid } })
            }
          >
            {[
              <div
                key="email"
                className="px-3 py-2.5 border-t border-foreground/10 truncate group-hover:bg-foreground/5 transition-colors"
              >
                {u.email}
              </div>,
              <div
                key="uuid"
                className="px-3 py-2.5 border-t border-foreground/10 font-mono text-xs truncate opacity-60 group-hover:bg-foreground/5 transition-colors flex items-center"
              >
                {u.uuid}
              </div>,
              <div
                key="tier"
                className={`px-3 py-2.5 border-t border-foreground/10 font-semibold group-hover:bg-foreground/5 transition-colors ${u.tier === "PLUS" ? "text-btn-primary" : "opacity-70"}`}
              >
                {u.tier}
              </div>,
              <div
                key="count"
                className="px-3 py-2.5 border-t border-foreground/10 group-hover:bg-foreground/5 transition-colors"
              >
                {u.subdomainCount}/{u.maxSubdomainCount}
                {u.maxSubdomainCountOverride !== null && (
                  <span className="ml-1 text-xs opacity-50">*</span>
                )}
              </div>,
              <div
                key="verified"
                className={`px-3 py-2.5 border-t border-foreground/10 group-hover:bg-foreground/5 transition-colors ${u.verified ? "text-green-600" : "opacity-40"}`}
              >
                {u.verified ? t("admin.yes") : t("admin.no")}
              </div>,
              <div
                key="expires"
                className="px-3 py-2.5 border-t border-foreground/10 opacity-60 group-hover:bg-foreground/5 transition-colors"
              >
                {u.planExpiresAt
                  ? new Date(u.planExpiresAt).toLocaleDateString()
                  : "—"}
              </div>,
            ]}
          </button>
        ))}
      </div>
    </FlatPanel>
  );
}
