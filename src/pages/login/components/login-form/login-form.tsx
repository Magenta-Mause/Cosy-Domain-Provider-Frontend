import { Turnstile } from "@marsidev/react-turnstile";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useLoginFormLogic } from "./useLoginFormLogic";

export function LoginForm() {
  const { t } = useTranslation();
  const {
    step,
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    errorMessage,
    oauthError,
    submitting,
    captchaReady,
    handleSubmit,
    goBack,
    turnstileRef,
    setCaptchaToken,
    totpCode,
    setTotpCode,
    totpError,
  } = useLoginFormLogic();

  if (step === 3) {
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={goBack}
          data-testid="login-mfa-back-btn"
          className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity w-fit cursor-pointer"
        >
          ← {email}
        </button>

        <div className="flex flex-col gap-2">
          <h2 className="text-[22px]">{t("login.mfaTitle")}</h2>
          <p className="text-base opacity-70 mt-1">
            {t("login.mfaDescription")}
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={totpCode}
            onChange={setTotpCode}
            data-testid="login-totp-input"
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {totpError ? <ErrorMessage>{totpError}</ErrorMessage> : null}

        <p className="text-base text-center opacity-70">
          {t("login.mfaResetHint")}{" "}
          <Link to="/forgot-password" search={{ email }} className="underline">
            {t("login.mfaResetLink")}
          </Link>
        </p>

        <p className="text-base text-center opacity-70">
          {t("login.noAccount")}{" "}
          <Link
            to="/register"
            data-testid="login-register-link-footer"
            className="underline"
          >
            {t("login.registerLink")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-[22px]">{t("login.title")}</h2>

      {oauthError ? <ErrorMessage>{t("login.oauthError")}</ErrorMessage> : null}

      {step === 1 ? (
        <>
          <OAuthButtons variant="login" />

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
            <span className="pixel text-[10px] opacity-70">
              {t("login.orEmail")}
            </span>
            <div className="flex-1 h-[3px] opacity-40 bg-foreground" />
          </div>

          <FormField
            id="email"
            label={t("login.email")}
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={setEmail}
            testId="login-email-input"
            error={emailError}
          />

          <Button
            type="submit"
            data-testid="login-email-continue-btn"
            size="lg"
            className="w-full"
            disabled={!email}
          >
            {t("login.emailContinue")}
          </Button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={goBack}
            data-testid="login-back-btn"
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity w-fit cursor-pointer"
          >
            ← {email}
          </button>

          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="password">
              {t("login.password")}
            </label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={setPassword}
              testId="login-password-input"
              toggleTestId="login-toggle-password-btn"
            />
            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              search={{ email }}
              data-testid="login-forgot-password-link"
              className="text-base"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            data-testid="login-submit-btn"
            size="lg"
            className="w-full"
            disabled={!password || submitting || !captchaReady}
          >
            {submitting
              ? t("login.submitting")
              : !captchaReady
                ? t("login.captchaLoading")
                : t("login.submitButton")}
          </Button>

          <Turnstile
            ref={turnstileRef}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            options={{ size: "invisible" }}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />
        </>
      )}

      <p className="text-base text-center opacity-70">
        {t("login.noAccount")}{" "}
        <Link to="/register" data-testid="login-register-link-footer">
          {t("login.registerLink")}
        </Link>
      </p>
    </form>
  );
}
