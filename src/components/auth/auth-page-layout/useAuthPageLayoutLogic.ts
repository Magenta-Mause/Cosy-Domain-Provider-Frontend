import { useState } from "react";
import { useTranslation } from "react-i18next";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { router } from "@/router";

export function useAuthPageLayoutLogic() {
  const { t } = useTranslation();
  const { logoutUser, deleteUser, userName, isUserLoggedIn } =
    useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await router.navigate({ to: "/login" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(t("nav.userDeletionConfirm"))) {
      await deleteUser();
      await router.navigate({ to: "/login" });
    }
  };

  return { userName, isUserLoggedIn, isLoggingOut, handleLogout, handleDelete };
}
