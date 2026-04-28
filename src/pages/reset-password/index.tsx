import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";

import { useResetPasswordLogic } from "./useResetPasswordLogic";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const {
    token,
    newPassword,
    setNewPassword,
    isSubmitting,
    success,
    error,
    handleSubmit,
  } = useResetPasswordLogic();

  if (!token) {
    return (
      <AuthPageLayout backButtonLink="/login">
        <div className="flex flex-col gap-6">
          <h3>{t("resetPassword.title")}</h3>
          <ErrorMessage>{t("resetPassword.invalidToken")}</ErrorMessage>
          <Link to="/forgot-password" className="pbtn ghost text-center">
            {t("resetPassword.requestNew")}
          </Link>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout backButtonLink="/login">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3>{t("resetPassword.title")}</h3>
          <p className="text-base opacity-70">
            {t("resetPassword.description")}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col gap-4">
            <p className="text-base">{t("resetPassword.success")}</p>
            <Link to="/login" className="pbtn ghost text-center">
              {t("resetPassword.backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="plabel" htmlFor="new-password">
                {t("resetPassword.newPassword")}
              </label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={setNewPassword}
                testId="reset-password-input"
              />
            </div>
            {error ? <ErrorMessage>{error}</ErrorMessage> : null}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={newPassword.length < 8 || isSubmitting}
              data-testid="reset-password-submit-btn"
            >
              {isSubmitting
                ? t("resetPassword.submitting")
                : t("resetPassword.submit")}
            </Button>
            <p className="text-base text-center opacity-70">
              <Link to="/login" data-testid="reset-password-back-link">
                {t("resetPassword.backToLogin")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;
