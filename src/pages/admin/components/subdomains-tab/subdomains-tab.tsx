import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatPanel } from "@/components/pixel/panel";
import { type AdminSubdomain, adminApi } from "../../lib";

type SortKey = "label" | "createdAt";

interface SubdomainsTabProps {
  adminKey: string;
}

export function SubdomainsTab({ adminKey }: SubdomainsTabProps) {
  const { t } = useTranslation();
  const [subdomains, setSubdomains] = useState<AdminSubdomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getSubdomains(adminKey)
      .then(setSubdomains)
      .catch(() => setError(t("admin.loadSubdomainsError")))
      .finally(() => setIsLoading(false));
  }, [adminKey, t]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const sorted = [...subdomains].sort((a, b) => {
    const mult = sortDir === "asc" ? 1 : -1;
    if (sortBy === "label") return mult * a.label.localeCompare(b.label);
    return (
      mult * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    );
  });

  const total = subdomains.length;
  const failed = subdomains.filter((s) => s.status === "FAILED").length;

  if (isLoading) return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>;

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
    >
      {label}
      {sortBy === k && (
        <span className="text-[10px] opacity-60">
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {[
          { label: t("admin.statTotal"), value: total, sub: t("admin.statTotalSub"), color: "text-btn-primary" },
          { label: t("admin.statFailed"), value: failed, sub: t("admin.statFailedSub"), color: "text-destructive" },
          { label: t("admin.statActive"), value: total - failed, sub: t("admin.statActiveSub"), color: "text-green-600" },
        ].map((s) => (
          <FlatPanel key={s.label} className="p-4 flex-1">
            <div className="pixel text-[10px] opacity-70">{s.label}</div>
            <div className={`pixel text-[22px] mt-2 ${s.color}`}>{s.value}</div>
            <div className="text-[15px] mt-1 opacity-75">{s.sub}</div>
          </FlatPanel>
        ))}
      </div>

      <FlatPanel className="p-0 overflow-hidden">
        <div
          className="grid text-sm"
          style={{ gridTemplateColumns: "2fr 2.5fr 1fr 1fr 1fr 1.5fr 1fr" }}
        >
          {[
            t("admin.colLabel"),
            t("admin.colFqdn"),
            t("admin.colStatus"),
            t("admin.colMode"),
            t("admin.colTargetIpv4"),
            t("admin.colOwner"),
            t("admin.colCreated"),
          ].map((h, i) => (
            <div
              key={h}
              className="px-3 py-2 bg-btn-primary text-btn-secondary font-bold"
            >
              {i === 0 ? (
                <SortBtn k="label" label={h} />
              ) : i === 6 ? (
                <SortBtn k="createdAt" label={h} />
              ) : (
                h
              )}
            </div>
          ))}
          {sorted.map((s) => {
            const statusColor =
              s.status === "ACTIVE"
                ? "text-green-600"
                : s.status === "FAILED"
                  ? "text-destructive"
                  : "text-yellow-400";
            return [
              <div
                key={`${s.uuid}-label`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate font-mono"
              >
                {s.label}
              </div>,
              <div
                key={`${s.uuid}-fqdn`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70"
              >
                {s.fqdn ?? "—"}
              </div>,
              <div
                key={`${s.uuid}-status`}
                className={`px-3 py-2.5 border-t border-foreground/10 ${statusColor}`}
              >
                {s.status}
              </div>,
              <div
                key={`${s.uuid}-mode`}
                className="px-3 py-2.5 border-t border-foreground/10 opacity-70"
              >
                {s.labelMode}
              </div>,
              <div
                key={`${s.uuid}-ip`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70"
              >
                {s.targetIp ?? "—"}
              </div>,
              <div
                key={`${s.uuid}-owner`}
                className="px-3 py-2.5 border-t border-foreground/10 truncate opacity-70"
              >
                {s.ownerEmail}
              </div>,
              <div
                key={`${s.uuid}-date`}
                className="px-3 py-2.5 border-t border-foreground/10 opacity-70"
              >
                {new Date(s.createdAt).toLocaleDateString()}
              </div>,
            ];
          })}
        </div>
      </FlatPanel>
    </div>
  );
}
