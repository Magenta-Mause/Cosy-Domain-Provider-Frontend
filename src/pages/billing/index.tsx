import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/pixel/badge";
import { ErrorMessage } from "@/components/pixel/error-message";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { BillingHeader } from "./components/BillingHeader";
import { useBillingLogic } from "./useBillingLogic";

export function BillingPage() {
  const { t } = useTranslation();
  const { isPlus, isVerified, isRedirecting, error, handlePortalClick } =
    useBillingLogic();

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <BillingHeader />
      <div className="flex flex-col p-[20px] max-w-[600px] mx-auto gap-5">
        <FlatPanel className="px-5 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-5">
            <span className="pixel text-xs opacity-60">
              {t("billing.currentPlan")}
            </span>
            <Badge color={isPlus ? "accent" : "gray"} className="py-1">
              {isPlus ? t("billing.plus") : t("billing.free")}
            </Badge>
          </div>

          <p className="text-sm opacity-80">
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
            {isRedirecting
              ? t("billing.redirecting")
              : isPlus
                ? t("billing.manageButton")
                : t("billing.upgradeButton")}
          </Button>
        </FlatPanel>

        {!isPlus && (
          <FlatPanel className="px-5 py-5 flex flex-col gap-2">
            <span className="pixel text-xs mb-2">Cosy+</span>
            <ul className="flex flex-col gap-1 text-sm opacity-80">
              <li>✓ {t("pricing.plusFeature1")}</li>
              <li>✓ {t("pricing.plusFeature2")}</li>
              <li>✓ {t("pricing.plusFeature3")}</li>
              <li>✓ {t("pricing.plusFeature4")}</li>
            </ul>
            <p className="text-xs mt-2 opacity-60">
              {t("pricing.plusPrice")} &mdash; {t("pricing.plusSupport")}
            </p>
          </FlatPanel>
        )}
      </div>
    </div>
  );
}
