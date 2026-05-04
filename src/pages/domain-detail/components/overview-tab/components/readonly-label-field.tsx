import { useTranslation } from "react-i18next";

import { FormField } from "@/components/ui/form-field";

interface ReadonlyLabelFieldProps {
  readonly label: string;
  readonly fqdn?: string;
}

export function ReadonlyLabelField({ label, fqdn }: ReadonlyLabelFieldProps) {
  const { t } = useTranslation();

  const suffix = fqdn
    ? fqdn.slice(fqdn.indexOf("."))
    : ".play.cosy-hosting.net";

  return (
    <FormField
      id="label"
      label={t("createSubdomain.label")}
      value={label}
      onChange={() => {}}
      readOnly
      disabled
      suffix={suffix}
      testId="domain-detail-label-input"
      hint={t("domainDetail.labelReadonly")}
    />
  );
}
