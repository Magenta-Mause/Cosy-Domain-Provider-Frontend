import { AppHeader } from "@/components/layout/app-header";
import { DotLoader } from "@/components/pixel/dot-loader";
import { FlatPanel } from "@/components/pixel/panel";
import { DangerTab } from "./components/danger-tab";
import { DnsTab } from "./components/dns-tab";
import { DomainDetailHeader } from "./components/domain-detail-header.tsx";
import { DomainTabBar } from "./components/domain-tab-bar";
import { OverviewTab } from "./components/overview-tab";
import { useDomainDetailLogic } from "./useDomainDetailLogic";

export function DomainDetailPage({ domainId }: { domainId: string }) {
  const {
    domain,
    isCreateMode,
    isPlus,
    isVerified,
    isInitialLoading,
    label,
    setLabel,
    targetIp,
    setTargetIp,
    errorMessage,
    isSubmitting,
    isDeleting,
    hasSubmitted,
    activeTab,
    setActiveTab,
    labelValid,
    labelAvailability,
    namingMode,
    setNamingMode,
    ipValid,
    canSubmit,
    createdAt,
    handleSubmit,
    handleDelete,
  } = useDomainDetailLogic(domainId);

  if (isInitialLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div className="sky-bg">
          <AppHeader />
        </div>
        <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
          <DotLoader />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <DomainDetailHeader domain={domain} isCreateMode={isCreateMode} />
      <div
        style={{
          padding: "0 28px 80px",
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: 35,
        }}
      >
        {!isCreateMode ? (
          <DomainTabBar activeTab={activeTab} onChange={setActiveTab} />
        ) : null}
        <FlatPanel
          style={{
            padding: 28,
            borderTopLeftRadius: activeTab === "overview" ? 0 : undefined,
          }}
        >
          {isCreateMode || activeTab === "overview" ? (
            <OverviewTab
              domain={domain}
              isCreateMode={isCreateMode}
              isPlus={isPlus}
              isVerified={isVerified}
              label={label}
              onLabelChange={setLabel}
              targetIp={targetIp}
              onTargetIpChange={setTargetIp}
              errorMessage={activeTab === "overview" ? errorMessage : null}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              hasSubmitted={hasSubmitted}
              labelValid={labelValid}
              labelAvailability={labelAvailability}
              namingMode={namingMode}
              onNamingModeChange={setNamingMode}
              ipValid={ipValid}
              canSubmit={canSubmit}
              createdAt={createdAt}
              onSubmit={handleSubmit}
            />
          ) : null}
          {!isCreateMode && activeTab === "dns" ? (
            <DnsTab domain={domain} />
          ) : null}
          {!isCreateMode && activeTab === "danger" ? (
            <DangerTab
              errorMessage={activeTab === "danger" ? errorMessage : null}
              isDeleting={isDeleting}
              onDelete={handleDelete}
            />
          ) : null}
        </FlatPanel>
      </div>
    </div>
  );
}
