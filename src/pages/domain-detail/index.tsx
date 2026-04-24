import { AppHeader } from "@/components/layout/app-header";
import { DotLoader } from "@/components/pixel/dot-loader";
import { FlatPanel } from "@/components/pixel/panel";
import { CreateSubdomainForm } from "./components/create-subdomain-form";
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
    targetIpv6,
    setTargetIpv6,
    ipTab,
    setIpTab,
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
    ipv4Valid,
    ipv6Valid,
    atLeastOneIp,
    canSubmit,
    createdAt,
    handleSubmit,
    handleDelete,
  } = useDomainDetailLogic(domainId);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sky-bg">
          <AppHeader />
        </div>
        <div className="p-10 text-center text-lg">
          <DotLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DomainDetailHeader domain={domain} isCreateMode={isCreateMode} />
      <div className="px-7 pb-20 max-w-[1100px] mx-auto mt-[35px]">
        {!isCreateMode ? (
          <DomainTabBar activeTab={activeTab} onChange={setActiveTab} />
        ) : null}
        <FlatPanel className={`p-7 ${!isCreateMode && "rounded-tl-none"}`}>
          {isCreateMode ? (
            <CreateSubdomainForm
              isPlus={isPlus}
              isVerified={isVerified}
              label={label}
              onLabelChange={setLabel}
              targetIp={targetIp}
              onTargetIpChange={setTargetIp}
              targetIpv6={targetIpv6}
              onTargetIpv6Change={setTargetIpv6}
              ipTab={ipTab}
              onIpTabChange={setIpTab}
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              hasSubmitted={hasSubmitted}
              labelValid={labelValid}
              labelAvailability={labelAvailability}
              namingMode={namingMode}
              onNamingModeChange={setNamingMode}
              ipv4Valid={ipv4Valid}
              ipv6Valid={ipv6Valid}
              atLeastOneIp={atLeastOneIp}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
            />
          ) : null}
          {!isCreateMode && activeTab === "overview" ? (
            <OverviewTab
              domain={domain}
              label={label}
              targetIp={targetIp}
              onTargetIpChange={setTargetIp}
              targetIpv6={targetIpv6}
              onTargetIpv6Change={setTargetIpv6}
              ipTab={ipTab}
              onIpTabChange={setIpTab}
              errorMessage={activeTab === "overview" ? errorMessage : null}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              hasSubmitted={hasSubmitted}
              ipv4Valid={ipv4Valid}
              ipv6Valid={ipv6Valid}
              atLeastOneIp={atLeastOneIp}
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
