import { useTranslation } from "react-i18next";

import { SubdomainDtoStatus } from "@/api/generated/model";

const STATUS_COLORS: Record<SubdomainDtoStatus, string> = {
  [SubdomainDtoStatus.ACTIVE]: "oklch(0.7 0.2 145)",
  [SubdomainDtoStatus.PENDING]: "oklch(0.75 0.15 70)",
  [SubdomainDtoStatus.FAILED]: "var(--destructive)",
};

const STATUS_I18N: Record<
  SubdomainDtoStatus,
  "status.active" | "status.pending" | "status.failed"
> = {
  [SubdomainDtoStatus.ACTIVE]: "status.active",
  [SubdomainDtoStatus.PENDING]: "status.pending",
  [SubdomainDtoStatus.FAILED]: "status.failed",
};

export function StatusDot({ status }: { status: SubdomainDtoStatus }) {
  const { t } = useTranslation();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 16,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          background: STATUS_COLORS[status],
          border: "2px solid var(--foreground)",
        }}
      />
      {t(STATUS_I18N[status])}
    </span>
  );
}
