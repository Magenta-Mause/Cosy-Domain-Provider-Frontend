import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

export function useBillingLogic() {
  const { t } = useTranslation();
  const { userPlan, isVerified } = useAuthInformation();
  const { openBillingPortal, openCheckout } = useDataInteractions();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlus = userPlan === "PLUS";

  const handlePortalClick = async () => {
    if (!isVerified) {
      setError(t("billing.verifyRequired"));
      return;
    }
    setError(null);
    setIsRedirecting(true);
    try {
      if (isPlus) {
        await openBillingPortal();
      } else {
        await openCheckout();
      }
    } catch {
      setError(t("billing.error"));
      setIsRedirecting(false);
    }
  };

  return { isPlus, isVerified, isRedirecting, error, handlePortalClick };
}
