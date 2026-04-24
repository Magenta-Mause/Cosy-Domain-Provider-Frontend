import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/pixel/badge";
import { Panel } from "@/components/pixel/panel";

export function PricingSection() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="px-8 py-[60px] bg-background">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8 text-center flex flex-col gap-2">
          <h2>{t("pricing.title")}</h2>
          <p className="text-xl max-w-[520px] mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Panel className="p-7">
            <div className="h-full flex flex-col gap-4 justify-between">
              <div className="w-full flex flex-col gap-3">
                <Badge color="gray">{t("pricing.freeBadge")}</Badge>
                <h3>{t("pricing.freeTitle")}</h3>
                <div className="pixel text-[26px] text-btn-primary">
                  {t("pricing.freePrice")}
                </div>
                <ul className="list-none p-0 m-0 stack-sm">
                  <li>{t("pricing.freeFeature1")}</li>
                  <li>{t("pricing.freeFeature2")}</li>
                  <li className="opacity-[0.55]">
                    {t("pricing.freeLimitation")}
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                data-testid="home-register-free-link"
                className="pbtn secondary text-center"
              >
                {t("pricing.freeButton")}
              </Link>
            </div>
          </Panel>

          <Panel className="p-7 border-accent">
            <div className="flex flex-col gap-4">
              <div className="w-full flex flex-col gap-3">
                <Badge>{t("pricing.plusBadge")}</Badge>
                <h3>{t("pricing.plusTitle")}</h3>
                <div className="pixel text-[26px] text-btn-primary">
                  {t("pricing.plusPrice")}
                </div>
                <ul className="list-none p-0 m-0 stack-sm">
                  <li>{t("pricing.plusFeature1")}</li>
                  <li>{t("pricing.plusFeature2")}</li>
                  <li className="font-bold text-accent-4 py-3">
                    {t("pricing.plusSupport")}
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                data-testid="home-register-plus-link"
                className="pbtn text-center"
              >
                {t("pricing.plusButton")}
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
