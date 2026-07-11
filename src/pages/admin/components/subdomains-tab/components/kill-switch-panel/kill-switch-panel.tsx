import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

function killSwitchButtonLabel(
  t: TFunction,
  isToggling: boolean,
  enabled: boolean,
): string {
  if (isToggling) return t("admin.killSwitchToggling");
  return enabled ? t("admin.killSwitchDisable") : t("admin.killSwitchEnable");
}

import { FlatPanel } from "@/components/pixel/panel";

import { useKillSwitchLogic } from "./useKillSwitchLogic";

interface KillSwitchPanelProps {
  readonly adminKey: string;
}

export function KillSwitchPanel({ adminKey }: KillSwitchPanelProps) {
  const { t } = useTranslation();
  const { domainCreationEnabled, isLoading, isToggling, toggle } =
    useKillSwitchLogic(adminKey);

  if (isLoading) return null;

  return (
    <FlatPanel className="px-5 py-4 flex items-center gap-4">
      <div className="flex-1">
        <div className="pixel text-[10px] opacity-70">
          {t("admin.killSwitchTitle")}
        </div>
        <div className="text-sm mt-1 opacity-75">
          {t("admin.killSwitchDescription")}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`flex items-center gap-1.5 text-sm font-semibold ${domainCreationEnabled ? "text-green-600" : "text-destructive"}`}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full ${domainCreationEnabled ? "bg-green-600" : "bg-destructive"}`}
          />
          {domainCreationEnabled
            ? t("admin.killSwitchEnabled")
            : t("admin.killSwitchDisabled")}
        </span>
        <button
          type="button"
          onClick={toggle}
          disabled={isToggling}
          className={`pbtn sm ${domainCreationEnabled ? "destructive" : "primary"}`}
        >
          {killSwitchButtonLabel(t, isToggling, domainCreationEnabled)}
        </button>
      </div>
    </FlatPanel>
  );
}
