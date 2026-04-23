import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

function GrassSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.55 0.14 145) 0%, oklch(0.5 0.14 150) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 6px)",
        }}
      />
      {children}
    </div>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation();

  const stops = [
    {
      label: "STOP 01",
      title: t("features.stop1Title"),
      body: t("features.stop1Body"),
    },
    {
      label: "STOP 02",
      title: t("features.stop2Title"),
      body: t("features.stop2Body"),
    },
    {
      label: "STOP 03",
      title: t("features.stop3Title"),
      body: t("features.stop3Body"),
    },
  ];

  return (
    <GrassSection>
      <section id="features" className="pt-12 px-8 pb-20 relative z-[1]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 text-center flex flex-col gap-2">
            <h2 style={{ color: "oklch(0.95 0.08 70)" }}>
              {t("features.title")}
            </h2>
            <p className="text-xl" style={{ color: "oklch(0.95 0.04 60)" }}>
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {stops.map((f) => (
              <FlatPanel key={f.label} className="hover-lift p-5">
                <div className="flex flex-col gap-2">
                  <div className="pixel text-sm text-btn-primary">
                    {f.label}
                  </div>
                  <h3>{f.title}</h3>
                  <p className="text-lg leading-[1.4]">{f.body}</p>
                </div>
              </FlatPanel>
            ))}
          </div>
        </div>
      </section>
    </GrassSection>
  );
}
