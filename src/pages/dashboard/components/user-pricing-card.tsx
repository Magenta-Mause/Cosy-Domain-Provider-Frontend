import { Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/pixel/badge.tsx";
import { FlatPanel } from "@/components/pixel/panel.tsx";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation.ts";
import { useTranslation } from "react-i18next";

export type PricingModel = "FREE" | "COSY+";

const MAX_SUBDOMAINS: Record<PricingModel, number> = {
  "COSY+": 5,
  FREE: 1,
};

interface UserPricingCardProps {
  serverCount: number;
}

const UserPricingCard = ({ serverCount }: UserPricingCardProps) => {
  const { isVerified, userPlan } = useAuthInformation();
  const { t } = useTranslation();

  const pricingModel: PricingModel = userPlan === "PLUS" ? "COSY+" : "FREE";

  return (
    <FlatPanel className={"px-5 py-4 flex flex-col gap-2"}>
      <div className="flex items-center justify-between">
        <Badge
          color={pricingModel === "COSY+" ? "accent" : "gray"}
          className={"py-1 w-fit"}
        >
          {pricingModel === "COSY+" ? "Cosy +" : "Free"}
        </Badge>
        <Link
          to="/billing"
          className="text-xs opacity-60 hover:opacity-100 underline underline-offset-2"
        >
          {t("billing.manageLink")}
        </Link>
      </div>
      <div className={"flex gap-1 items-center"}>
        {isVerified ? (
          <>
            <Check size={"22"} />
            Account Verified
          </>
        ) : (
          <>
            <X size={"22"} />
            Account not Verified yet
          </>
        )}
      </div>
      <div className={"italic opacity-70"}>
        {serverCount}/{MAX_SUBDOMAINS[pricingModel]} Subdomains
      </div>
    </FlatPanel>
  );
};

export default UserPricingCard;
