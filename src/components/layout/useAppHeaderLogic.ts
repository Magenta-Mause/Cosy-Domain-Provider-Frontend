import { useState } from "react";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { router } from "@/router";

export function useAppHeaderLogic() {
  const { logoutUser, deleteUser, userName, isUserLoggedIn, userTier } =
    useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteUser();
    setShowDeleteModal(false);
    await router.navigate({ to: "/" });
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return {
    userName,
    isUserLoggedIn,
    userTier,
    isLoggingOut,
    handleLogout,
    handleDelete,
    showDeleteModal,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
