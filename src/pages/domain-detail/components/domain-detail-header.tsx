import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { PageHeader } from "@/components/layout/page-header";
import { Mailbox } from "@/components/pixel/mailbox";
import { StatusDot } from "@/components/pixel/status-dot";
import { SubdomainStatusBadge } from "@/components/pixel/subdomain-status-badge";

interface DomainDetailHeaderProps {
  domain: SubdomainDto | undefined;
  isCreateMode: boolean;
}

export function DomainDetailHeader({
  domain,
  isCreateMode,
}: DomainDetailHeaderProps) {
  const { t } = useTranslation();

  return (
    <PageHeader maxWidth={1100}>
      <Link
        to="/dashboard"
        data-testid="domain-detail-back-link"
        style={{ color: "oklch(0.95 0.08 70)", fontSize: 16, display: "block", marginBottom: 12 }}
      >
        ← {t("domainDetail.backToDomains")}
      </Link>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Mailbox size={64} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            style={{
              color: "oklch(0.95 0.08 70)",
              textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
              fontSize: 28,
            }}
          >
            {isCreateMode
              ? t("domainDetail.createTitle")
              : (domain?.fqdn ?? domain?.label ?? t("domainDetail.title"))}
          </h1>
          {!isCreateMode && domain?.status ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <StatusDot status={domain.status} />
              <SubdomainStatusBadge status={domain.status} variant="detail" />
            </div>
          ) : null}
        </div>
      </div>
    </PageHeader>
  );
}
