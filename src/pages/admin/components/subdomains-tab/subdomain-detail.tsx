import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import type { AdminSubdomain } from "../../lib";
import { DetailField } from "../detail-field";
import { subdomainStatusColor } from "./lib";

interface SubdomainDetailProps {
  readonly subdomain: AdminSubdomain;
}

export function SubdomainDetail({ subdomain }: SubdomainDetailProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 items-start">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="pbtn sm secondary"
        >
          {t("admin.back")}
        </button>
      </div>

      <FlatPanel className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="col-span-2 flex flex-col gap-1">
          <div className="text-[10px] opacity-50 uppercase tracking-wide">
            {t("admin.fieldSubdomainId")}
          </div>
          <div className="text-sm font-mono">{subdomain.uuid}</div>
        </div>

        <DetailField label={t("admin.colLabel")}>{subdomain.label}</DetailField>
        <DetailField label={t("admin.colFqdn")}>
          {subdomain.fqdn ?? "—"}
        </DetailField>

        <DetailField label={t("admin.colStatus")}>
          <span className={subdomainStatusColor(subdomain.status)}>
            {subdomain.status}
          </span>
        </DetailField>
        <DetailField label={t("admin.colMode")}>
          {subdomain.labelMode}
        </DetailField>

        <DetailField label={t("admin.colTargetIpv4")}>
          {subdomain.targetIp ?? "—"}
        </DetailField>
        <DetailField label={t("admin.fieldTargetIpv6")}>
          {subdomain.targetIpv6 ?? "—"}
        </DetailField>

        <DetailField label={t("admin.fieldOwnerEmail")}>
          {subdomain.ownerEmail}
        </DetailField>
        <DetailField label={t("admin.fieldOwnerUsername")}>
          {subdomain.ownerUsername}
        </DetailField>

        <DetailField label={t("admin.fieldJoined")}>
          {new Date(subdomain.createdAt).toLocaleDateString()}
        </DetailField>
        <DetailField label={t("admin.fieldUpdatedAt")}>
          {new Date(subdomain.updatedAt).toLocaleDateString()}
        </DetailField>
      </FlatPanel>
    </div>
  );
}
