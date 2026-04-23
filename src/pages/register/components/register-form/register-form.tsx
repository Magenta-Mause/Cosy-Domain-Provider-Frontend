import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";

import { PasswordStrength } from "../password-strength";
import { OrDivider } from "./components/or-divider";
import { useRegisterFormLogic } from "./useRegisterFormLogic";

export function RegisterForm() {
  const { t } = useTranslation();
  const {
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
    agreed,
    setAgreed,
    errorMessage,
    passwordWeak,
    confirmValid,
    canSubmit,
    submitting,
    handleSubmit,
  } = useRegisterFormLogic();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px]">{t("register.stakeTitle")}</h2>
      </div>

      <OrDivider />

      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="username">
          {t("register.username")}
        </label>
        <input
          id="username"
          data-testid="register-username-input"
          className="pinput"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          placeholder="your-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="plabel" htmlFor="email">
          {t("register.email")}
        </label>
        <input
          id="email"
          data-testid="register-email-input"
          className="pinput"
          type="email"
          autoComplete="email"
          required
          placeholder="janne@example.net"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

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
          showPw={showPw}
          onToggleShow={() => setShowPw(!showPw)}
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
        <button
          type="button"
          className="bg-transparent border-none p-0 cursor-pointer underline text-inherit [font-size:inherit]"
        >
          {t("register.termsLink")}
        </button>{" "}
        &{" "}
        <button
          type="button"
          className="bg-transparent border-none p-0 cursor-pointer underline text-inherit [font-size:inherit]"
        >
          {t("register.privacyPolicyLink")}
        </button>
      </label>

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
      <p className="text-lg text-center">
        {t("register.alreadyMovedIn")}{" "}
        <Link to="/login" data-testid="register-login-link">
          {t("register.loginLink")}
        </Link>
      </p>
    </form>
  );
}
