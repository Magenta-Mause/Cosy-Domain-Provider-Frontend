import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";

import { useHeroSectionLogic } from "./useHeroSectionLogic";

export function HeroSection() {
  const { t } = useTranslation();
  const { subdomain, handleSubdomainChange, handleCheckAvailability } =
    useHeroSectionLogic();

  return (
    <section
      className="relative z-[2] mx-auto"
      style={{ padding: "60px 32px 40px", maxWidth: 1200 }}
    >
      <div
        className="grid items-center gap-12"
        style={{ gridTemplateColumns: "1.1fr 1fr" }}
      >
        <div className="flex flex-col gap-6">
          <div className="signpost self-start text-xs px-[14px] py-2">
            {t("hero.badge")}
          </div>
          <h1
            className="text-5xl leading-[1.3]"
            style={{
              color: "oklch(0.95 0.08 70)",
              textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
            }}
          >
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
          </h1>
          <p
            className="text-[22px] max-w-[480px] leading-[1.4]"
            style={{ color: "oklch(0.92 0.04 60)" }}
          >
            {t("hero.description")}
          </p>

          <FlatPanel className="p-4 max-w-[520px]">
            <label htmlFor="subdomain-input" className="plabel mb-[10px]">
              {t("hero.claimLabel")}
            </label>
            <div className="flex gap-2 items-stretch">
              <div className="relative flex-1">
                <input
                  id="subdomain-input"
                  data-testid="home-subdomain-input"
                  className="pinput"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  placeholder="my-castle"
                  style={{ paddingRight: 170 }}
                />
                <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-lg opacity-70 pointer-events-none">
                  .cosy-hosting.net
                </span>
              </div>
              <Button
                type="button"
                data-testid="home-check-btn"
                onClick={handleCheckAvailability}
              >
                {t("hero.checkButton")}
              </Button>
            </div>
          </FlatPanel>

          <div
            className="flex gap-6 flex-wrap text-lg"
            style={{ color: "oklch(0.92 0.04 60)" }}
          >
            <span>{t("hero.benefit1")}</span>
            <span>{t("hero.benefit2")}</span>
            <span>{t("hero.benefit3")}</span>
          </div>
        </div>

        <div className="relative h-[440px]">
          <FlatPanel
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.75 0.08 58)" }}
          >
            <div
              className="w-[88%] h-[88%] flex flex-col items-center justify-center gap-2.5 p-3 text-center"
              style={{
                background:
                  "repeating-linear-gradient(45deg, oklch(0.75 0.08 58) 0 8px, oklch(0.8 0.06 58) 8px 16px)",
                border: "3px dashed var(--foreground)",
                borderRadius: "var(--radius-sm)",
                color: "var(--foreground)",
              }}
            >
              <div className="pixel text-xs">[ hero pixel art ]</div>
              <div className="text-lg opacity-80">
                A cosy pixel-art post office with
                <br />
                mailboxes labeled with subdomains.
                <br />
                Cat on the roof is recommended.
              </div>
            </div>
          </FlatPanel>
        </div>
      </div>
    </section>
  );
}
