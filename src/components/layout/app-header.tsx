import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { setIdentityToken } from "@/api/axios-instance";
import { useLogout } from "@/api/generated/domain-provider-api";
import { Mailbox } from "@/components/pixel/mailbox";
import { cn } from "@/lib/utils";
import { clearIdentity } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type Route = "dashboard" | "create" | "detail" | null;

export function AppHeader({ route = null }: { route?: Route }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const username = useAppSelector((state) => state.auth.user?.username);
  const logoutMutation = useLogout({
    mutation: {
      onSettled: () => {
        setIdentityToken(null);
        dispatch(clearIdentity());
        queryClient.clear();
        void navigate({ to: "/login" });
      },
    },
  });

  const initial = username?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      style={{
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        zIndex: 5,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <Mailbox size={36} />
        <div style={{ textAlign: "left" }}>
          <div
            className="pixel"
            style={{ fontSize: 16, color: "oklch(0.95 0.05 70)" }}
          >
            COSY
          </div>
          <div
            style={{
              fontSize: 14,
              marginTop: 2,
              color: "oklch(0.92 0.04 60)",
              opacity: 0.85,
            }}
          >
            {t("appTagline")}
          </div>
        </div>
      </Link>
      <div style={{ flex: 1 }} />
      <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Link
          to="/dashboard"
          className={cn("pbtn sm", route !== "dashboard" && "ghost")}
          style={{
            color: route !== "dashboard" ? "oklch(0.95 0.05 70)" : undefined,
          }}
        >
          {t("nav.dashboard")}
        </Link>
        <Link
          to="/subdomain/new"
          className={cn("pbtn sm", route !== "create" && "ghost")}
          style={{
            color: route !== "create" ? "oklch(0.95 0.05 70)" : undefined,
          }}
        >
          {t("nav.newSubdomain")}
        </Link>
      </nav>
      <button
        type="button"
        className="pbtn sm secondary"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
        style={{ gap: 8 }}
        title={t("nav.logout")}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 2,
            background: "var(--accent)",
            border: "2px solid var(--foreground)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "var(--btn-primary)",
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          {initial}
        </span>
        {username ?? t("nav.logout")}
      </button>
    </header>
  );
}
