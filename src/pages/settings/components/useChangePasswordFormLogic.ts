import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { isPasswordWeak, isValidPassword } from "@/lib/validators";

export function useChangePasswordFormLogic(
  onSave: (currentPassword: string, newPassword: string) => Promise<void>,
) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = newPassword === confirmPassword;
  const newPasswordWeak = isPasswordWeak(newPassword);
  const canSubmit =
    currentPassword.length > 0 &&
    isValidPassword(newPassword) &&
    passwordsMatch;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      setError(
        status === 401
          ? t("settings.wrongCurrentPassword")
          : t("settings.passwordError"),
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPw,
    setShowCurrentPw,
    showNewPw,
    setShowNewPw,
    showConfirmPw,
    setShowConfirmPw,
    saving,
    success,
    error,
    newPasswordWeak,
    passwordsMatch,
    canSubmit,
    handleSubmit,
  };
}
