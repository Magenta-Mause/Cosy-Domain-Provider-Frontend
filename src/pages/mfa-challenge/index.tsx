import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { MfaCodeForm } from "@/components/auth/mfa-code-form";
import { useMfaChallengeLogic } from "./useMfaChallengeLogic";

const MfaChallengePage = () => {
  const { totpCode, setTotpCode, totpError, isSubmitting, handleConfirm } =
    useMfaChallengeLogic();

  return (
    <AuthPageLayout backButtonLink={null}>
      <MfaCodeForm
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        totpError={totpError}
        isSubmitting={isSubmitting}
        onConfirm={() => void handleConfirm()}
        otpTestId="mfa-challenge-totp-input"
        submitTestId="mfa-challenge-submit-btn"
      />
    </AuthPageLayout>
  );
};

export default MfaChallengePage;
