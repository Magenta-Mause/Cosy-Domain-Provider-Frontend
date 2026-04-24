import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/page-header";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import { useAdminLogic } from "./useAdminLogic";

interface AdminAuthGateProps {
  activeTab: "subdomains" | "users";
  outlet: ReactNode;
}

export function AdminAuthGate({ activeTab, outlet }: AdminAuthGateProps) {
  const { t } = useTranslation();
  const {
    isAuthenticated,
    loginError,
    logout,
    inputKey,
    setInputKey,
    isLogging,
    handleLogin,
  } = useAdminLogic();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <div>
            <div
              className="pixel text-[11px] mb-1"
              style={{ color: "oklch(0.92 0.05 70)" }}
            >
              {t("admin.label")}
            </div>
            <h1
              style={{
                color: "oklch(0.95 0.08 70)",
                textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
              }}
            >
              {t("admin.title")}
            </h1>
          </div>
          <FlatPanel className="px-5 py-5">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <FormField
                id="admin-key"
                label={t("admin.adminKey")}
                type="password"
                value={inputKey}
                onChange={setInputKey}
                placeholder={t("admin.adminKeyPlaceholder")}
                autoComplete="off"
                error={loginError ? t("admin.adminKeyError") : null}
              />
              <Button type="submit" disabled={isLogging || !inputKey}>
                {isLogging ? t("admin.signingIn") : t("admin.signIn")}
              </Button>
            </form>
          </FlatPanel>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "subdomains" as const,
      label: t("admin.tabSubdomains"),
      to: "/admin/subdomains",
    },
    {
      key: "users" as const,
      label: t("admin.tabUsers"),
      to: "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader maxWidth={1200}>
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1 flex flex-col gap-2">
            <div
              className="pixel text-[11px]"
              style={{ color: "oklch(0.92 0.05 70)" }}
            >
              {t("admin.label")}
            </div>
            <h1
              style={{
                color: "oklch(0.95 0.08 70)",
                textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
              }}
            >
              {t("admin.title")}
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="pbtn sm secondary shrink-0"
          >
            {t("admin.signOut")}
          </button>
        </div>

        <div
          className="flex gap-1"
          style={{ borderBottom: "2px solid oklch(0.95 0.05 70 / 30%)" }}
        >
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.to}
              style={
                activeTab === tab.key
                  ? {
                      color: "oklch(0.97 0.05 70)",
                      borderBottom: "2px solid oklch(0.97 0.05 70)",
                    }
                  : {
                      color: "oklch(0.97 0.05 70 / 55%)",
                      borderBottom: "2px solid transparent",
                    }
              }
              className="px-5 py-2.5 text-sm font-semibold -mb-[2px] hover:opacity-100 no-underline! transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-5">
        {outlet}
      </div>
    </div>
  );
}
