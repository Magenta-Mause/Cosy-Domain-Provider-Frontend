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
    <span className="inline-flex items-center gap-1.5 text-base">
      <span
        className="w-2.5 h-2.5 border-2 border-foreground"
        style={{ background: STATUS_COLORS[status] }}
      />
      {t(STATUS_I18N[status])}
    </span>
  );
}
