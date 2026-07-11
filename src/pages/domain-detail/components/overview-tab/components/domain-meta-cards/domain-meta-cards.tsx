import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { FlatPanel } from "@/components/pixel/panel";

interface DomainMetaCardsProps {
  readonly domain: SubdomainDto | undefined;
  readonly createdAt: string;
}

export function DomainMetaCards({ domain, createdAt }: DomainMetaCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <FlatPanel className="p-4">
        <div className="pixel text-[10px] opacity-70">
          {t("domainDetail.domainFqdn")}
        </div>
        <div className="text-base mt-2 select-all font-mono opacity-80">
          {domain?.fqdn ?? "—"}
        </div>
      </FlatPanel>
      <FlatPanel className="p-4">
        <div className="pixel text-[10px] opacity-70">
          {t("domainDetail.createdLabel")}
        </div>
        <div className="text-base mt-2 opacity-80">{createdAt}</div>
      </FlatPanel>
    </div>
  );
}
