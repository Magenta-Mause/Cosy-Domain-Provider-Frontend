import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import {
  isPasswordWeak,
  isValidPassword,
} from "@/pages/register/components/register-form/lib";

interface ChangePasswordFormProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function ChangePasswordForm({ onSave }: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = newPassword === confirmPassword;
  const newPasswordWeak = isPasswordWeak(newPassword);
  const canSubmit =
    currentPassword.length > 0 &&
    isValidPassword(newPassword) &&
    passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="current-password">
          {t("settings.currentPassword")}
        </label>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={setCurrentPassword}
          showPw={showPw}
          onToggleShow={() => setShowPw(!showPw)}
          testId="settings-current-password-input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="new-password">
          {t("settings.newPassword")}
        </label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={setNewPassword}
          showPw={showPw}
          onToggleShow={() => setShowPw(!showPw)}
          testId="settings-new-password-input"
        />
        {newPasswordWeak && (
          <ErrorMessage>{t("settings.passwordTooShort")}</ErrorMessage>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="confirm-new-password">
          {t("settings.confirmNewPassword")}
        </label>
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPw={showPw}
          onToggleShow={() => setShowPw(!showPw)}
          testId="settings-confirm-password-input"
        />
        {!passwordsMatch && confirmPassword.length > 0 && (
          <ErrorMessage>{t("settings.passwordMismatch")}</ErrorMessage>
        )}
      </div>

      {success && (
        <div className="text-xl text-accent-2">
          {t("settings.passwordSuccess")}
        </div>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Button
        type="submit"
        data-testid="settings-password-submit-btn"
        disabled={!canSubmit || saving}
        className="w-fit"
      >
        {saving ? t("settings.saving") : t("settings.saveButton")}
      </Button>
    </form>
  );
}
