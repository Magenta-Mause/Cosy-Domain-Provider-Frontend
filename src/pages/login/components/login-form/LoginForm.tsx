import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";

import { useLoginFormLogic } from "./useLoginFormLogic";

export function LoginForm() {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPw,
    setShowPw,
    errorMessage,
    submitting,
    handleSubmit,
  } = useLoginFormLogic();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px]">{t("login.title")}</h2>
      </div>

      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="email">
          {t("login.email")}
        </label>
        <input
          id="email"
          data-testid="login-email-input"
          className="pinput"
          type="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

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
          showPw={showPw}
          onToggleShow={() => setShowPw(!showPw)}
          testId="login-password-input"
          toggleTestId="login-toggle-password-btn"
        />
        {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      </div>

      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
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
        disabled={!email || !password || submitting}
      >
        {submitting ? t("login.submitting") : t("login.submitButton")}
      </Button>

      <p className="text-lg text-center">
        {t("login.noAccount")}{" "}
        <Link to="/register" data-testid="login-register-link-footer">
          {t("login.registerLink")}
        </Link>
      </p>
    </form>
  );
}
