import { type SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { isValidUsername } from "@/lib/validators";

export function useChangeUsernameFormLogic(
  currentUsername: string | null,
  onSave: (newUsername: string) => Promise<void>,
) {
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState(() => currentUsername ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    isValidUsername(newUsername) && newUsername !== currentUsername;

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(newUsername);
      setSuccess(true);
    } catch {
      setError(t("settings.usernameError"));
    } finally {
      setSaving(false);
    }
  }

  return {
    newUsername,
    setNewUsername,
    saving,
    success,
    error,
    canSubmit,
    handleSubmit,
  };
}
