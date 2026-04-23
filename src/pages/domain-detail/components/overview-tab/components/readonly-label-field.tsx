import { useTranslation } from "react-i18next";

import { InputField } from "@/components/ui/input-field";

interface ReadonlyLabelFieldProps {
  label: string;
  fqdn?: string;
}

export function ReadonlyLabelField({ label, fqdn }: ReadonlyLabelFieldProps) {
  const { t } = useTranslation();

  const endDecorator = fqdn
    ? fqdn.slice(fqdn.indexOf("."))
    : ".play.cosy-hosting.net";

  return (
    <InputField
      id="label"
      label={t("createSubdomain.label")}
      value={label}
      onChange={() => {}}
      readOnly
      disabled
      endDecorator={endDecorator}
      testId="domain-detail-label-input"
      hint={t("domainDetail.labelReadonly")}
    />
  );
}
