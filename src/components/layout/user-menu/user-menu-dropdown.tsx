import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type UserMenuDropdownProps = {
  isLoggingOut: boolean;
  restricted?: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  onDelete: () => Promise<void>;
};

export function UserMenuDropdown({
  isLoggingOut,
  restricted = false,
  onClose,
  onLogout,
  onDelete,
}: UserMenuDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      role="menu"
      aria-label={t("nav.userMenu")}
      className="absolute grid gap-1.5 p-2 z-30 top-[calc(100%+8px)] right-0 min-w-[220px] bg-btn-secondary border-2 border-foreground rounded-radius-sm"
      style={{ boxShadow: "4px 4px 0 0 var(--foreground)" }}
    >
      <Button
        type="button"
        data-testid="user-menu-change-username-btn"
        variant="ghost"
        size="sm"
        className="justify-start"
        disabled={restricted}
        onClick={() => {
          navigate({ to: "/settings" });
          onClose();
        }}
      >
        {t("nav.userSettings")}
      </Button>
      <Link
        to="/billing"
        data-testid="user-menu-billing-btn"
        className={`pbtn ghost sm justify-start${restricted ? " opacity-40 pointer-events-none" : ""}`}
        onClick={restricted ? undefined : onClose}
        aria-disabled={restricted}
      >
        {t("nav.billing")}
      </Link>
      <Button
        type="button"
        data-testid="user-menu-logout-btn"
        variant="ghost"
        size="sm"
        className="justify-start"
        disabled={isLoggingOut}
        onClick={async () => {
          try {
            await onLogout();
          } finally {
            onClose();
          }
        }}
      >
        {t("nav.logout")}
      </Button>
      <Button
        type="button"
        data-testid="user-menu-delete-user-btn"
        variant="ghost"
        size="sm"
        className="justify-start !text-destructive"
        onClick={onDelete}
      >
        {t("nav.deleteUser")}
      </Button>
    </div>
  );
}
