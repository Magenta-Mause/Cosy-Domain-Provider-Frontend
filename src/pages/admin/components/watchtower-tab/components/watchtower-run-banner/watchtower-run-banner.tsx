import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

interface WatchtowerRunBannerProps {
  readonly lastScanAt: string | null;
  readonly scannedSubdomains: number;
}

export function WatchtowerRunBanner({
  lastScanAt,
  scannedSubdomains,
}: WatchtowerRunBannerProps) {
  const { t } = useTranslation("admin");

  return (
    <FlatPanel className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`inline-block w-3 h-3 rounded-full ${lastScanAt ? "bg-success" : "bg-destructive"}`}
        />
        <span className="pixel text-[10px]">{t("watchtower.runLabel")}</span>
        <span className="text-[17px]">
          {lastScanAt
            ? t("watchtower.runInfo", {
                when: new Date(lastScanAt).toLocaleString(),
                count: scannedSubdomains,
              })
            : t("watchtower.runNever")}
        </span>
      </div>
      <p className="text-[16px] opacity-75">{t("watchtower.pipeline")}</p>
    </FlatPanel>
  );
}
