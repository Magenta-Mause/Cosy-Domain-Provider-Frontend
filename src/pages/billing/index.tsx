import { Link } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/pixel/badge";
import { ErrorMessage } from "@/components/pixel/error-message";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { BillingHeader } from "./components/billing-header";
import { useBillingLogic } from "./useBillingLogic";

function billingButtonLabel(
  t: TFunction,
  isRedirecting: boolean,
  isPlus: boolean,
): string {
  if (isRedirecting) return t("billing.redirecting");
  return isPlus ? t("billing.manageButton") : t("billing.upgradeButton");
}

export function BillingPage() {
  const { t } = useTranslation();
  const { isPlus, isVerified, isRedirecting, error, handlePortalClick } =
    useBillingLogic();

  return (
    <div className="min-h-screen bg-background">
      <BillingHeader />
      <div className="flex flex-col p-[20px] max-w-[600px] mx-auto gap-5">
        <FlatPanel className="px-5 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-5">
            <span className="pixel text-sm">{t("billing.currentPlan")}</span>
            <Badge color={isPlus ? "accent" : "gray"} className="py-1">
              {isPlus ? t("billing.plus") : t("billing.free")}
            </Badge>
          </div>

          <p className="text-base opacity-80">
            {isPlus ? t("billing.plusPlanDesc") : t("billing.freePlanDesc")}
          </p>

          {!isPlus && !isVerified && (
            <ErrorMessage>
              {t("billing.verifyRequired")}{" "}
              <Link to="/verify" className="underline">
                {t("billing.verifyLink")}
              </Link>
            </ErrorMessage>
          )}

          {error && isVerified && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            type="button"
            data-testid="billing-portal-btn"
            onClick={handlePortalClick}
            disabled={isRedirecting || (!isPlus && !isVerified)}
            className="w-fit"
          >
            {billingButtonLabel(t, isRedirecting, isPlus)}
          </Button>
        </FlatPanel>

        {!isPlus && (
          <FlatPanel className="px-5 py-5 flex flex-col gap-2">
            <span className="pixel text-sm mb-2">Cosy+</span>
            <ul className="flex flex-col gap-2 text-base opacity-80">
              <li>{t("pricing.plusFeature1")}</li>
              <li>{t("pricing.plusFeature2")}</li>
            </ul>
            <p className="text-sm mt-3 opacity-60">
              {t("pricing.plusPrice")} &mdash; {t("pricing.plusSupport")}
            </p>
          </FlatPanel>
        )}
      </div>
    </div>
  );
}
