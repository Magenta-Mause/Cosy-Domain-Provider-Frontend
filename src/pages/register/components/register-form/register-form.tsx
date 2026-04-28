import { Turnstile } from "@marsidev/react-turnstile";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import { PasswordStrength } from "../password-strength";
import { useRegisterFormLogic } from "./useRegisterFormLogic";

export function RegisterForm() {
  const { t } = useTranslation();
  const {
    step,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPw,
    setShowPw,
    showConfirmPw,
    setShowConfirmPw,
    agreed,
    setAgreed,
    errorMessage,
    passwordWeak,
    confirmValid,
    canSubmit,
    submitting,
    handleSubmit,
    goBack,
    turnstileRef,
    setCaptchaToken,
  } = useRegisterFormLogic();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-[22px]">{t("register.stakeTitle")}</h2>

      {step === 1 ? (
        <>
          <OAuthButtons variant="register" />

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
            <span className="pixel text-[10px] opacity-70">
              {t("register.orUseEmail")}
            </span>
            <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
          </div>

          <FormField
            id="email"
            label={t("register.email")}
            type="email"
            autoComplete="email"
            required
            placeholder="janne@example.net"
            value={email}
            onChange={setEmail}
            testId="register-email-input"
          />

          <Button
            type="submit"
            data-testid="register-email-continue-btn"
            size="lg"
            className="w-full"
            disabled={!email}
          >
            {t("register.emailContinue")}
          </Button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={goBack}
            data-testid="register-back-btn"
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity w-fit cursor-pointer"
          >
            ← {email}
          </button>

          <FormField
            id="username"
            label={t("register.username")}
            type="text"
            autoComplete="username"
            required
            minLength={3}
            maxLength={20}
            placeholder="your-username"
            value={username}
            onChange={setUsername}
            testId="register-username-input"
          />

          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="password">
              {t("register.password")}
            </label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={setPassword}
              showPw={showPw}
              onToggleShow={() => setShowPw(!showPw)}
              testId="register-password-input"
              toggleTestId="register-toggle-password-btn"
            />
            <PasswordStrength password={password} />
            {passwordWeak ? (
              <ErrorMessage>{t("register.passwordTooShort")}</ErrorMessage>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="confirmPassword">
              {t("register.confirmPassword")}
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPw={showConfirmPw}
              onToggleShow={() => setShowConfirmPw(!showConfirmPw)}
              testId="register-confirm-password-input"
            />
            {!confirmValid && confirmPassword.length > 0 ? (
              <ErrorMessage>{t("register.passwordMismatch")}</ErrorMessage>
            ) : null}
          </div>

          <label className="flex items-center gap-2.5 text-base cursor-pointer">
            <input
              type="checkbox"
              data-testid="register-terms-checkbox"
              className={agreed ? "pcheck checked" : "pcheck"}
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            {t("register.termsPrefix")}{" "}
            <Link
              to="/agb"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-inherit [font-size:inherit]"
              onClick={(e) => e.stopPropagation()}
            >
              {t("register.termsLink")}
            </Link>
            {" "}&{" "}
            <Link
              to="/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-inherit [font-size:inherit]"
              onClick={(e) => e.stopPropagation()}
            >
              {t("register.privacyPolicyLink")}
            </Link>
          </label>

          <Turnstile
            ref={turnstileRef}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            options={{ size: "invisible" }}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />

          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

          <Button
            type="submit"
            data-testid="register-submit-btn"
            size="lg"
            className="w-full"
            disabled={!canSubmit}
          >
            {submitting ? t("register.submitting") : t("register.submitButton")}
          </Button>
        </>
      )}

      <p className="text-lg text-center">
        {t("register.alreadyMovedIn")}{" "}
        <Link to="/login" data-testid="register-login-link">
          {t("register.loginLink")}
        </Link>
      </p>
    </form>
  );
}
