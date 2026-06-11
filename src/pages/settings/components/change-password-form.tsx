import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";

import { useChangePasswordFormLogic } from "./useChangePasswordFormLogic";

interface ChangePasswordFormProps {
  readonly onSave: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

export function ChangePasswordForm({ onSave }: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    saving,
    success,
    error,
    newPasswordWeak,
    passwordsMatch,
    canSubmit,
    handleSubmit,
  } = useChangePasswordFormLogic(onSave);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PasswordField
        id="current-password"
        label={t("settings.currentPassword")}
        autoComplete="current-password"
        required
        placeholder="••••••••"
        value={currentPassword}
        onChange={setCurrentPassword}
        testId="settings-current-password-input"
      />

      <PasswordField
        id="new-password"
        label={t("settings.newPassword")}
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="••••••••"
        value={newPassword}
        onChange={setNewPassword}
        testId="settings-new-password-input"
        error={newPasswordWeak ? t("settings.passwordTooShort") : null}
      />

      <PasswordField
        id="confirm-new-password"
        label={t("settings.confirmNewPassword")}
        autoComplete="new-password"
        required
        placeholder="••••••••"
        value={confirmPassword}
        onChange={setConfirmPassword}
        testId="settings-confirm-password-input"
        error={
          !passwordsMatch && confirmPassword.length > 0
            ? t("settings.passwordMismatch")
            : null
        }
      />

      {success && (
        <div
          data-testid="settings-password-success"
          className="text-xl text-accent-2"
        >
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
