import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMfaSetupLogic } from "./useMfaSetupLogic";

export function MfaSetupPage() {
  const { t } = useTranslation();
  const {
    totpUri,
    secret,
    totpCode,
    setTotpCode,
    isLoading,
    isConfirming,
    setupError,
    confirmError,
    handleConfirm,
  } = useMfaSetupLogic();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="text-base opacity-70">Loading...</div>
      </div>
    );
  }

  if (setupError) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <ErrorMessage>{setupError}</ErrorMessage>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px]">{t("mfaSetup.title")}</h2>
        <p className="text-base opacity-70">{t("mfaSetup.description")}</p>
      </div>

      {totpUri ? (
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-md">
            <QRCodeSVG value={totpUri} size={180} data-testid="mfa-qr-code" />
          </div>
        </div>
      ) : null}

      {secret ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-60">{t("mfaSetup.manualEntry")}</p>
          <code
            className="text-sm font-mono break-all opacity-80 select-all"
            data-testid="mfa-secret"
          >
            {secret}
          </code>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <p className="text-base font-medium">{t("mfaSetup.inputTitle")}</p>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={totpCode}
            onChange={setTotpCode}
            data-testid="mfa-totp-input"
            autoFocus
            disabled={isConfirming}
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
        {confirmError ? <ErrorMessage>{confirmError}</ErrorMessage> : null}
      </div>

      <Button
        type="button"
        data-testid="mfa-confirm-btn"
        size="lg"
        className="w-full"
        disabled={totpCode.length !== 6 || isConfirming}
        onClick={() => void handleConfirm()}
      >
        {isConfirming ? t("mfaSetup.submitting") : t("mfaSetup.submit")}
      </Button>
    </div>
  );
}
