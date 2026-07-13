import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { UserDtoTier } from "@/api/generated/model";
import { Badge } from "@/components/pixel/badge.tsx";

const TierBadge = (props: { tier: UserDtoTier }) => {
  const { t } = useTranslation("billing");
  const isPlus = props.tier === "PLUS";
  const navigate = useNavigate();

  return (
    <Badge
      color={isPlus ? "accent" : "gray"}
      onClick={() => navigate({ to: "/billing" })}
      className="py-1 w-fit text-[14px]"
    >
      {isPlus ? "Cosy+" : t("billing.free")}
    </Badge>
  );
};

export default TierBadge;
