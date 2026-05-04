import { useTranslation } from "react-i18next";

import { SubdomainDtoStatus } from "@/api/generated/model";
import { Button } from "@/components/ui/button";

type FilterValue = "all" | SubdomainDtoStatus;

interface FilterBarProps {
  readonly filter: FilterValue;
  readonly onChange: (value: FilterValue) => void;
}

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const { t } = useTranslation();

  const filters: Array<[FilterValue, string]> = [
    ["all", t("dashboard.filterAll")],
    [SubdomainDtoStatus.ACTIVE, t("status.active")],
    [SubdomainDtoStatus.PENDING, t("status.pending")],
    [SubdomainDtoStatus.FAILED, t("status.failed")],
  ];

  return (
    <div className="flex gap-2 mb-4 items-center">
      {filters.map(([k, l]) => (
        <Button
          key={k}
          type="button"
          data-testid={`dashboard-filter-${String(k).toLowerCase()}-btn`}
          variant={filter === k ? "default" : "secondary"}
          size="sm"
          onClick={() => onChange(k)}
        >
          {l}
        </Button>
      ))}
    </div>
  );
}
