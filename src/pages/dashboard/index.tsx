import UserPricingCard from "@/pages/dashboard/components/user-pricing-card.tsx";

import { DashboardBanner } from "./components/DashboardBanner";
import { SubdomainList } from "./components/subdomain-list";
import { useDashboardLogic } from "./useDashboardLogic";

export function DashboardPage() {
  const { subdomains, isLoading, isError, isVerified, handleCreateNew } =
    useDashboardLogic();

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <DashboardBanner isVerified={isVerified} onCreateNew={handleCreateNew} />
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
