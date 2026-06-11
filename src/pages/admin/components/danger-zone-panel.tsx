import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";

interface DangerZonePanelProps {
  readonly buttonLabel: string;
  readonly onDelete: () => void;
  readonly isDeleting: boolean;
  readonly error: string | null;
}

export function DangerZonePanel({
  buttonLabel,
  onDelete,
  isDeleting,
  error,
}: DangerZonePanelProps) {
  const { t } = useTranslation();

  return (
    <FlatPanel className="px-5 py-4 flex flex-col gap-3 border border-destructive/40">
      <h3 className="text-sm font-semibold text-destructive uppercase tracking-wide">
        {t("admin.dangerZone")}
      </h3>
      <div className="flex items-center gap-5">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {buttonLabel}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </FlatPanel>
  );
}
