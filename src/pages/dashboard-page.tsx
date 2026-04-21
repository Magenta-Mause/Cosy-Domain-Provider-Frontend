import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { SubdomainDtoStatus } from "@/api/generated/model";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/pixel/badge";
import { Mailbox } from "@/components/pixel/mailbox";
import { FlatPanel } from "@/components/pixel/panel";
import { StatusDot } from "@/components/pixel/status-dot";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { useAppSelector } from "@/store/hooks";

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loadSubdomains } = useDataLoading();
  const subdomains = useAppSelector(
    (state) => state.subdomains.items,
  ) as SubdomainDto[];
  const isLoading =
    useAppSelector((state) => state.subdomains.state) === "loading";
  const isError =
    useAppSelector((state) => state.subdomains.state) === "failed";
  const [filter, setFilter] = useState<"all" | SubdomainDtoStatus>("all");

  useEffect(() => {
    void loadSubdomains();
  }, [loadSubdomains]);

  const filtered =
    filter === "all"
      ? subdomains
      : subdomains.filter((d) => d.status === filter);

  const onlineCount = subdomains.filter(
    (d) => d.status === SubdomainDtoStatus.ACTIVE,
  ).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Sky header */}
      <div className="sky-bg overflow-visible">
        <AppHeader />
        <div
          style={{
            padding: "20px 28px 20px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                className="pixel"
                style={{ fontSize: 11, color: "oklch(0.92 0.05 70)" }}
              >
                POST OFFICE
              </div>
              <h1
                style={{
                  color: "oklch(0.95 0.08 70)",
                  textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
                }}
              >
                {t("dashboard.title")}
              </h1>
            </div>
            <button
              type="button"
              data-testid="dashboard-create-new-btn"
              className="pbtn lg"
              onClick={() =>
                void navigate({
                  to: "/domain/$domainId",
                  params: { domainId: "new" },
                })
              }
            >
              + {t("dashboard.createNew")}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "20px 28px 60px",
          maxWidth: 1200,
          margin: "0 auto",
          marginTop: 0,
        }}
      >
        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              l: "Mailboxes",
              v: String(subdomains.length),
              sub: "domains registered",
            },
            {
              l: "Active",
              v: String(onlineCount),
              sub:
                onlineCount === subdomains.length && subdomains.length > 0
                  ? "all active"
                  : "online",
            },
            {
              l: "Pending",
              v: String(
                subdomains.filter(
                  (d) => d.status === SubdomainDtoStatus.PENDING,
                ).length,
              ),
              sub: "awaiting verification",
            },
          ].map((s) => (
            <FlatPanel key={s.l} style={{ padding: 16 }}>
              <div className="pixel" style={{ fontSize: 10, opacity: 0.7 }}>
                {s.l.toUpperCase()}
              </div>
              <div
                className="pixel"
                style={{
                  fontSize: 22,
                  color: "var(--btn-primary)",
                  marginTop: 8,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 15, marginTop: 4, opacity: 0.75 }}>
                {s.sub}
              </div>
            </FlatPanel>
          ))}
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          {(
            [
              ["all", "All"],
              [SubdomainDtoStatus.ACTIVE, "Active"],
              [SubdomainDtoStatus.PENDING, "Pending"],
              [SubdomainDtoStatus.FAILED, "Failed"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              data-testid={`dashboard-filter-${String(k).toLowerCase()}-btn`}
              className={filter === k ? "pbtn sm" : "pbtn sm secondary"}
              onClick={() => setFilter(k)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mailbox list */}
        {isLoading ? (
          <div
            className="panel-flat"
            style={{ padding: 40, textAlign: "center", fontSize: 18 }}
          >
            <span className="dotloader">
              <span />
              <span />
              <span />
            </span>
          </div>
        ) : isError ? (
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
        ) : filtered.length === 0 ? (
          <div
            className="panel-flat"
            style={{ padding: 24, textAlign: "center", fontSize: 18 }}
          >
            {subdomains.length === 0
              ? t("dashboard.empty")
              : "No domains match this filter."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((d) => (
              <button
                key={d.uuid}
                type="button"
                data-testid={`dashboard-domain-item-${d.uuid}`}
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
                    params: { domainId: d.uuid as string },
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                  }}
                >
                  <Mailbox
                    size={48}
                    flag={
                      d.status === SubdomainDtoStatus.ACTIVE
                        ? "oklch(0.65 0.2 145)"
                        : "var(--destructive)"
                    }
                  />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <div
                        className="pixel"
                        style={{ fontSize: 16, color: "var(--btn-primary)" }}
                      >
                        {d.fqdn ?? d.label}
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
                      {d.status ? <StatusDot status={d.status} /> : null}
                      {d.targetIp ? (
                        <span>→ {d.targetIp}</span>
                      ) : (
                        <span style={{ opacity: 0.7 }}>not connected</span>
                      )}
                    </div>
                  </div>
                  {d.status === SubdomainDtoStatus.ACTIVE ? (
                    <Badge color="green">🔒 Active</Badge>
                  ) : d.status === SubdomainDtoStatus.PENDING ? (
                    <Badge color="gray">⌛ Pending</Badge>
                  ) : (
                    <Badge color="red">⚠ Failed</Badge>
                  )}
                  <span style={{ fontSize: 22, opacity: 0.6 }}>→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
