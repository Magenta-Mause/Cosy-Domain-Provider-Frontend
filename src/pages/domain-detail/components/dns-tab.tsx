import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { FlatPanel } from "@/components/pixel/panel";

interface DnsTabProps {
  domain: SubdomainDto | undefined;
}

export function DnsTab({ domain }: DnsTabProps) {
  const { t } = useTranslation();

  const headers = ["Type", "Name", "Value", "TTL"];
  const rows = [
    ["A", domain?.label ?? "—", domain?.targetIp ?? "—", "300"],
    ["CNAME", `www.${domain?.label ?? "—"}`, domain?.fqdn ?? "—", "300"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>{t("domainDetail.dnsRecords")}</h3>
        <p className="text-base opacity-75 mt-1.5">
          {t("domainDetail.dnsManagedFor")}{" "}
          <span className="pixel text-xs text-btn-primary">
            {domain?.fqdn ?? domain?.label}
          </span>
          . {t("domainDetail.dnsTargetIp")}{" "}
          <span className="pixel text-xs text-btn-primary">
            {domain?.targetIp ?? "—"}
          </span>
        </p>
      </div>
      <FlatPanel className="p-0 overflow-hidden">
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
          {rows.map((row) =>
            row.map((cell, j) => (
              <div
                key={`${row[0]}-${headers[j]}`}
                className={`truncate px-[14px] py-3 border-t-2 border-t-foreground ${j === 0 ? "text-[11px] text-btn-primary" : "text-[17px]"}`}
                style={
                  j === 0
                    ? { fontFamily: "'Press Start 2P', monospace" }
                    : undefined
                }
              >
                {cell}
              </div>
            )),
          )}
        </div>
      </FlatPanel>
    </div>
  );
}
