import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@/components/pixel/error-message";
import { FormField } from "@/components/ui/form-field";

interface TargetIpTabsProps {
  readonly targetIp: string;
  readonly onTargetIpChange: (v: string) => void;
  readonly targetIpv6: string;
  readonly onTargetIpv6Change: (v: string) => void;
  readonly activeTab: "ipv4" | "ipv6";
  readonly onTabChange: (tab: "ipv4" | "ipv6") => void;
  readonly hasSubmitted: boolean;
  readonly ipv4Valid: boolean;
  readonly ipv6Valid: boolean;
  readonly atLeastOneIp: boolean;
}

export function TargetIpTabs({
  targetIp,
  onTargetIpChange,
  targetIpv6,
  onTargetIpv6Change,
  activeTab,
  onTabChange,
  hasSubmitted,
  ipv4Valid,
  ipv6Valid,
  atLeastOneIp,
}: TargetIpTabsProps) {
  const { t } = useTranslation();

  const showAtLeastOneError = hasSubmitted && !atLeastOneIp;
  const showIpv4Error = hasSubmitted && targetIp.trim() !== "" && !ipv4Valid;
  const showIpv6Error = hasSubmitted && targetIpv6.trim() !== "" && !ipv6Valid;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-0 border border-foreground rounded-radius-sm overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => onTabChange("ipv4")}
          className={`px-4 py-1.5 text-base font-medium transition-colors ${
            activeTab === "ipv4"
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          {t("createSubdomain.ipTabIpv4")}
          {targetIp.trim() !== "" && (
            <span
              className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${showIpv4Error ? "bg-destructive" : "bg-green-500"}`}
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("ipv6")}
          className={`px-4 py-1.5 text-base font-medium transition-colors ${
            activeTab === "ipv6"
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          {t("createSubdomain.ipTabIpv6")}
          {targetIpv6.trim() !== "" && (
            <span
              className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${showIpv6Error ? "bg-destructive" : "bg-green-500"}`}
            />
          )}
        </button>
      </div>

      {activeTab === "ipv4" && (
        <FormField
          id="targetIp"
          label={t("createSubdomain.targetIpv4")}
          value={targetIp}
          onChange={(v) => onTargetIpChange(v.trim())}
          placeholder="203.0.113.42"
          invalid={showIpv4Error}
          error={showIpv4Error ? t("domainDetail.ipv4Invalid") : null}
          hint={t("createSubdomain.targetIpv4Hint")}
          testId="domain-detail-target-ip-input"
          inputMode="decimal"
        />
      )}

      {activeTab === "ipv6" && (
        <FormField
          id="targetIpv6"
          label={t("createSubdomain.targetIpv6")}
          value={targetIpv6}
          onChange={(v) => onTargetIpv6Change(v.trim())}
          placeholder="2001:db8::1"
          invalid={showIpv6Error}
          error={showIpv6Error ? t("domainDetail.ipv6Invalid") : null}
          hint={t("createSubdomain.targetIpv6Hint")}
          testId="domain-detail-target-ipv6-input"
        />
      )}

      {showAtLeastOneError && (
        <ErrorMessage>{t("domainDetail.atLeastOneIpRequired")}</ErrorMessage>
      )}
    </div>
  );
}
