import { useTranslation } from "react-i18next";

import { KillSwitchPanel } from "./components/kill-switch-panel";
import { SubdomainStats } from "./components/subdomain-stats";
import { SubdomainsTable } from "./components/subdomains-table";
import { useSubdomainsTabLogic } from "./useSubdomainsTabLogic";

interface SubdomainsTabProps {
  readonly adminKey: string;
}

export function SubdomainsTab({ adminKey }: SubdomainsTabProps) {
  const { t } = useTranslation();
  const { isLoading, error, subdomains, total, failed, handleSubdomainClick } =
    useSubdomainsTabLogic(adminKey);

  if (isLoading)
    return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <KillSwitchPanel adminKey={adminKey} />
      <SubdomainStats total={total} failed={failed} />
      <SubdomainsTable
        subdomains={subdomains}
        onSubdomainClick={handleSubdomainClick}
      />
    </div>
  );
}
