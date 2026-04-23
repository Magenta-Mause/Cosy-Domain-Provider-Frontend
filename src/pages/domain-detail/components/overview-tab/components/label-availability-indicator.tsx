import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import type { LabelAvailability } from "@/pages/domain-detail/lib";

interface LabelAvailabilityIndicatorProps {
  availability: LabelAvailability;
}

export function LabelAvailabilityIndicator({
  availability,
}: LabelAvailabilityIndicatorProps) {
  const { t } = useTranslation();

  if (availability === "idle") return null;
  if (availability === "checking") {
    return (
      <span className="text-base opacity-60">
        {t("createSubdomain.labelChecking")}
      </span>
    );
  }
  if (availability === "available") {
    return (
      <span className="text-base text-success">
        ✓ {t("createSubdomain.labelAvailable")}
      </span>
    );
  }
  if (availability === "taken") {
    return <ErrorMessage>{t("createSubdomain.labelTaken")}</ErrorMessage>;
  }
  if (availability === "reserved") {
    return <ErrorMessage>{t("createSubdomain.labelReserved")}</ErrorMessage>;
  }

  return null;
}
