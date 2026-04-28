import { useTranslation } from "react-i18next";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMfaChallengeLogic } from "./useMfaChallengeLogic";

const MfaChallengePage = () => {
  const { t } = useTranslation();
  const { totpCode, setTotpCode, totpError, isSubmitting, handleConfirm } =
    useMfaChallengeLogic();

  return (
    <AuthPageLayout backButtonLink={null}>
      <div className="flex flex-col gap-4">
        <h2 className="text-[22px]">{t("login.mfaTitle")}</h2>
        <p className="text-base opacity-70">{t("login.mfaDescription")}</p>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={totpCode}
            onChange={setTotpCode}
            data-testid="mfa-challenge-totp-input"
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
          data-testid="mfa-challenge-submit-btn"
          size="lg"
          className="w-full"
          disabled={totpCode.length !== 6 || isSubmitting}
          onClick={() => void handleConfirm()}
        >
          {isSubmitting ? t("mfaSetup.submitting") : t("login.mfaSubmit")}
        </Button>
      </div>
    </AuthPageLayout>
  );
};

export default MfaChallengePage;
