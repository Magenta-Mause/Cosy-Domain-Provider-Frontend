import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import type { DnsEntry } from "../lib";

interface DnsEntriesPanelProps {
  readonly entries: DnsEntry[];
}

export function DnsEntriesPanel({ entries }: DnsEntriesPanelProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">
        {t("admin.dnsEntriesSection")}
      </h3>
      <FlatPanel className="p-0 overflow-hidden">
        <div
          className="grid text-sm"
          style={{ gridTemplateColumns: "3fr 1fr 4fr" }}
        >
          {[
            t("admin.colDnsName"),
            t("admin.colDnsType"),
            t("admin.colDnsValue"),
          ].map((h) => (
            <div
              key={h}
              className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
            >
              {h}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="col-span-3 px-3 py-4 opacity-50 text-center">
              {t("admin.noDnsEntries")}
            </div>
          )}
          {entries.map((entry) => (
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
  );
}
