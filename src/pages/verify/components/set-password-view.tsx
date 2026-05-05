import type { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { isPasswordWeak } from "@/lib/validators";
import { PasswordStrength } from "@/pages/register/components/password-strength";

interface SetPasswordViewProps {
  readonly password: string;
  readonly confirmPassword: string;
  readonly passwordError: string | null;
  readonly isSettingPassword: boolean;
  readonly onPasswordChange: (value: string) => void;
  readonly onConfirmChange: (value: string) => void;
  readonly onSubmit: (e: SyntheticEvent) => void;
}

export function SetPasswordView({
  password,
  confirmPassword,
  passwordError,
  isSettingPassword,
  onPasswordChange,
  onConfirmChange,
  onSubmit,
}: SetPasswordViewProps) {
  const { t } = useTranslation();

  const passwordWeak = isPasswordWeak(password);
  const confirmMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit =
    !passwordWeak &&
    !confirmMismatch &&
    password.length > 0 &&
    confirmPassword.length > 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h3>{t("passwordSetup.title")}</h3>
        <div>{t("passwordSetup.descriptionOauth")}</div>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="plabel" htmlFor="verify-password">
            {t("passwordSetup.password")}
          </label>
          <PasswordInput
            id="verify-password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={onPasswordChange}
          />
          <PasswordStrength password={password} />
          {passwordWeak && password.length > 0 ? (
            <ErrorMessage>{t("register.passwordTooShort")}</ErrorMessage>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label className="plabel" htmlFor="verify-confirm">
            {t("passwordSetup.confirm")}
          </label>
          <PasswordInput
            id="verify-confirm"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={onConfirmChange}
          />
          {confirmMismatch ? (
            <ErrorMessage>{t("passwordSetup.mismatch")}</ErrorMessage>
          ) : null}
        </div>
        {passwordError ? <ErrorMessage>{passwordError}</ErrorMessage> : null}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!canSubmit || isSettingPassword}
        >
          {isSettingPassword
            ? t("passwordSetup.submitting")
            : t("passwordSetup.submitContinue")}
        </Button>
      </form>
    </div>
  );
}
