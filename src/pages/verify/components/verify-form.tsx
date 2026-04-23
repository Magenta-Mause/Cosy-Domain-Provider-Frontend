import { RotateCw } from "lucide-react";

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
  isResending: boolean;
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
  isResending,
  resendSent,
  verifyError,
  resendError,
  isBusy,
  onTokenChange,
  onVerify,
  onResend,
}: VerifyFormProps) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h3>Check your mailbox</h3>
        <div>
          We sent a 6-letter code to {userEmail}. Paste it below to move in.
        </div>
      </div>
      <div className="w-full flex justify-center">
        <InputOTP
          value={verificationToken}
          maxLength={6}
          onChange={onTokenChange}
          onPasteCapture={console.log}
          disabled={isBusy}
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
            {isResending
              ? "Sending…"
              : resendSent
                ? "Code sent!"
                : "Resend Verification Code"}
          </span>
        </Button>
      </div>
    </div>
  );
}
