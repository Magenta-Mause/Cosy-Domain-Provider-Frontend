import { useState } from "react";

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { router } from "@/router";

export function useAppHeaderLogic() {
  const { logoutUser, deleteUser, userName, isUserLoggedIn, userTier } =
    useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    try {
      await deleteUser();
      setShowDeleteModal(false);
      await router.navigate({ to: "/login" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return {
    userName,
    isUserLoggedIn,
    userTier,
    isLoggingOut,
    isDeleting,
    handleLogout,
    handleDelete,
    showDeleteModal,
    handleConfirmDelete,
    handleCancelDelete,
  };
}
