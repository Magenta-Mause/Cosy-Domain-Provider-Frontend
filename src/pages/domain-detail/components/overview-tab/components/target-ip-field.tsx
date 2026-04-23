import { useTranslation } from "react-i18next";

import { InputField } from "@/components/ui/input-field";

interface TargetIpFieldProps {
  targetIp: string;
  onTargetIpChange: (v: string) => void;
  hasSubmitted: boolean;
  ipValid: boolean;
}

export function TargetIpField({
  targetIp,
  onTargetIpChange,
  hasSubmitted,
  ipValid,
}: TargetIpFieldProps) {
  const { t } = useTranslation();

  return (
    <InputField
      id="targetIp"
      label={t("createSubdomain.targetIp")}
      value={targetIp}
      onChange={(v) => onTargetIpChange(v.trim())}
      placeholder="203.0.113.42"
      required
      invalid={hasSubmitted && !ipValid}
      error={hasSubmitted && !ipValid ? t("domainDetail.ipInvalid") : null}
      hint={t("createSubdomain.targetIpHint")}
      testId="domain-detail-target-ip-input"
      inputMode="decimal"
    />
  );
}
