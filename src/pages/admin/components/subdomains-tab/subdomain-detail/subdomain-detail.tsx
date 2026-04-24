import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

import type { AdminSubdomain } from "../../../lib";
import { DetailField } from "../../users-tab/components/detail-field";
import { StatusBadge } from "../../users-tab/components/status-badge";

interface SubdomainDetailProps {
  subdomain: AdminSubdomain;
}

function deriveDnsEntries(subdomain: AdminSubdomain) {
  const fqdn = subdomain.fqdn ?? subdomain.label;
  const entries: { name: string; type: string; value: string }[] = [];
  if (subdomain.targetIp) {
    entries.push({ name: fqdn, type: "A", value: subdomain.targetIp });
  }
  if (subdomain.targetIpv6) {
    entries.push({ name: fqdn, type: "AAAA", value: subdomain.targetIpv6 });
  }
  return entries;
}

export function SubdomainDetail({ subdomain }: SubdomainDetailProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const dnsEntries = deriveDnsEntries(subdomain);

  return (
    <div className="flex flex-col gap-5">
      <div>
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

        <DetailField label={t("admin.colLabel")}>
          <span className="font-mono">{subdomain.label}</span>
        </DetailField>
        <DetailField label={t("admin.colFqdn")}>
          <span className="font-mono opacity-80">{subdomain.fqdn ?? "—"}</span>
        </DetailField>

        <DetailField label={t("admin.colStatus")}>
          <StatusBadge status={subdomain.status} />
        </DetailField>
        <DetailField label={t("admin.colMode")}>{subdomain.labelMode}</DetailField>

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
              onClick={() =>
                navigate({
                  to: "/admin/users/$userId",
                  params: { userId: subdomain.ownerUuid },
                })
              }
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

      <div>
        <h3 className="text-base font-semibold mb-2">
          {t("admin.dnsEntriesSection")}
        </h3>
        <FlatPanel className="p-0 overflow-hidden">
          <div
            className="grid text-sm"
            style={{ gridTemplateColumns: "3fr 1fr 4fr" }}
          >
            {[t("admin.colDnsName"), t("admin.colDnsType"), t("admin.colDnsValue")].map(
              (h) => (
                <div
                  key={h}
                  className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
                >
                  {h}
                </div>
              ),
            )}
            {dnsEntries.length === 0 && (
              <div className="col-span-3 px-3 py-4 opacity-50 text-center">
                {t("admin.noDnsEntries")}
              </div>
            )}
            {dnsEntries.map((entry) => (
              <div key={`${entry.type}-${entry.value}`} className="contents">
                <div className="px-3 py-2.5 border-t border-foreground/10 font-mono truncate">
                  {entry.name}
                </div>
                <div className="px-3 py-2.5 border-t border-foreground/10 font-semibold">
                  {entry.type}
                </div>
                <div className="px-3 py-2.5 border-t border-foreground/10 font-mono">
                  {entry.value}
                </div>
              </div>
            ))}
          </div>
        </FlatPanel>
      </div>
    </div>
  );
}
