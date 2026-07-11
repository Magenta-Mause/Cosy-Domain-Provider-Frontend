import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type MfaCodeFormProps = {
  readonly totpCode: string;
  readonly setTotpCode: (value: string) => void;
  readonly totpError: string | null;
  readonly isSubmitting: boolean;
  readonly onConfirm: () => void;
  readonly email?: string;
  readonly otpTestId?: string;
  readonly submitTestId?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
};

export function MfaCodeForm({
  totpCode,
  setTotpCode,
  totpError,
  isSubmitting,
  onConfirm,
  email,
  otpTestId,
  submitTestId,
  header,
  footer,
}: MfaCodeFormProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {header}

      <div className="flex flex-col gap-2">
        <h2 className="text-[22px]">{t("login.mfaTitle")}</h2>
        <p className="text-base opacity-70">{t("login.mfaDescription")}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={totpCode}
          onChange={setTotpCode}
          data-testid={otpTestId}
          autoFocus
          disabled={isSubmitting}
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

      <Button
        type="button"
        data-testid={submitTestId}
        size="lg"
        className="w-full"
        disabled={totpCode.length !== 6 || isSubmitting}
        onClick={onConfirm}
      >
        {isSubmitting ? t("mfaSetup.submitting") : t("login.mfaSubmit")}
      </Button>

      <p className="text-base text-center opacity-70">
        {t("login.mfaResetHint")}{" "}
        <Link
          to="/forgot-password"
          search={email ? { email } : {}}
          className="underline"
        >
          {t("login.mfaResetLink")}
        </Link>
      </p>

      {footer}
    </div>
  );
}
