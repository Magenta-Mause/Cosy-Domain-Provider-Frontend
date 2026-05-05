import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { UserMenuDropdown } from "./user-menu-dropdown";
import { useUserMenuLogic } from "./useUserMenuLogic";

type UserMenuProps = {
  readonly userName?: string | null;
  readonly isLoggingOut: boolean;
  readonly restricted?: boolean;
  readonly onLogout: () => Promise<void>;
  readonly onDelete: () => Promise<void>;
};

export function UserMenu({
  userName,
  isLoggingOut,
  restricted = false,
  onLogout,
  onDelete,
}: UserMenuProps) {
  const { t } = useTranslation();
  const { menuOpen, setMenuOpen, menuRef, initial } =
    useUserMenuLogic(userName);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        data-testid="user-menu-toggle-btn"
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={isLoggingOut}
        onClick={() => setMenuOpen((open) => !open)}
        title={t("nav.userMenu")}
      >
        <span
          className="inline-flex items-center justify-center w-[22px] h-[22px] text-xs rounded-[2px] bg-accent border-2 border-foreground text-btn-primary"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {initial}
        </span>
        {userName ?? t("nav.userMenu")}
      </Button>
      {menuOpen ? (
        <UserMenuDropdown
          isLoggingOut={isLoggingOut}
          restricted={restricted}
          onClose={() => setMenuOpen(false)}
          onLogout={onLogout}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  );
}
