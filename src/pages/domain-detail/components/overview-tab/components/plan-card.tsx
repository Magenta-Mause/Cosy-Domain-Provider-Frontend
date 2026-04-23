import { cn } from "@/lib/utils";

interface PlanCardProps {
  selected: boolean;
  onClick: () => void;
  badge: React.ReactNode;
  label: string;
}

export function PlanCard({ selected, onClick, badge, label }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 text-left p-4 bg-secondary-background rounded-radius transition-colors border-[3px] shadow-pixel",
        selected
          ? "border-accent-2"
          : "border-foreground opacity-70 hover:opacity-100",
      )}
    >
      <div className="flex justify-between items-start mb-3">
        {badge}
        <span className={cn("pcheck", selected && "checked")} aria-hidden />
      </div>
      <p className="text-sm opacity-70">{label}</p>
    </button>
  );
}
