import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/components/auth/password-input";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";

import { usePasswordSetupModalLogic } from "./usePasswordSetupModalLogic";

interface PasswordSetupModalProps {
  onDismiss: () => void;
}

export function PasswordSetupModal({ onDismiss }: PasswordSetupModalProps) {
  const { t } = useTranslation();
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPw,
    setShowPw,
    error,
    submitting,
    handleSubmit,
  } = usePasswordSetupModalLogic();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-setup-title"
        className="bg-background border border-border rounded-lg p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl"
      >
        <div className="flex flex-col gap-1">
          <h2 id="password-setup-title" className="text-[18px] font-semibold">
            {t("passwordSetup.title")}
          </h2>
          <p className="text-sm opacity-70">{t("passwordSetup.description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="setup-password">
              {t("passwordSetup.password")}
            </label>
            <PasswordInput
              id="setup-password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={setPassword}
              showPw={showPw}
              onToggleShow={() => setShowPw(!showPw)}
              testId="setup-password-input"
              toggleTestId="setup-toggle-password-btn"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="setup-confirm">
              {t("passwordSetup.confirm")}
            </label>
            <PasswordInput
              id="setup-confirm"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={setConfirm}
              showPw={showPw}
              onToggleShow={() => setShowPw(!showPw)}
              testId="setup-confirm-input"
            />
          </div>

          {error ? <ErrorMessage>{error}</ErrorMessage> : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!password || !confirm || submitting}
            data-testid="setup-submit-btn"
          >
            {submitting
              ? t("passwordSetup.submitting")
              : t("passwordSetup.submit")}
          </Button>
        </form>

        <button
          type="button"
          className="text-sm opacity-50 hover:opacity-80 text-center bg-transparent border-none cursor-pointer"
          onClick={onDismiss}
          data-testid="setup-skip-btn"
        >
          {t("passwordSetup.skip")}
        </button>
      </div>
    </div>
  );
}
