import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { SubdomainDtoStatus } from "@/api/generated/model";
import { DotLoader } from "@/components/pixel/dot-loader";
import { Mailbox } from "@/components/pixel/mailbox";
import { StatusDot } from "@/components/pixel/status-dot";
import { SubdomainStatusBadge } from "@/components/pixel/subdomain-status-badge";

interface SubdomainListProps {
  subdomains: SubdomainDto[];
  isLoading: boolean;
  isError: boolean;
}

function SubdomainListItem({ domain }: { domain: SubdomainDto }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      data-testid={`dashboard-domain-item-${domain.uuid}`}
      className="panel-flat hover-lift"
      style={{
        padding: 18,
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
      }}
      onClick={() =>
        void navigate({
          to: "/domain/$domainId",
          params: { domainId: domain.uuid as string },
        })
      }
    >
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Mailbox
          size={48}
          flag={
            domain.status === SubdomainDtoStatus.ACTIVE
              ? "oklch(0.65 0.2 145)"
              : "var(--destructive)"
          }
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              className="pixel"
              style={{ fontSize: 16, color: "var(--btn-primary)" }}
            >
              {domain.fqdn ?? domain.label}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              fontSize: 16,
              opacity: 0.85,
              alignItems: "center",
            }}
          >
            {domain.status ? <StatusDot status={domain.status} /> : null}
            {domain.targetIp ? (
              <span>→ {domain.targetIp}</span>
            ) : (
              <span style={{ opacity: 0.7 }}>
                {t("dashboard.notConnected")}
              </span>
            )}
          </div>
        </div>
        {domain.status ? <SubdomainStatusBadge status={domain.status} /> : null}
        <span style={{ fontSize: 22, opacity: 0.6 }}>→</span>
      </div>
    </button>
  );
}

export function SubdomainList({
  subdomains,
  isLoading,
  isError,
}: SubdomainListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div
        className="panel-flat"
        style={{ padding: 40, textAlign: "center", fontSize: 18 }}
      >
        <DotLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="panel-flat"
        style={{
          padding: 24,
          color: "var(--destructive)",
          textAlign: "center",
        }}
      >
        ⚠ {t("dashboard.loadError")}
      </div>
    );
  }

  if (subdomains.length === 0) {
    return (
      <div
        className="panel-flat"
        style={{ padding: 24, textAlign: "center", fontSize: 18 }}
      >
        {t("dashboard.empty")}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {subdomains.map((d) => (
        <SubdomainListItem key={d.uuid} domain={d} />
      ))}
    </div>
  );
}
