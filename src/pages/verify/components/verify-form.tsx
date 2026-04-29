import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerifyFormProps {
  userEmail: string | null | undefined;
  verificationToken: string;
  isVerifying: boolean;
  isSending: boolean;
  resendSent: boolean;
  verifyError: string | null;
  resendError: string | null;
  isBusy: boolean;
  onTokenChange: (code: string) => void;
  onVerify: () => void;
  onResend: () => void;
}

export function VerifyForm({
  userEmail,
  verificationToken,
  isVerifying,
  isSending,
  resendSent,
  verifyError,
  resendError,
  isBusy,
  onTokenChange,
  onVerify,
  onResend,
}: VerifyFormProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h3>{t("verify.inputTitle")}</h3>
        <div>{t("verify.inputDescription", { email: userEmail ?? "" })}</div>
      </div>
      <div className="w-full flex justify-center">
        <InputOTP
          value={verificationToken}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          pasteTransformer={(text) => text.replace(/[-\s]/g, "")}
          onChange={onTokenChange}
          disabled={isBusy}
          data-testid="verify-code-input"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-col gap-3">
        {verifyError ? <ErrorMessage>{verifyError}</ErrorMessage> : null}
        <Button
          onClick={onVerify}
          disabled={verificationToken.length !== 6 || isBusy}
          data-testid="verify-submit-btn"
        >
          {isVerifying ? "Verifying…" : "Verify"}
        </Button>
        {resendError ? <ErrorMessage>{resendError}</ErrorMessage> : null}
        <Button
          variant="ghost"
          className="flex gap-3"
          disabled={isBusy}
          onClick={onResend}
        >
          <RotateCw size="18px" />
          <span>
            {isSending
              ? t("verify.sendingBtn")
              : resendSent
                ? "Code sent!"
                : "Resend Verification Code"}
          </span>
        </Button>
      </div>
    </div>
  );
}
