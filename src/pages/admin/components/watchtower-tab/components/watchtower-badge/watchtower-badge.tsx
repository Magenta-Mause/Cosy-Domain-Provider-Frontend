import { useTranslation } from "react-i18next";

import type { WatchtowerCategory } from "@/api/admin-api";

import { categoryAccent } from "../../lib";

interface WatchtowerBadgeProps {
  readonly category: WatchtowerCategory;
}

export function WatchtowerBadge({ category }: WatchtowerBadgeProps) {
  const { t } = useTranslation("admin");
  const accent = categoryAccent(category);

  return (
    <span
      className={`pixel text-[9px] border-2 border-foreground rounded-radius-sm px-2 py-1 whitespace-nowrap ${accent.badge}`}
      data-testid={`watchtower-badge-${category}`}
    >
      {t(`watchtower.category.${category}`)}
    </span>
  );
}
