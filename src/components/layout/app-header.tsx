import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { CosyLogo } from "@/components/layout/cosy-logo";
import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";
import TierBadge from "@/components/pixel/tier-badge.tsx";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation.ts";
import { useAppHeaderLogic } from "./useAppHeaderLogic";

interface AppHeaderProps {
  rightSlot?: ReactNode;
  logoLinkTo?: "/dashboard" | "/" | "/admin/subdomains";
}

export function AppHeader({ rightSlot, logoLinkTo }: AppHeaderProps = {}) {
  const { t } = useTranslation();
  const {
    userName,
    isUserLoggedIn,
    isLoggingOut,
    isDeleting,
    handleLogout,
    handleDelete,
    showDeleteModal,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAppHeaderLogic();

  const { userTier } = useAuthInformation();

  const resolvedLogoLink = logoLinkTo ?? (isUserLoggedIn ? "/dashboard" : "/");

  return (
    <>
      <header className="px-7 py-4 flex items-center gap-4 relative z-[5]">
        <CosyLogo linkTo={resolvedLogoLink} testId="header-logo-link" />
        <div className="flex-1" />

        {!rightSlot && <TierBadge tier={userTier ?? "FREE"} />}

        <LanguageMenu />
        {rightSlot ??
          (isUserLoggedIn ? (
            <UserMenu
              userName={userName}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
              onDelete={handleDelete}
            />
          ) : (
            <Link
              to="/login"
              data-testid="header-login-link"
              className="pbtn sm secondary"
            >
              {t("nav.login")}
            </Link>
          ))}
      </header>

      <ConfirmModal
        isOpen={showDeleteModal}
        title={t("nav.deleteUserTitle")}
        description={t("nav.userDeletionConfirm")}
        confirmLabel={t("nav.deleteUserConfirm")}
        cancelLabel={t("nav.deleteUserCancel")}
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
