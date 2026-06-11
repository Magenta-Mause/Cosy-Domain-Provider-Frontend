import { useTranslation } from "react-i18next";

import type { AdminSubdomain } from "@/api/admin-api";
import { FlatPanel } from "@/components/pixel/panel";
import { DetailField } from "../../../detail-field";
import { StatusBadge } from "../../../status-badge";

interface SubdomainInfoPanelsProps {
  readonly subdomain: AdminSubdomain;
  readonly onOwnerClick: () => void;
}

export function SubdomainInfoPanels({
  subdomain,
  onOwnerClick,
}: SubdomainInfoPanelsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FlatPanel className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="col-span-2 flex flex-col gap-1">
          <div className="text-[10px] opacity-50 uppercase tracking-wide">
            {t("admin.fieldSubdomainId")}
          </div>
          <div className="text-sm font-mono">{subdomain.uuid}</div>
        </div>

        <DetailField label={t("admin.colLabel")}>
          <span className="font-mono">{subdomain.label}</span>
        </DetailField>
        <DetailField label={t("admin.colFqdn")}>
          <span className="font-mono opacity-80">{subdomain.fqdn ?? "—"}</span>
        </DetailField>

        <DetailField label={t("admin.colStatus")}>
          <StatusBadge status={subdomain.status} />
        </DetailField>
        <DetailField label={t("admin.colMode")}>
          {subdomain.labelMode}
        </DetailField>

        <DetailField label={t("admin.colTargetIpv4")}>
          <span className="font-mono">{subdomain.targetIp ?? "—"}</span>
        </DetailField>
        <DetailField label={t("admin.fieldTargetIpv6")}>
          <span className="font-mono">{subdomain.targetIpv6 ?? "—"}</span>
        </DetailField>

        <DetailField label={t("admin.colCreated")}>
          {new Date(subdomain.createdAt).toLocaleString()}
        </DetailField>
        <DetailField label={t("admin.fieldUpdatedAt")}>
          {new Date(subdomain.updatedAt).toLocaleString()}
        </DetailField>
      </FlatPanel>

      <FlatPanel className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="col-span-2 flex flex-col gap-1">
          <div className="text-[10px] opacity-50 uppercase tracking-wide">
            {t("admin.fieldOwnerUuid")}
          </div>
          <div className="text-sm font-mono">
            <button
              type="button"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              onClick={onOwnerClick}
            >
              {subdomain.ownerUuid}
            </button>
          </div>
        </div>

        <DetailField label={t("admin.fieldUsername")}>
          {subdomain.ownerUsername}
        </DetailField>
        <DetailField label={t("admin.fieldEmail")}>
          {subdomain.ownerEmail}
        </DetailField>
      </FlatPanel>
    </>
  );
}
