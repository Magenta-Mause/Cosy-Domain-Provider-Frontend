import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubdomainDtoStatus } from "@/api/generated/model";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/pixel/badge";
import { Mailbox } from "@/components/pixel/mailbox";
import { FlatPanel, Panel } from "@/components/pixel/panel";
import { StatusDot } from "@/components/pixel/status-dot";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { useAppSelector } from "@/store/hooks";

const LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const IPV4_PATTERN =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function DomainDetailPage({ domainId }: { domainId: string }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isCreateMode = domainId === "new";
  const { createSubdomain, updateSubdomain, deleteSubdomain } =
    useDataInteractions();
  const { loadSubdomainByUuid } = useDataLoading();
  const cachedSubdomain = useAppSelector((state) =>
    state.subdomains.items.find((item) => item.uuid === domainId),
  );
  const [loadedSubdomain, setLoadedSubdomain] =
    useState<typeof cachedSubdomain>(undefined);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [targetIp, setTargetIp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "dns" | "danger">(
    "overview",
  );

  useEffect(() => {
    if (isCreateMode) return;

    if (cachedSubdomain?.uuid) {
      setLoadedSubdomain(cachedSubdomain);
      setLabel(cachedSubdomain.label ?? "");
      setTargetIp(cachedSubdomain.targetIp ?? "");
      return;
    }

    let active = true;
    setIsInitialLoading(true);
    void (async () => {
      const loaded = await loadSubdomainByUuid(domainId);
      if (!active) return;
      setIsInitialLoading(false);
      if (!loaded) {
        setErrorMessage(t("domainDetail.loadError"));
        return;
      }
      setLoadedSubdomain(loaded);
      setLabel(loaded.label ?? "");
      setTargetIp(loaded.targetIp ?? "");
    })();

    return () => {
      active = false;
    };
  }, [cachedSubdomain, domainId, isCreateMode, loadSubdomainByUuid, t]);

  const domain = cachedSubdomain ?? loadedSubdomain;

  const labelValid = useMemo(
    () => (isCreateMode ? LABEL_PATTERN.test(label) : true),
    [isCreateMode, label],
  );
  const ipValid = IPV4_PATTERN.test(targetIp);
  const canSubmit = labelValid && ipValid && !isSubmitting;

  const locale = i18n.language.toLowerCase().startsWith("de")
    ? "de-DE"
    : "en-US";
  const createdAt = domain?.createdAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(domain.createdAt))
    : t("domainDetail.unknownValue");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);
    if (!labelValid || !ipValid) return;

    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        const created = await createSubdomain({ label, targetIp });
        if (created.uuid) {
          await navigate({
            to: "/domain/$domainId",
            params: { domainId: created.uuid },
          });
        } else {
          await navigate({ to: "/dashboard" });
        }
      } else {
        await updateSubdomain(domainId, { targetIp });
      }
    } catch {
      setErrorMessage(
        isCreateMode
          ? t("createSubdomain.error")
          : t("domainDetail.updateError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (isCreateMode) return;
    const shouldDelete = window.confirm(t("domainDetail.deleteConfirm"));
    if (!shouldDelete) return;

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteSubdomain(domainId);
      await navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage(t("domainDetail.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isInitialLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div className="sky-bg">
          <AppHeader />
        </div>
        <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
          <span className="dotloader">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
    );
  }

  const tabs = isCreateMode
    ? ([] as Array<[string, string]>)
    : ([
        ["overview", "Overview"],
        ["dns", "DNS records"],
        ["danger", "Danger zone"],
      ] as Array<[string, string]>);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Sky header */}
      <div className="sky-bg">
        <AppHeader />
        <div style={{ padding: "20px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <Link
            to="/dashboard"
            data-testid="domain-detail-back-link"
            style={{
              color: "oklch(0.95 0.08 70)",
              fontSize: 16,
              display: "block",
              marginBottom: 12,
            }}
          >
            ← {t("domainDetail.backToDomains")}
          </Link>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Mailbox size={64} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
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
                  {domain.status === SubdomainDtoStatus.ACTIVE ? (
                    <Badge color="green">🔒 TLS Active</Badge>
                  ) : domain.status === SubdomainDtoStatus.PENDING ? (
                    <Badge color="gray">⌛ Awaiting verify</Badge>
                  ) : (
                    <Badge color="red">⚠ Failed</Badge>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 28px 80px",
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: 35,
        }}
      >
        {/* Tabs for existing domains */}
        {!isCreateMode ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
            {tabs.map(([k, l]) => (
              <button
                key={k}
                type="button"
                data-testid={`domain-detail-tab-${k}-btn`}
                className="pixel"
                onClick={() => setActiveTab(k as typeof activeTab)}
                style={{
                  padding: "10px 16px",
                  fontSize: 11,
                  background:
                    activeTab === k
                      ? "var(--secondary-background)"
                      : "transparent",
                  border: "3px solid var(--foreground)",
                  borderBottom:
                    activeTab === k
                      ? "3px solid var(--secondary-background)"
                      : "3px solid var(--foreground)",
                  borderTopLeftRadius: "var(--radius-sm)",
                  borderTopRightRadius: "var(--radius-sm)",
                  color:
                    activeTab === k
                      ? "var(--btn-primary)"
                      : "var(--foreground)",
                  marginBottom: -3,
                  position: "relative",
                  zIndex: activeTab === k ? 2 : 1,
                  cursor: "pointer",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}

        <FlatPanel style={{ padding: 28, borderTopLeftRadius: 0 }}>
          {/* ── Overview / Edit form ── */}
          {isCreateMode || activeTab === "overview" ? (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {!isCreateMode ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <FlatPanel style={{ padding: 16 }}>
                    <div
                      className="pixel"
                      style={{ fontSize: 10, opacity: 0.7 }}
                    >
                      FQDN
                    </div>
                    <div style={{ fontSize: 18, marginTop: 6 }}>
                      {domain?.fqdn ?? "—"}
                    </div>
                  </FlatPanel>
                  <FlatPanel style={{ padding: 16 }}>
                    <div
                      className="pixel"
                      style={{ fontSize: 10, opacity: 0.7 }}
                    >
                      CREATED
                    </div>
                    <div style={{ fontSize: 18, marginTop: 6 }}>
                      {createdAt}
                    </div>
                  </FlatPanel>
                </div>
              ) : null}

              <fieldset
                style={{
                  border: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
                disabled={isSubmitting || isDeleting}
              >
                <legend className="sr-only">
                  {t("domainDetail.formLegend")}
                </legend>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <label className="plabel" htmlFor="label">
                    {t("createSubdomain.label")}
                  </label>
                  <input
                    id="label"
                    data-testid="domain-detail-label-input"
                    className={`pinput${hasSubmitted && !labelValid ? " invalid" : ""}`}
                    required
                    value={label}
                    onChange={(e) =>
                      setLabel(e.target.value.toLowerCase().trim())
                    }
                    placeholder="my-castle"
                    readOnly={!isCreateMode}
                  />
                  <div style={{ fontSize: 16, opacity: 0.65 }}>
                    {!isCreateMode
                      ? t("domainDetail.labelReadonly")
                      : t("createSubdomain.labelHint")}
                  </div>
                  {hasSubmitted && !labelValid ? (
                    <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                      ⚠ {t("domainDetail.labelInvalid")}
                    </div>
                  ) : null}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <label className="plabel" htmlFor="targetIp">
                    {t("createSubdomain.targetIp")}
                  </label>
                  <input
                    id="targetIp"
                    data-testid="domain-detail-target-ip-input"
                    className={`pinput${hasSubmitted && !ipValid ? " invalid" : ""}`}
                    required
                    value={targetIp}
                    onChange={(e) => setTargetIp(e.target.value.trim())}
                    placeholder="203.0.113.42"
                    inputMode="decimal"
                  />
                  <div style={{ fontSize: 16, opacity: 0.65 }}>
                    {t("createSubdomain.targetIpHint")}
                  </div>
                  {hasSubmitted && !ipValid ? (
                    <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                      ⚠ {t("domainDetail.ipInvalid")}
                    </div>
                  ) : null}
                </div>
              </fieldset>

              {errorMessage ? (
                <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                  ⚠ {errorMessage}
                </div>
              ) : null}

              <div
                style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
              >
                <Link
                  to="/dashboard"
                  data-testid="domain-detail-back-btn"
                  className="pbtn ghost"
                >
                  ← {t("domainDetail.backToDomains")}
                </Link>
                <button
                  type="submit"
                  data-testid="domain-detail-submit-btn"
                  className="pbtn lg"
                  disabled={!canSubmit}
                >
                  {isSubmitting
                    ? t("domainDetail.saving")
                    : isCreateMode
                      ? t("domainDetail.createAction")
                      : t("domainDetail.saveAction")}
                </button>
              </div>
            </form>
          ) : null}

          {/* ── DNS tab ── */}
          {!isCreateMode && activeTab === "dns" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3>DNS records</h3>
                <p style={{ fontSize: 16, opacity: 0.75, marginTop: 6 }}>
                  Managed automatically for{" "}
                  <span
                    className="pixel"
                    style={{ fontSize: 12, color: "var(--btn-primary)" }}
                  >
                    {domain?.fqdn ?? domain?.label}
                  </span>
                  . Target IP:{" "}
                  <span
                    className="pixel"
                    style={{ fontSize: 12, color: "var(--btn-primary)" }}
                  >
                    {domain?.targetIp ?? "—"}
                  </span>
                </p>
              </div>
              <FlatPanel style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1.5fr 2fr 80px",
                    gap: 0,
                  }}
                >
                  {["Type", "Name", "Value", "TTL"].map((h) => (
                    <div
                      key={h}
                      className="pixel"
                      style={{
                        padding: "10px 14px",
                        fontSize: 10,
                        background: "var(--btn-primary)",
                        color: "var(--btn-secondary)",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                  {[
                    ["A", domain?.label ?? "—", domain?.targetIp ?? "—", "300"],
                    [
                      "CNAME",
                      `www.${domain?.label ?? "—"}`,
                      domain?.fqdn ?? "—",
                      "300",
                    ],
                  ].map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        style={
                          {
                            padding: "12px 14px",
                            fontSize: j === 0 ? 11 : 17,
                            borderTop: "2px solid var(--foreground)",
                            fontFamily:
                              j === 0
                                ? "'Press Start 2P', monospace"
                                : undefined,
                            color: j === 0 ? "var(--btn-primary)" : undefined,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          } as React.CSSProperties
                        }
                      >
                        {cell}
                      </div>
                    )),
                  )}
                </div>
              </FlatPanel>
            </div>
          ) : null}

          {/* ── Danger zone tab ── */}
          {!isCreateMode && activeTab === "danger" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ color: "var(--destructive)" }}>
                {t("domainDetail.dangerZone")}
              </h3>
              {errorMessage ? (
                <div style={{ fontSize: 16, color: "var(--destructive)" }}>
                  ⚠ {errorMessage}
                </div>
              ) : null}
              <Panel style={{ padding: 18, borderColor: "var(--destructive)" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      className="pixel"
                      style={{ fontSize: 13, color: "var(--destructive)" }}
                    >
                      {t("domainDetail.dangerZone")}
                    </div>
                    <div style={{ fontSize: 16, opacity: 0.8 }}>
                      {t("domainDetail.deleteDescription")}
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="domain-detail-delete-btn"
                    className="pbtn destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting
                      ? t("dashboard.deleting")
                      : t("dashboard.delete")}
                  </button>
                </div>
              </Panel>
            </div>
          ) : null}
        </FlatPanel>
      </div>
    </div>
  );
}
