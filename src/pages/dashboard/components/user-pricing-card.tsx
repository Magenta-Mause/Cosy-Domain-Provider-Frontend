import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/pixel/badge";
import { FlatPanel } from "@/components/pixel/panel";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

interface UserPricingCardProps {
  serverCount: number;
}

const UserPricingCard = ({ serverCount }: UserPricingCardProps) => {
  const { maxSubdomainCount, userTier } = useAuthInformation();
  const { t } = useTranslation();
  const isPlus = userTier === "PLUS";

  return (
    <FlatPanel className="px-5 py-4 flex items-center justify-between gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <Badge className="text-sm">
            {serverCount}/{maxSubdomainCount ?? "—"}{" "}
            {t("dashboard.planCardSubdomains")}
          </Badge>
          <div className={"opacity-70 italic"}>
            {isPlus
              ? t("dashboard.planCardPricePlus")
              : t("dashboard.planCardPriceFree")}
          </div>
        </div>
      </div>

      <Link
        to="/billing"
        className="pbtn sm text-xl -my-1 secondary shrink-0 !py-1"
      >
        {t("dashboard.planCardManage")}
      </Link>
    </FlatPanel>
  );
};

export default UserPricingCard;
