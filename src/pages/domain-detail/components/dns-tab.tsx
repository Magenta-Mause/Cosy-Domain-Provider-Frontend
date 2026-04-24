import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { FlatPanel } from "@/components/pixel/panel";

interface DnsTabProps {
  domain: SubdomainDto | undefined;
}

export function DnsTab({ domain }: DnsTabProps) {
  const { t } = useTranslation();

  const entries = domain?.dnsEntries ?? [];
  const headers = ["Type", "Name", "Value", "TTL"];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>{t("domainDetail.dnsRecords")}</h3>
        <p className="text-base opacity-75 mt-1.5">
          {t("domainDetail.dnsManagedFor")}{" "}
          <span className="pixel text-xs text-btn-primary">
            {domain?.fqdn ?? domain?.label}
          </span>
          .
        </p>
      </div>
      <FlatPanel className="p-0 overflow-hidden">
        {entries.length === 0 ? (
          <p className="px-[14px] py-3 text-base opacity-60">
            {t("domainDetail.dnsNoRecords")}
          </p>
        ) : (
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "80px 1.5fr 2fr 80px" }}
          >
            {headers.map((h) => (
              <div
                key={h}
                className="pixel px-[14px] py-[10px] text-[10px] bg-btn-primary text-btn-secondary"
              >
                {h}
              </div>
            ))}
            {entries.map((entry) => {
              const cells = [
                entry.type ?? "—",
                entry.name ?? "—",
                (entry.values ?? []).join(", ") || "—",
                entry.ttl != null ? String(entry.ttl) : "—",
              ];
              return cells.map((cell, j) => (
                <div
                  key={`${entry.type}-${headers[j]}`}
                  className={`flex items-center overflow-hidden px-[14px] py-3 border-t-2 border-t-foreground ${j === 0 ? "text-[11px] text-btn-primary" : "text-[17px]"}`}
                  style={
                    j === 0
                      ? { fontFamily: "'Press Start 2P', monospace" }
                      : undefined
                  }
                >
                  <span className="truncate w-full">{cell}</span>
                </div>
              ));
            })}
          </div>
        )}
      </FlatPanel>
    </div>
  );
}
