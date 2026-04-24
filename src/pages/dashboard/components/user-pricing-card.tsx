import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/pixel/badge";
import { FlatPanel } from "@/components/pixel/panel";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

interface UserPricingCardProps {
  serverCount: number;
}

const UserPricingCard = ({ serverCount }: UserPricingCardProps) => {
  const { isVerified, userTier, maxSubdomainCount } = useAuthInformation();
  const { t } = useTranslation();

  const isPlus = userTier === "PLUS";

  return (
    <FlatPanel className="px-5 py-4 flex items-center justify-between gap-6">
      <div className="flex flex-col gap-3">
        <Badge color={isPlus ? "accent" : "gray"} className="py-1 w-fit">
          {isPlus ? "Cosy+" : t("billing.free")}
        </Badge>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm">
            {isVerified ? (
              <>
                <Check size={16} />
                <span>{t("dashboard.planCardVerified")}</span>
              </>
            ) : (
              <>
                <X size={16} className="opacity-60" />
                <span className="opacity-60">
                  {t("dashboard.planCardNotVerified")}
                </span>
              </>
            )}
          </div>
          <div className="text-sm opacity-60 italic">
            {serverCount}/{maxSubdomainCount ?? "—"}{" "}
            {t("dashboard.planCardSubdomains")}
          </div>
        </div>
      </div>

      <Link to="/billing" className="pbtn sm secondary shrink-0">
        {t("dashboard.planCardManage")}
      </Link>
    </FlatPanel>
  );
};

export default UserPricingCard;
