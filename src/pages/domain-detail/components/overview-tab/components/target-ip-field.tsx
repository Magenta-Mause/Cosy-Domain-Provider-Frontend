import { useTranslation } from "react-i18next";

import { FormField } from "@/components/ui/form-field";

interface TargetIpFieldProps {
  readonly targetIp: string;
  readonly onTargetIpChange: (v: string) => void;
  readonly hasSubmitted: boolean;
  readonly ipValid: boolean;
}

export function TargetIpField({
  targetIp,
  onTargetIpChange,
  hasSubmitted,
  ipValid,
}: TargetIpFieldProps) {
  const { t } = useTranslation();

  return (
    <FormField
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
