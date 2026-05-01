import { useTranslation } from "react-i18next";
import mailBoxImage from "@/assets/castle.png";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { useHeroSectionLogic } from "./useHeroSectionLogic";

export function HeroSection() {
  const { t } = useTranslation();
  const { subdomain, handleSubdomainChange, handleCheckAvailability } =
    useHeroSectionLogic();

  return (
    <section
      className="relative z-[2] mx-auto min-h-[85vh] flex items-center justify-center px-5 sm:px-8 pt-[60px] pb-10"
      style={{ maxWidth: 1200 }}
    >
      <div
        className="flex flex-col md:grid items-center gap-8 md:gap-12 w-full"
        style={{ gridTemplateColumns: "1.1fr 1fr" }}
      >
        <div className="flex flex-col gap-6">
          <h1
            className="text-4xl md:text-5xl leading-[1.3]"
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
            className="text-lg sm:text-[22px] max-w-[480px] leading-[1.4]"
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
                  className="pinput sm:pr-[210px]"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  placeholder="my-castle"
                />
                <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-lg opacity-70 pointer-events-none hidden sm:block">
                  .play.cosy-hosting.net
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
          </div>
        </div>

        <div className="relative h-[440px] hidden md:block">
          <FlatPanel
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.75 0.08 58)" }}
          >
            <div
              className="w-[95%] h-[95%] flex flex-col items-center justify-center gap-2.5 p-3 text-center"
              style={{
                background:
                  "repeating-linear-gradient(45deg, oklch(0.75 0.08 58) 0 8px, oklch(0.8 0.06 58) 8px 16px)",
                border: "3px dashed var(--foreground)",
                borderRadius: "var(--radius-sm)",
                color: "var(--foreground)",
              }}
            >
              <img
                src={mailBoxImage}
                alt={"Cosy Mailbox"}
                className={"w-[80%] select-none translate-x-7"}
                draggable={false}
              />
            </div>
          </FlatPanel>
        </div>
      </div>
    </section>
  );
}
