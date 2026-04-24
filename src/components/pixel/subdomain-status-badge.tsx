import { useTranslation } from "react-i18next";

import { SubdomainDtoStatus } from "@/api/generated/model";

import { Badge } from "@/components/pixel/badge";

interface SubdomainStatusBadgeProps {
  status: SubdomainDtoStatus;
  variant?: "dashboard" | "detail";
}

export function SubdomainStatusBadge({
  status,
  variant = "dashboard",
}: SubdomainStatusBadgeProps) {
  const { t } = useTranslation();

  if (status === SubdomainDtoStatus.ACTIVE) {
    return (
      <Badge color="green">
        {variant === "detail" ? t("status.tlsActive") : t("status.active")}
      </Badge>
    );
  }
  if (status === SubdomainDtoStatus.PENDING) {
    return (
      <Badge color="gray">
        ⌛{" "}
        {variant === "detail"
          ? t("status.awaitingVerify")
          : t("status.pending")}
      </Badge>
    );
  }
  return <Badge color="red">⚠ {t("status.failed")}</Badge>;
}
