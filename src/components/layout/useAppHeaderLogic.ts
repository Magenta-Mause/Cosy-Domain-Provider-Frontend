import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { useLanguageChange } from "@/hooks/useLanguageChange/useLanguageChange";

export function useAppHeaderLogic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser, userName, isUserLoggedIn, deleteUser } =
    useAuthInformation();
  const { handleLanguageChange } = useLanguageChange();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await navigate({ to: "/login" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(t("nav.userDeletionConfirm"))) {
      await deleteUser();
    }
  };

  return {
    userName,
    isUserLoggedIn,
    isLoggingOut,
    handleLanguageChange,
    handleLogout,
    handleDelete,
  };
}
