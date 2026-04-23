import { useTranslation } from "react-i18next";
import { Badge } from "@/components/pixel/badge";
import { cn } from "@/lib/utils";
import type { NamingMode } from "../useCreateSubdomainLogic";

interface PlanCardProps {
  selected: boolean;
  onClick: () => void;
  badge: React.ReactNode;
  description: string;
}

function PlanCard({ selected, onClick, badge, description }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 text-left p-4 bg-[var(--secondary-background)] rounded-[var(--radius)] transition-colors border-[3px]",
        selected
          ? "border-[var(--accent-2)]"
          : "border-[var(--foreground)] opacity-70 hover:opacity-100",
      )}
      style={{ boxShadow: "4px 4px 0 0 var(--shadow)" }}
    >
      <div className="flex justify-between items-start mb-3">
        {badge}
        <span className={cn("pcheck", selected && "checked")} aria-hidden />
      </div>
      <p className="text-sm opacity-70">{description}</p>
    </button>
  );
}

interface PlanSelectorProps {
  namingMode: NamingMode;
  onSelect: (mode: NamingMode) => void;
}

export function PlanSelector({ namingMode, onSelect }: PlanSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <span className="plabel">{t("createSubdomain.planSection")}</span>
      <div className="flex gap-3">
        <PlanCard
          selected={namingMode === "random"}
          onClick={() => onSelect("random")}
          badge={<Badge color="gray" className="py-1">Free</Badge>}
          description={t("createSubdomain.randomName")}
        />
        <PlanCard
          selected={namingMode === "custom"}
          onClick={() => onSelect("custom")}
          badge={<Badge color="accent" className="py-1">Cosy+</Badge>}
          description={t("createSubdomain.customName")}
        />
      </div>
    </div>
  );
}
