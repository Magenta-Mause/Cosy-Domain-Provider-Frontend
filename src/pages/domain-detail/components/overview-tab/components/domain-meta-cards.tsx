import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { FlatPanel } from "@/components/pixel/panel";

interface DomainMetaCardsProps {
  domain: SubdomainDto | undefined;
  createdAt: string;
}

export function DomainMetaCards({ domain, createdAt }: DomainMetaCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4 mb-2">
      <FlatPanel className="p-4">
        <div className="pixel text-[10px] opacity-70">
          {t("domainDetail.domainFqdn")}
        </div>
        <div className="text-lg mt-1.5 select-all">{domain?.fqdn ?? "—"}</div>
      </FlatPanel>
      <FlatPanel className="p-4">
        <div className="pixel text-[10px] opacity-70">
          {t("domainDetail.createdLabel")}
        </div>
        <div className="text-lg mt-1.5">{createdAt}</div>
      </FlatPanel>
    </div>
  );
}
