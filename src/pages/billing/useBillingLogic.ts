import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

export function useBillingLogic() {
  const { t } = useTranslation();
  const { userPlan } = useAuthInformation();
  const { openBillingPortal } = useDataInteractions();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlus = userPlan === "PLUS";

  const handlePortalClick = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      await openBillingPortal();
    } catch {
      setError(t("billing.error"));
      setIsRedirecting(false);
    }
  };

  return { isPlus, isRedirecting, error, handlePortalClick };
}
