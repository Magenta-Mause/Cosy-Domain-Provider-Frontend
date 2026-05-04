import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type AdminUserDetail, adminApi } from "../../lib";

export function useUserDetailLogic(
  detail: AdminUserDetail,
  adminKey: string,
  onSaved: () => void,
) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Max subdomain override
  const savedOverrideValue =
    detail.maxSubdomainCountOverride === null
      ? ""
      : String(detail.maxSubdomainCountOverride);

  const [overrideInput, setOverrideInput] = useState(savedOverrideValue);
  const [isSavingOverride, setIsSavingOverride] = useState(false);
  const [saveOverrideError, setSaveOverrideError] = useState<string | null>(
    null,
  );

  const isOverrideUnchanged = overrideInput === savedOverrideValue;

  const handleSaveOverride = async () => {
    setIsSavingOverride(true);
    setSaveOverrideError(null);
    try {
      const value = overrideInput.trim() === "" ? null : Number(overrideInput);
      await adminApi.setMaxSubdomainOverride(adminKey, detail.uuid, value);
      onSaved();
    } catch {
      setSaveOverrideError(t("admin.saveOverrideError"));
    } finally {
      setIsSavingOverride(false);
    }
  };

  // Edit user
  const [username, setUsername] = useState(detail.username);
  const [email, setEmail] = useState(detail.email);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [saveUserError, setSaveUserError] = useState<string | null>(null);

  const isUserUnchanged =
    username === detail.username && email === detail.email;

  const handleSaveUser = async () => {
    setIsSavingUser(true);
    setSaveUserError(null);
    try {
      await adminApi.updateUser(adminKey, detail.uuid, {
        username: username === detail.username ? undefined : username,
        email: email === detail.email ? undefined : email,
      });
      onSaved();
    } catch {
      setSaveUserError(t("admin.saveUserError"));
    } finally {
      setIsSavingUser(false);
    }
  };

  // Delete user
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteUser = async () => {
    if (!globalThis.confirm(t("admin.deleteUserConfirm"))) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await adminApi.deleteUser(adminKey, detail.uuid);
      await navigate({ to: "/admin" });
    } catch {
      setDeleteError(t("admin.deleteUserError"));
      setIsDeleting(false);
    }
  };

  const handleBack = () => void navigate({ to: "/admin/users" });

  const handleSubdomainClick = (subdomainId: string) =>
    void navigate({
      to: "/admin/subdomains/$subdomainId",
      params: { subdomainId },
    });

  return {
    overrideInput,
    setOverrideInput,
    isSaving: isSavingOverride,
    saveError: saveOverrideError,
    isUnchanged: isOverrideUnchanged,
    handleSaveOverride,
    username,
    setUsername,
    email,
    setEmail,
    isSavingUser,
    saveUserError,
    isUserUnchanged,
    handleSaveUser,
    isDeleting,
    deleteError,
    handleDeleteUser,
    handleBack,
    handleSubdomainClick,
  };
}
