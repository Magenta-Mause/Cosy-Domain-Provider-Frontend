import UserPricingCard from "@/pages/dashboard/components/user-pricing-card.tsx";

import { DashboardBanner } from "./components/dashboard-banner.tsx";
import { SubdomainList } from "./components/subdomain-list";
import { useDashboardLogic } from "./useDashboardLogic";

export function DashboardPage() {
  const {
    subdomains,
    isLoading,
    isError,
    isVerified,
    userTier,
    isSlotsExhausted,
    handleCreateNew,
  } = useDashboardLogic();

  return (
    <div className="min-h-screen bg-background">
      <DashboardBanner
        isVerified={isVerified}
        isSlotsExhausted={isSlotsExhausted}
        userTier={userTier}
        onCreateNew={handleCreateNew}
      />
      <div className="flex flex-col p-[20px] max-w-[1200px] mx-auto my-0 gap-5">
        <UserPricingCard serverCount={subdomains.length} />
        <SubdomainList
          subdomains={subdomains}
          isLoading={isLoading}
          isError={isError}
          isVerified={isVerified}
        />
      </div>
    </div>
  );
}
