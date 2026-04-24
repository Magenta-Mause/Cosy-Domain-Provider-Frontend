import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { adminApi, type AdminUserDetail } from "../../lib";

export function useUserDetailLogic(
  detail: AdminUserDetail,
  adminKey: string,
  onSaved: () => void,
) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const savedValue =
    detail.maxSubdomainCountOverride !== null
      ? String(detail.maxSubdomainCountOverride)
      : "";

  const [overrideInput, setOverrideInput] = useState(savedValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isUnchanged = overrideInput === savedValue;

  const handleSaveOverride = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const value = overrideInput.trim() === "" ? null : Number(overrideInput);
      await adminApi.setMaxSubdomainOverride(adminKey, detail.uuid, value);
      onSaved();
    } catch {
      setSaveError(t("admin.saveOverrideError"));
    } finally {
      setIsSaving(false);
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
    isSaving,
    saveError,
    isUnchanged,
    handleSaveOverride,
    handleBack,
    handleSubdomainClick,
  };
}
