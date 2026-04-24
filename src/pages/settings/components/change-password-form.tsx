import { useTranslation } from "react-i18next";

import eyeClosedIcon from "@/assets/eye-closed.webp";
import eyeOpenIcon from "@/assets/eye-open.webp";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Icon } from "@/components/ui/icon";

import { useChangePasswordFormLogic } from "./useChangePasswordFormLogic";

interface ChangePasswordFormProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

function EyeToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={show ? "Hide password" : "Show password"}
      onClick={onToggle}
      className="opacity-70 hover:opacity-100 flex items-center"
    >
      <Icon src={show ? eyeOpenIcon : eyeClosedIcon} className="size-6" />
    </button>
  );
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
  } = useChangePasswordFormLogic(onSave);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        id="current-password"
        label={t("settings.currentPassword")}
        type={showCurrentPw ? "text" : "password"}
        autoComplete="current-password"
        required
        value={currentPassword}
        onChange={setCurrentPassword}
        testId="settings-current-password-input"
        endDecorator={
          <EyeToggle
            show={showCurrentPw}
            onToggle={() => setShowCurrentPw(!showCurrentPw)}
          />
        }
      />

      <FormField
        id="new-password"
        label={t("settings.newPassword")}
        type={showNewPw ? "text" : "password"}
        autoComplete="new-password"
        required
        minLength={8}
        value={newPassword}
        onChange={setNewPassword}
        testId="settings-new-password-input"
        error={newPasswordWeak ? t("settings.passwordTooShort") : null}
        endDecorator={
          <EyeToggle
            show={showNewPw}
            onToggle={() => setShowNewPw(!showNewPw)}
          />
        }
      />

      <FormField
        id="confirm-new-password"
        label={t("settings.confirmNewPassword")}
        type={showConfirmPw ? "text" : "password"}
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={setConfirmPassword}
        testId="settings-confirm-password-input"
        error={
          !passwordsMatch && confirmPassword.length > 0
            ? t("settings.passwordMismatch")
            : null
        }
        endDecorator={
          <EyeToggle
            show={showConfirmPw}
            onToggle={() => setShowConfirmPw(!showConfirmPw)}
          />
        }
      />

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
